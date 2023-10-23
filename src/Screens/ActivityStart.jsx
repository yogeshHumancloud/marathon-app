import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
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
import { useDispatch, useSelector } from "react-redux";

import RunningSVG from "../assets/icons/RunningSVG";
import WalkingSVG from "../assets/icons/WalkingSVG";
import HikingSVG from "../assets/icons/HikingSVG";
import SwimmingSVG from "../assets/icons/SwimmingSVG";
import BicycleSVG from "../assets/icons/BicycleSVG";
import OtherSVG from "./OtherSVG";
import * as TaskManager from "expo-task-manager";
import { LOCATION_TRACKING } from "../constants";
import { startNewActivity } from "../reduxToolkit/activity/activitySlice";

const activities = {
  Running: <RunningSVG />,

  Walking: <WalkingSVG />,

  Hiking: <HikingSVG />,

  Swimming: <SwimmingSVG />,

  Cycling: <BicycleSVG />,

  Other: <OtherSVG />,
};

const ActivityStart = ({ navigation }) => {
  const map = useRef(null);
  const markerRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState({});
  const activityState = useSelector((store) => store.activity);
  const dispatch = useDispatch();

  const fetchCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
      maximumAge: 10000,
    });

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
    const currentLocationInterval = setInterval(() => {
      fetchCurrentLocation();
    }, 10000);

    navigation?.getParent().setOptions({ tabBarStyle: { display: "flex" } });

    return () => {
      clearInterval(currentLocationInterval);
    };
  }, []);

  useEffect(() => {
    const fetchIsRunning = async () => {
      const running = await TaskManager.isTaskRegisteredAsync(
        LOCATION_TRACKING
      );

      if (running) {
        navigation.navigate(`stopwatch`);
      }
    };
    fetchIsRunning();
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

        <View
          style={
            styles.main
            // width: "100%",
            // height: 100,
            // backgroundColor: "red",
          }
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
          <View style={styles.mainCont}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.mainBUtton}
              onPress={() => {
                navigation.navigate("selectactivity");
              }}
            >
              {activities[activityState.activity?.name]}
              <Text style={styles.textActivityBUtton}>
                {activityState.activity?.name
                  ? activityState.activity?.name
                  : "Select Activity"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate("selectworkout");
              }}
              style={{
                flex: 1,
                padding: 16,
              }}
            >
              <Text style={styles.mainTextBUtton}>
                {activityState?.activity?.workout?.name
                  ? activityState?.activity?.workout?.name
                  : "Select Workout"}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (currentLocation.latitude) {
                dispatch(startNewActivity());
                navigation.navigate("stopwatch");
                // navigation.reset({
                //   index: 0,
                //   routes: [
                //     {
                //       name: "shareactivity",
                //       params: {
                //         time: 435,
                //         distance: 98,
                //       },
                //     },
                //   ],
                // });
              } else {
                fetchCurrentLocation();
              }
            }}
            style={styles.startButtonText}
          >
            <Text style={styles.startText}>
              {currentLocation.latitude ? "Start" : "Enable GPS"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ActivityStart;

const styles = StyleSheet.create({
  main: {
    bottom: 8,
    left: 8,
    right: 8,
    zIndex: 100,
    position: "absolute",
  },
  mainCont: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
    borderRadius: 4,
    elevation: 5,
  },
  mainBUtton: {
    flex: 1,
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: "#0000001a",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  textActivityBUtton: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "700",
  },
  mainTextBUtton: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "700",
  },
  startButtonText: {
    width: "100%",
    backgroundColor: "#0064AD",
    padding: 16,
    borderRadius: 24,
    marginTop: 16,
  },
  startText: {
    color: "#fff",
    fontSize: 16,
    textTransform: "uppercase",
    textAlign: "center",
    fontWeight: "700",
  },
});
