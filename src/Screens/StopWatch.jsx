import React, { useEffect, useRef } from "react";

import { View, Text, StyleSheet, Image } from "react-native";
import { useState } from "react";
import ActivityCard from "../components/common/ActivityCard";
import EventCard from "../components/common/EventCard";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { setMarathon } from "../reduxToolkit/marathon/marathonSlice";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import Constants from "expo-constants";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  Polyline,
  UrlTile,
} from "react-native-maps";
import { ImagesSource } from "../assets/images/images";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { addActivity } from "../api";
const LOCATION_TRACKING = "location-tracking";

const StopWatch = ({ navigation }) => {
  const dispatch = useDispatch();
  const [selectedType, setSelectedType] = useState({});
  const activityState = useSelector((store) => store.activity);
  const map = useRef(null);
  const markerRef = useRef(null);
  const polylineref = useRef(null);
  const [currentScreen, setCurrentScreen] = useState("watch");
  const [currentLocation, setCurrentLocation] = useState({});
  const [routeTracker, setRouteTracker] = useState([]);
  const [distance, setDistance] = useState(0);

  const [locationStarted, setLocationStarted] = useState(false);
  const [urlTile, setUrlTile] = useState(
    "https://tile.openstreetmap.de/{z}/{x}/{y}.png"
  );

  const [isRunning, setIsRunning] = useState(true);
  const [startTime, setStartTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);

  const handleActivityStop = async () => {
    stopLocation();
    const data = {
      activity_type: activityState?.activity?.name,
      duration: elapsedTime,
      distance,
      start_time: startTime,
      end_time: new Date(),
      route: {
        start_point: routeTracker[0],
        end_point: routeTracker[routeTracker.length - 1],
        waypoints: routeTracker,
        distance,
      },
    };

    const response = await addActivity(data);

    if (response.workout) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "shareactivity",
            params: {
              time: formatTime(elapsedTime),
              distance,
            },
          },
        ],
      });
    }
  };

  useEffect(() => {
    console.log(urlTile);
  }, [urlTile]);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        const currentTime = new Date();
        const elapsed = currentTime - startTime;
        setElapsedTime(elapsed);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getCurrentPace = () => {
    if (startTime) {
      const currentTime = new Date().getTime();
      const elapsedTime = (currentTime - startTime) / 1000; // convert to seconds
      return (distance / elapsedTime).toFixed(2); // pace in km/s
    }
    return 0;
  };

  const getAveragePace = () => {
    if (elapsedTime > 0) {
      return ((distance / elapsedTime) * 1000).toFixed(2); // pace in km/s
    }
    return 0;
  };

  function updateDistance() {
    const prevcoords = routeTracker[routeTracker.length - 2];
    const newcoords = routeTracker[routeTracker.length - 1];

    if (prevcoords && newcoords) {
      const R = 6371; // Earth's radius in kilometers

      const lat1 = prevcoords.latitude;
      const lon1 = prevcoords.longitude;
      const lat2 = newcoords.latitude;
      const lon2 = newcoords.longitude;

      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c * 1000; // Convert to meters

      setDistance((prevState) => prevState + distance);

      return distance;
    }
  }

  const fetchCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    setCurrentLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const startLocationTracking = async () => {
    stopLocation();
    await TaskManager.defineTask(
      LOCATION_TRACKING,
      ({ data: { locations }, error }) => {
        if (error) {
          // check `error.message` for more details.
          console.log(error);
          return;
        }
        if (locations[0]?.coords) {
          setCurrentLocation(locations[0]?.coords);
        }
        // console.log("Received new locations", locations[0]?.coords);
      }
    );

    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 0,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Location Tracking",
        notificationBody: "Tracking your location for routing purposes",
        notificationColor: "#FF0000",
      },
      pausesUpdatesAutomatically: false,
      deferredUpdatesInterval: 1000,
      deferredUpdatesDistance: 0,
      deferredUpdatesTimeout: 1000,
    });
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING
    );
    setLocationStarted(hasStarted);
    console.log("tracking started?", hasStarted);
  };

  const startLocation = () => {
    startLocationTracking();
  };

  const stopLocation = () => {
    setLocationStarted(false);
    TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING).then((tracking) => {
      if (tracking) {
        Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
      }
    });
  };

  useEffect(() => {
    const config = async () => {
      let resf = await Location.requestForegroundPermissionsAsync();
      let resb = await Location.requestBackgroundPermissionsAsync();
      if (resf.status != "granted" && resb.status !== "granted") {
        console.log("Permission to access location was denied");
      } else {
        console.log("Permission to access location granted");
        startLocation();
      }
    };

    config();
  }, []);

  useEffect(() => {
    if (currentLocation.latitude) {
      setRouteTracker((prevState) => [
        ...prevState,
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
      ]);

      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(currentLocation, 200);
      }
      if (map.current) {
        map?.current?.getCamera().then((cam) => {
          cam.center = {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          };
          cam.zoom = cam.zoom > 12 ? cam.zoom : 16;
          map?.current?.animateCamera(cam);
        });
      }
    }
  }, [currentLocation]);

  useEffect(() => {
    polylineref.current?.setNativeProps({
      coordinates: routeTracker,
    });

    updateDistance();
  }, [routeTracker]);

  useEffect(() => {
    if (!isRunning) {
      setStartTime(new Date() - elapsedTime);
      stopLocation();
    } else {
      // startLocation()
    }
  }, [isRunning]);

  return (
    <View style={styles.mainContainer}>
      {/* <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={styles.backButton}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity> */}
      <View
        style={[
          styles.stopWatchContainer,
          {
            paddingTop: currentScreen === "watch" ? 16 : 0,
            paddingHorizontal: currentScreen === "watch" ? 16 : 0,
          },
        ]}
      >
        <View
          style={{
            display: currentScreen === "map" ? "none" : "flex",
            width: "100%",
          }}
        >
          <View style={styles.stopWatchSubCont}>
            <View style={styles.timeWithIcon}>
              <Ionicons name="alarm" size={24} color="#666666" />
              <Text style={styles.textwithSymbol}>Time</Text>
            </View>

            <Text style={styles.textwithSymbol}>{formatTime(elapsedTime)}</Text>
          </View>
          <View style={styles.stopWatchSubCont}>
            <View style={styles.timeWithIcon}>
              <Ionicons name="location" size={24} color="#666666" />

              <Text style={styles.textwithSymbol}>Distance</Text>
            </View>
            <Text style={styles.textwithSymbol}>
              {`${(distance / 1000).toFixed(2)} KM`}
            </Text>
          </View>
          <View style={styles.stopWatchSubCont}>
            <Text style={styles.textwithSymbol}>Calories</Text>
            <Text style={styles.textwithSymbol}>0.00</Text>
          </View>
          <View style={styles.stopWatchSubCont}>
            <Text style={styles.textwithSymbol}>Current Pace</Text>
            <Text style={styles.textwithSymbol}>{getCurrentPace()}</Text>
          </View>
          <View style={styles.stopWatchSubCont}>
            <Text style={styles.textwithSymbol}>Average Pace</Text>
            <Text style={styles.textwithSymbol}>{getAveragePace()}</Text>
          </View>
        </View>

        <View
          style={{
            width: "100%",
            ...(currentScreen === "map"
              ? { flex: 1 }
              : { height: 1, position: "absolute", width: 1, bottom: -1000 }),
          }}
        >
          <MapView
            ref={map}
            mapType="none"
            provider={PROVIDER_DEFAULT}
            rotateEnabled={false}
            style={{ height: "110%" }}
            initialRegion={{
              latitude: 18.564963,
              longitude: 73.772386,
              latitudeDelta: 10,
              longitudeDelta: 10,
            }}
            region={{
              latitude: 18.564963,
              longitude: 73.772386,
              latitudeDelta: 10,
              longitudeDelta: 10,
            }}
          >
            <UrlTile
              key={urlTile}
              urlTemplate={urlTile}
              // urlTemplate="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              zIndex={-1}
            />

            <Polyline
              ref={polylineref}
              coordinates={routeTracker}
              strokeColor={"#FF0000"}
              strokeWidth={5}
            />

            <Marker.Animated
              anchor={{ x: 0.5, y: 0.5 }}
              ref={markerRef}
              // image={ImagesSource.Maps.marker}
              title="Current Location"
              coordinate={
                currentLocation.latitude
                  ? currentLocation
                  : { latitude: 12.174495, longitude: 60.614503 }
              }
            >
              <Image
                source={ImagesSource.Maps.marker}
                width={20}
                height={20}
                style={{ width: 60, height: 60 }}
              />
            </Marker.Animated>
          </MapView>
        </View>

        {currentScreen === "map" && (
          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              width: 48,
              height: 48,
              borderRadius: 48,
              backgroundColor: "#fff",
              marginBottom: 24,
              alignSelf: "flex-end",
              elevation: 5,
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 16,
              position: "absolute",
              top: 16,
              right: 0,
            }}
            onPress={() => {
              setUrlTile((prevState) =>
                prevState ===
                `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`
                  ? "https://tile.openstreetmap.de/{z}/{x}/{y}.png"
                  : `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`
              );
            }}
          >
            <Ionicons name="earth" size={24} color="#666666" />
          </TouchableOpacity>
        )}

        <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              width: 48,
              height: 48,
              borderRadius: 48,
              backgroundColor: "#fff",
              marginBottom: 24,
              alignSelf: "flex-end",
              elevation: 5,
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: currentScreen === "map" ? 16 : 0,
            }}
            onPress={() => {
              setCurrentScreen((prevState) =>
                prevState === "map" ? "watch" : "map"
              );
            }}
          >
            {currentScreen === "map" ? (
              <Ionicons name="alarm" size={24} color="#666666" />
            ) : (
              <FontAwesome name="map-marker" size={24} color="#666666" />
            )}
          </TouchableOpacity>
          <View
            style={[
              styles.buttonCont,
              { paddingHorizontal: currentScreen === "map" ? 16 : 0 },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.stopBUtton}
              onPress={() => {
                stopLocation();
                handleActivityStop();
              }}
            >
              <FontAwesome
                name="stop"
                size={16}
                color="#FFF"
                style={styles.stopIcon}
              />
              <Text style={styles.buttonText}>STOP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.pauseBUtton}
              onPress={() => {
                if (!isRunning) {
                  startLocation();
                }
                setIsRunning((prevState) => !prevState);
              }}
            >
              <FontAwesome
                name={isRunning ? "pause" : "play"}
                size={16}
                color="#FFF"
                style={styles.stopIcon}
              />
              <Text style={styles.buttonText}>
                {isRunning ? "Pause" : "Resume"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* <Button color={"#0064AD"} label="Next" onPress={handleNext} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  stopWatchContainer: {
    //   height: 628,
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },

  mainContainer: {
    flex: 1,
    // flexDirection: "column",
    // justifyContent: "flex-start",
    // alignItems: "flex-start",
    // paddingTop: 44,
    // paddingBottom: 0,
    // paddingTop: Constants.statusBarHeight,
    backgroundColor: "#fff",
  },
  timeWithIcon: {
    flexDirection: "row",
    gap: 16,
  },
  stopWatchSubCont: {
    backgroundColor: "#FFF",
    width: "100%",
    // height: 48,
    paddingVertical: 12,
    paddingHorizontal: 16,
    // marginTop: 6,
    marginBottom: 8,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textwithSymbol: {
    color: "#666",
    fontSize: 20,
    fontWeight: "400",
    // paddingHorizontal: 16,
    // paddingVertical: 12,
  },
  buttonCont: {
    flexDirection: "row",
    // justifyContent: "center",
    // backgroundColor: "black",
    backgroundColor: "transparent",
    width: "100%",
    gap: 16,
    paddingBottom: 16,
    // position: "absolute",
    // bottom: 0,
  },
  stopBUtton: {
    backgroundColor: "#EC4F4F",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
  },
  pauseBUtton: {
    backgroundColor: "#0064AD",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Open Sans",
    color: "#FFF",
    textTransform: "uppercase",
  },
  stopIcon: {
    paddingHorizontal: 8,
    alignSelf: "center",
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default StopWatch;
