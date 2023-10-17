import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  Polyline,
  UrlTile,
} from "react-native-maps";
import { ImagesSource } from "../assets/images/images";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
const LOCATION_TRACKING = "location-tracking";

const ActivityStart = ({ navigation }) => {
  const map = useRef(null);
  const markerRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState({});

  const [locationStarted, setLocationStarted] = useState(false);

  const startLocationTracking = async () => {
    await TaskManager.defineTask(
      LOCATION_TRACKING,
      ({ data: { locations }, error }) => {
        if (error) {
          // check `error.message` for more details.
          return;
        }
        console.log("Received new locations", locations);
      }
    );

    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 5000,
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

  useEffect(() => {
    const config = async () => {
      let resf = await Location.requestForegroundPermissionsAsync();
      let resb = await Location.requestBackgroundPermissionsAsync();
      if (resf.status != "granted" && resb.status !== "granted") {
        console.log("Permission to access location was denied");
      } else {
        console.log("Permission to access location granted");
      }
    };

    config();
  }, []);

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

    map?.current?.getCamera().then((cam) => {
      cam.center = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      cam.zoom = 16;
      map?.current?.animateCamera(cam);
    });
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  useEffect(() => {
    if (markerRef.current && currentLocation.latitude) {
      markerRef.current.animateMarkerToCoordinate(currentLocation, 200);
    }
  }, [currentLocation]);

  return (
    <View
      style={{
        backgroundColor: "#fff",
        flex: 1,
      }}
    >
      {/* <TouchableOpacity onPress={startLocation}>
        <Text>iuhuh</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={stopLocation}>
        <Text>iuhuh</Text>
      </TouchableOpacity> */}
      <View style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {/* {loading && <Text>Loading...</Text>} */}
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
          // region={{
          //   latitude: currentLocation.latitude,
          //   longitude: currentLocation.longitude,
          //   latitudeDelta: 0.0922,
          //   longitudeDelta: 0.0421,
          // }}
        >
          <UrlTile
            urlTemplate="https://tile.openstreetmap.de/{z}/{x}/{y}.png"
            // urlTemplate="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            zIndex={-1}
          />

          <Marker.Animated
            ref={markerRef}
            image={ImagesSource.Maps.marker}
            title="Current Location"
            coordinate={
              currentLocation.latitude
                ? currentLocation
                : { latitude: 12.174495, longitude: 60.614503 }
            }
          />
        </MapView>

        <View
          style={{
            // width: "100%",
            // height: 100,
            // backgroundColor: "red",
            bottom: 8,
            left: 8,
            right: 8,
            zIndex: 100,
            position: "absolute",
          }}
        >
          {/* <TouchableOpacity
            activeOpacity={0.8}
            onPress={fetchCurrentLocation}
            style={{
              alignSelf: "flex-end",
              backgroundColor: "#fff",
              borderRadius: 60,
              width: 60,
              height: 60,
              justifyContent: "center",
              alignItems: "center",
              elevation: 5,
            }}
          >
            <Text>L</Text>
          </TouchableOpacity> */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              backgroundColor: "#fff",
              borderRadius: 4,
              elevation: 5,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flex: 1,
                padding: 16,
                borderRightWidth: 1,
                borderRightColor: "#0000001a",
              }}
            >
              <Text
                style={{
                  color: "#666",
                  fontSize: 14,
                  textAlign: "center",
                  fontWeight: "700",
                }}
              >
                Select Activity
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flex: 1,
                padding: 16,
              }}
            >
              <Text
                style={{
                  color: "#666",
                  fontSize: 14,
                  textAlign: "center",
                  fontWeight: "700",
                }}
              >
                Select Workout
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={startLocation}
            style={{
              width: "100%",
              backgroundColor: "#0064AD",
              padding: 16,
              borderRadius: 24,
              marginTop: 16,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                textTransform: "uppercase",
                textAlign: "center",
                fontWeight: "700",
              }}
            >
              Start
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ActivityStart;

const styles = StyleSheet.create({});
