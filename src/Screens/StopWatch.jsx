import React, { useEffect, useRef } from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
  BackHandler,
  Alert,
  AppState,
  Vibration,
  ScrollView,
  FlatList,
} from "react-native";
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
import * as BackgroundFetch from "expo-background-fetch";
import { addActivity } from "../api";
import { LOCATION_TRACKING, UPDATE_ACTIVITY_DATA } from "../constants";
import {
  deleteActivity,
  setCurrentElapse,
  setCurrentLocation,
  setDistance,
  setElapsedStartTime,
  setElapsedTime,
  setIsRunning,
  setRouteTracker,
  setTotalTime,
  startNewActivity,
} from "../reduxToolkit/activity/activitySlice";

const StopWatch = ({ navigation }) => {
  const activityState = useSelector((store) => store.activity);
  const dispatch = useDispatch();
  const map = useRef(null);
  const markerRef = useRef(null);
  const polylineref = useRef(new Array());
  const [currentScreen, setCurrentScreen] = useState("watch");
  const [urlTile, setUrlTile] = useState(
    "https://tile.openstreetmap.de/{z}/{x}/{y}.png"
  );
  const [locationStarted, setLocationStarted] = useState(false);

  const {
    currentLocation,
    routeTracker,
    distance,
    currentElapse,
    isRunning,
    startTime,
    elapsedStartTime,
    elapsedTime,
    totalTime,
  } = activityState.activity;

  // useEffect(() => {
  // // dispatch(deleteActivity());
  // console.log({
  // currentLocation,
  // routeTracker: JSON.stringify(routeTracker),
  // distance,
  // currentElapse,
  // isRunning,
  // startTime,
  // elapsedStartTime,
  // elapsedTime,
  // totalTime,
  //   });
  // }, [
  // currentLocation,
  // routeTracker,
  // distance,
  // currentElapse,
  // isRunning,
  // startTime,
  // elapsedStartTime,
  // elapsedTime,
  // totalTime,
  // ]);

  // useEffect(() => {
  //   console.log(activityState.activity.workout);
  // }, [activityState]);

  // const [currentLocation, setCurrentLocation] = useState({});
  // const [routeTracker, setRouteTracker] = useState([]);
  // const [distance, setDistance] = useState(0);
  // const [currentElapse, setCurrentElapse] = useState(0);
  // const [isRunning, setIsRunning] = useState(true);
  // const [startTime, setStartTime] = useState(new Date());
  // const [elapsedStartTime, setElapsedStartTime] = useState(new Date());
  // const [elapsedTime, setElapsedTime] = useState([]);
  // const [totalTime, setTotalTime] = useState(0);
  const [workoutData, setWorkoutData] = useState([]);

  const handleActivityStop = async () => {
    stopLocation();
    const data = {
      activity_type: activityState?.activity?.name,
      ...(activityState?.activity?.workout?.id
        ? { workout: activityState.activity.workout.id }
        : {}),
      duration: totalTime,
      distance,
      start_time: startTime,
      end_time: new Date(),
      elapsedTime,
      route: {
        start_point: routeTracker[0],
        end_point: routeTracker[routeTracker.length - 1],
        waypoints: routeTracker,
        distance,
      },
    };

    const response = await addActivity(data);

    if (response.workout) {
      dispatch(deleteActivity());
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "shareactivity",

            params: {
              time: formatTime(totalTime),
              distance,
              average_pace: getAveragePace(),
            },
          },
        ],
      });
    }
  };

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        if (AppState.currentState === "active") {
          const currentTime = new Date();

          const elapsed = currentTime - new Date(elapsedStartTime);

          // const tempArr = [...elapsedTime];
          // console.log("tempArr", elapsed);
          // tempArr[currentElapse] = elapsed;
          // return tempArr;
          // }
          dispatch(setElapsedTime(elapsed));
          dispatch(setTotalTime(1000));
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, elapsedStartTime]);

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
    if (startTime && isRunning) {
      const currentTime = new Date().getTime();
      const elapsedTime = (currentTime - new Date(startTime)) / 1000; // convert to seconds
      return (distance / elapsedTime).toFixed(2); // pace in km/s
    }
    return 0;
  };

  const getAveragePace = () => {
    if (totalTime > 0) {
      return ((distance / totalTime) * 1000).toFixed(2); // pace in km/s
    }
    return 0;
  };

  function updateDistance() {
    const currentRoute = routeTracker[currentElapse];
    if (currentRoute) {
      const prevcoords = currentRoute[currentRoute.length - 2];
      const newcoords = currentRoute[currentRoute.length - 1];

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

        dispatch(setDistance(distance));

        return distance;
      }
    }
  }

  const fetchCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    dispatch(
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })
    );

    startLocation();
  };

  useEffect(() => {
    fetchCurrentLocation();
    navigation?.setOptions({
      headerShown: false,
    });
    navigation?.getParent().setOptions({ tabBarStyle: { display: "none" } });

    const backhandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        Alert.alert(
          "Discard Activity",
          "Are you sure you would like to discard the activity?",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "Delete",
              onPress: () => {
                stopLocation();
                navigation
                  ?.getParent()
                  .setOptions({ tabBarStyle: { display: "flex" } });
                navigation.goBack();
              },
            },
          ]
        );
        return true;
      }
    );
    return () => {
      backhandler.remove();
    };
  }, []);

  const startLocationTracking = async () => {
    setLocationStarted(false);
    const tracking = await TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING);
    if (tracking) {
      await Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
    }

    // const Update = await TaskManager.isTaskRegisteredAsync(
    //   UPDATE_ACTIVITY_DATA
    // );
    // if (Update) {
    //   await BackgroundFetch.unregisterTaskAsync(UPDATE_ACTIVITY_DATA);
    // }

    const consoleData = () => {
      const currentTime = new Date();

      const elapsed = currentTime - new Date(elapsedStartTime);

      // const tempArr = [...elapsedTime];
      // console.log("tempArr", elapsed);
      // tempArr[currentElapse] = elapsed;
      // return tempArr;
      // }
      dispatch(setElapsedTime(elapsed));
      dispatch(setTotalTime(1000));
    };

    // await TaskManager.defineTask(UPDATE_ACTIVITY_DATA, consoleData);

    // const status = await BackgroundFetch.getStatusAsync();

    // switch (status) {
    //   case BackgroundFetch.BackgroundFetchStatus.Restricted:
    //   case BackgroundFetch.BackgroundFetchStatus.Denied:
    //     console.log("Background execution is disabled");
    //     return;

    //   default: {
    //     console.debug("Background execution allowed");

    //     let tasks = await TaskManager.getRegisteredTasksAsync();

    //     if (tasks.find((f) => f.taskName === UPDATE_ACTIVITY_DATA) == null) {
    //       console.log("Registering task");
    //       await BackgroundFetch.registerTaskAsync(UPDATE_ACTIVITY_DATA, {
    //         minimumInterval: 1,
    //         startOnBoot: true,
    //         stopOnTerminate: false,
    //       });

    //       tasks = await TaskManager.getRegisteredTasksAsync();
    //       console.debug("Registered tasks", tasks);
    //     } else {
    //       console.log(
    //         `Task ${UPDATE_ACTIVITY_DATA} already registered, skipping`
    //       );
    //     }

    //     // console.log("Setting interval to", 10);
    //     // await BackgroundFetch.setMinimumIntervalAsync(10);
    //   }
    // }

    await TaskManager.defineTask(
      LOCATION_TRACKING,
      ({ data: { locations }, error }) => {
        if (error) {
          // check `error.message` for more details.
          console.log(error);
          return;
        }
        if (locations[0]?.coords) {
          // console.log("Received new locations", locations[0]?.coords);
          dispatch(setCurrentLocation(locations[0]?.coords));

          if (AppState.currentState === "background" && isRunning) {
            dispatch(
              setRouteTracker({
                latitude: locations[0]?.coords?.latitude,
                longitude: locations[0]?.coords?.longitude,
              })
            );

            const currentTime = new Date();
            const elapsed = currentTime - new Date(elapsedStartTime);
            dispatch(setElapsedTime(elapsed));
            dispatch(setTotalTime(1000));

            const currentRoute = routeTracker[currentElapse];
            if (currentRoute) {
              const prevcoords = currentRoute[currentRoute.length - 1];
              const newcoords = {
                latitude: locations[0]?.coords?.latitude,
                longitude: locations[0]?.coords?.longitude,
              };

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

                dispatch(setDistance(distance));
              }
            }
          }
          // // console.log(dispatch(setCurrentLocation(locations[0]?.coords)));
        }
      }
    );

    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 1000,
      distanceInterval: 0,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Marathon",
        notificationBody: "Marathon is tracking your activity",
        notificationColor: "#0064AD",
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

  const startLocation = async () => {
    Vibration.vibrate(1000);
    startLocationTracking();
  };

  const stopLocation = () => {
    Vibration.vibrate(1000);
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
    if (currentLocation.latitude && isRunning) {
      // let tempArray = [...routeTracker];

      // console.log("tempArray", tempArray);
      // if (Array.isArray(tempArray[currentElapse])) {
      //   tempArray[currentElapse] = [
      //     ...tempArray[currentElapse],
      // {
      //   latitude: currentLocation.latitude,
      //   longitude: currentLocation.longitude,
      // },
      //   ];
      //   // tempArray[currentElapse]?.push({
      //   //   latitude: currentLocation.latitude,
      //   //   longitude: currentLocation.longitude,
      //   // });
      // } else {
      //   tempArray[currentElapse] = [
      //     {
      //       latitude: currentLocation.latitude,
      //       longitude: currentLocation.longitude,
      //     },
      //   ];
      // }
      dispatch(
        setRouteTracker({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        })
      );

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
  }, [currentLocation, currentElapse, isRunning]);

  useEffect(() => {
    if (isRunning) {
      polylineref.current?.[currentElapse]?.setNativeProps({
        coordinates: routeTracker[currentElapse],
      });

      updateDistance();
    }
  }, [routeTracker, currentElapse, isRunning]);

  useEffect(() => {
    if (workoutData?.length > 0) {
      if (currentElapse === workoutData?.length - 1) {
        Vibration.vibrate(1000);
        stopLocation();
        handleActivityStop();
      }
      if (
        elapsedTime[currentElapse] / 1000 >
        workoutData[currentElapse]?.duration
      ) {
        dispatch(setElapsedStartTime(new Date()?.toString()));
        dispatch(setCurrentElapse(1));
      }

      if (
        calculateDistance(routeTracker[currentElapse]) >
        workoutData[currentElapse]?.distance
      ) {
        dispatch(setElapsedStartTime(new Date()?.toString()));
        dispatch(setCurrentElapse(1));
      }
    }
  }, [elapsedTime, workoutData]);

  useEffect(() => {
    if (isRunning) {
      dispatch(setElapsedStartTime(new Date()?.toString()));
    }
  }, [isRunning]);

  useEffect(() => {
    if (activityState?.activity?.workout) {
      const workout = activityState?.activity?.workout;
      setWorkoutData([
        // {
        //   duration: workout?.warm_up ? workout?.warm_up : 0,
        //   step_name: "Warm Up",
        // },
        ...repeatArray(workout?.steps, workout?.repetations + 1),
        {
          duration: workout?.cool_down ? workout?.cool_down : 0,
          step_name: "Cool Down",
        },
      ]);
    }
  }, [activityState?.activity?.workout]);

  const repeatArray = (arr, n) =>
    Array.from({ length: arr?.length * n }, (_, i) => arr[i % arr?.length]);

  const calculateDistance = (data) => {
    const distance = data?.map((rt, index) => {
      const prevcoords = data[index - 1];
      const newcoords = rt;

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

        // dispatch(setDistance(distance));

        return distance;
      }
    });

    return distance
      ? distance.reduce((partialSum, a) => (a ? partialSum + a : 0), 0)
      : 0;
  };

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
            flex: 1,
          }}
        >
          <View style={styles.stopWatchSubCont}>
            <View style={styles.timeWithIcon}>
              <Ionicons name="alarm" size={24} color="#666666" />
              <Text style={styles.textwithSymbol}>Time</Text>
            </View>

            <Text style={[styles.textwithSymbol, { fontWeight: "800" }]}>
              {formatTime(totalTime)}
            </Text>
          </View>
          <View style={styles.stopWatchSubCont}>
            <View style={styles.timeWithIcon}>
              <Ionicons name="location" size={24} color="#666666" />

              <Text style={styles.textwithSymbol}>Distance</Text>
            </View>
            <Text style={[styles.textwithSymbol, { fontWeight: "800" }]}>
              {`${(distance / 1000).toFixed(2)} KM`}
            </Text>
          </View>
          {/* <View style={styles.stopWatchSubCont}>
            <Text style={styles.textwithSymbol}>Calories</Text>
            <Text style={styles.textwithSymbol}>0.00</Text>
          </View> */}
          <View style={styles.stopWatchSubCont}>
            <Text style={styles.textwithSymbol}>Current Speed</Text>
            <Text style={[styles.textwithSymbol, { fontWeight: "800" }]}>
              {getCurrentPace()}
            </Text>
          </View>
          <View style={styles.stopWatchSubCont}>
            <Text style={styles.textwithSymbol}>Average Speed</Text>
            <Text style={[styles.textwithSymbol, { fontWeight: "800" }]}>
              {getAveragePace()}
            </Text>
          </View>
          {activityState?.activity?.workout?.steps?.length > 0 && (
            // <ScrollView
            //   contentContainerStyle={{ marginTop: 32, maxHeight: 200 }}
            // >
            //   <View>

            //   </View>
            // </ScrollView>
            <View style={{ marginTop: 32, marginBottom: 80, flex: 1 }}>
              <Text style={{ marginBottom: 16, fontSize: 16 }}>
                {activityState?.activity?.workout?.name}
              </Text>
              <FlatList
                scrollEnabled
                data={workoutData}
                keyExtractor={(item, index) => index}
                renderItem={({ item, index }) => {
                  {
                    /* {" "}
                  <Text style={{ marginBottom: 16 }}>Workout </Text>
                  {activityState?.activity?.workout?.warm_up > 0 && (
                    <View style={styles.stopWatchSubCont}>
                      <Text style={styles.textwithSymbol}>Warm Up</Text>
                      <Text style={styles.textwithSymbol}>
                        {activityState?.activity?.workout?.warm_up / 60} Min
                      </Text>
                    </View>
                  )} */
                  }
                  {
                    /* {[
              ...activityState?.activity?.workout?.steps,
              ...activityState?.activity?.workout?.steps,
              ...activityState?.activity?.workout?.steps,
              ...activityState?.activity?.workout?.steps,
              ...activityState?.activity?.workout?.steps,
              ...activityState?.activity?.workout?.steps,
            ]?.map((step) => ( */
                  }

                  return (
                    <View
                      style={[
                        styles.stopWatchSubCont,
                        elapsedTime[index] && styles.stopWatchSubContSelected,
                      ]}
                    >
                      <Text style={styles.textwithSymbol}>
                        {item?.step_name}{" "}
                        <Text style={{ fontSize: 12 }}>{item?.pace}</Text>
                      </Text>
                      <Text
                        style={[styles.textwithSymbol, { fontWeight: "800" }]}
                      >
                        {item?.duration
                          ? `${item?.duration / 60} Min`
                          : `${(item?.distance / 1000)?.toFixed(2)} KM`}

                        {elapsedTime[index] > 0 &&
                          item.duration &&
                          (item?.duration - elapsedTime[index] / 1000) / 60 >
                            0 && (
                            <Text
                              style={{
                                fontWeight: "400",
                                fontSize: 14,
                              }}
                            >
                              {"    "}
                              {`${Math.floor(
                                (item?.duration - elapsedTime[index] / 1000) /
                                  60
                              )}:${Math.floor(
                                (item?.duration - elapsedTime[index] / 1000) %
                                  60
                              )} Min Left`}
                            </Text>
                          )}

                        {routeTracker[index]?.length > 0 &&
                          item?.distance &&
                          item?.distance -
                            calculateDistance(routeTracker[index]) >
                            0 && (
                            <Text
                              style={{
                                fontWeight: "400",
                                fontSize: 14,
                              }}
                            >
                              {"    "}
                              {`${(
                                (item?.distance -
                                  calculateDistance(routeTracker[index])) /
                                1000
                              )?.toFixed(2)} KM Left`}
                            </Text>
                          )}

                        {/* {elapsedTime[index] / 60 > item?.duration &&
                          `${(
                            (item?.duration - elapsedTime[index]) /
                            60
                          )?.toFixed(2)} Min Left`} */}
                      </Text>
                    </View>
                  );
                  {
                    /* ))} */
                  }
                  {
                    /* {activityState?.activity?.workout?.cool_down > 0 && (
                    <View style={styles.stopWatchSubCont}>
                      <Text style={styles.textwithSymbol}>Cool Down</Text>
                      <Text style={styles.textwithSymbol}>
                        {activityState?.activity?.workout?.cool_down / 60} Min
                      </Text>
                    </View>
                  )} */
                  }
                }}
              ></FlatList>
            </View>
          )}
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

            {routeTracker?.map(
              (route, index) =>
                route.length > 0 && (
                  <Polyline
                    key={index}
                    ref={(element) => {
                      polylineref.current.push(element);
                    }}
                    coordinates={route}
                    strokeColor={"#FF0000"}
                    strokeWidth={5}
                  />
                )
            )}

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
                Alert.alert(
                  "Stop Activity",
                  "Are you sure you want to stop this activity?",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "Stop",
                      onPress: () => {
                        stopLocation();
                        handleActivityStop();
                      },
                    },
                  ]
                );
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
                  dispatch(setCurrentElapse(1));
                }
                dispatch(setIsRunning());
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
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#fff",
  },
  timeWithIcon: {
    flexDirection: "row",
    gap: 16,
  },
  stopWatchSubCont: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#FFF",
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
  stopWatchSubContSelected: {
    backgroundColor: "#0064AD1A",
    borderColor: "#0064AD66",
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
