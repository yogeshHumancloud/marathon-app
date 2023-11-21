import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { createRef, useEffect, useRef, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  Polyline,
  UrlTile,
} from "react-native-maps";
import axios from "axios";
import { getEventBibs, getEventData } from "../api";
import Button from "../components/common/Button";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "../reduxToolkit/user/userSlice";
import { ImagesSource } from "../assets/images/images";
import * as Location from "expo-location";
import socket from "../api/socket";

const Map = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const map = useRef(null);

  const polylineref = useRef(null);
  const markerRef = useRef(null);
  const markerRefs = useRef([]);
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [route, setRoute] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [intervals, setIntervals] = useState([]);
  const [selectedInterval, setSelectedInterval] = useState({});
  const [allIntervals, setAllIntervals] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const selectedMarathon = useSelector((store) => store.marathon);
  const user = useSelector((store) => store.user);

  const fetchRoute = async (points) => {
    setLoading(true);

    const coordinates = points?.map((co) => ({
      latitude: co[0],
      longitude: co[1],
    }));
    setRoute(coordinates);
    setLoading(false);
    // const coordinates = points?.map((co) => co.reverse().join(","));

    // try {
    //   const url = `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${coordinates.join(
    //     ";"
    //   )}?overview=full&geometries=polyline&steps=true`;

    //   const res = await axios.get(url);

    //   res.data.routes.map((route) => {
    //     route.legs.map((leg) => {
    //       leg.steps.map((step) => {
    //         step.intersections.map((inter) => {
    //           setRoute((prevState) => [
    //             ...prevState,
    //             { latitude: inter.location[1], longitude: inter.location[0] },
    //           ]);
    //         });
    //       });
    //     });
    //   });
    //   setLoading(false);
    // } catch (e) {
    //   console.log(e);
    // }
    // //     }
    // //   })
    // // );
  };

  useEffect(() => {
    const fetchData = async () => {
      if (selectedMarathon.marathon?.id) {
        const data = await getEventData({
          event_id: selectedMarathon.marathon?.id,
        });
        setCategories(data.event.categories);
        setSelectedCategory(data.event.categories[0]);
        setAllIntervals(data.intervals);
        setIntervals(
          data.intervals?.filter(
            (intse) => intse.race_id === data.categories[0]?.race_id
          )
        );
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "marathons" }],
        });
      }
    };
    fetchData();

    // const onSocketReceived = (res) => {
    //   console.log(res);
    // };
    // socket.on("test", onSocketReceived);

    // return () => {
    //   socket.off("test", onSocketReceived);
    // };
  }, []);

  // useEffect(() => {
  //   let sendUpdatedLocationInterval;
  //   if (
  //     selectedMarathon.marathon?.selectedType?.text?.toLowerCase() === "runner"
  //   ) {
  //     sendUpdatedLocationInterval = setInterval(() => {
  //       socket.emit("updateRunnerLocation", {
  //         user: user.user.user.id,
  //         marathon: selectedMarathon.marathon.id,
  //         currentLocation,
  //       });
  //     }, 10000);
  //   } else {
  //     socket.on(
  //       `${user.user.user.id}-${selectedMarathon.marathon.id}`,
  //       (message) => {
  //         console.log(message);
  //       }
  //     );
  //   }

  //   return () => {
  //     clearInterval(sendUpdatedLocationInterval);
  //   };
  // }, [selectedMarathon, currentLocation]);

  useEffect(() => {
    const fetchBibs = async () => {
      if (selectedMarathon.marathon?.id) {
        setSearchLoading(true);
        const data = await getEventBibs({
          event_id: selectedMarathon.marathon?.id,
          query: searchValue !== "" ? searchValue : undefined,
          sortBy: "position",

          ct_id: selectedMarathon?.marathon?.ct_id,
          race_id: selectedCategory?.race_id
            ? selectedCategory?.race_id
            : "4332",
        });

        setSearchResults(data.data.results?.slice(0, 5));
        setSearchLoading(false);
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "marathons" }],
        });
      }
    };
    fetchBibs();
  }, [searchValue, selectedMarathon]);

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

    const locationInterval = setInterval(() => {
      fetchCurrentLocation();
    }, 5000);

    return () => {
      clearInterval(locationInterval);
    };
  }, []);

  useEffect(() => {
    setSelectedInterval(intervals[0]);
  }, [intervals]);

  useEffect(() => {
    if (markerRef.current && currentLocation.latitude) {
      markerRef.current.animateMarkerToCoordinate(currentLocation, 200);
    }
  }, [currentLocation]);

  useEffect(() => {
    setIntervals(
      allIntervals?.filter(
        (intse) => intse.race_id === selectedCategory?.race_id
      )
    );

    if (selectedCategory.route?.[0].points?.length > 0) {
      map?.current?.getCamera().then((cam) => {
        cam.center = {
          latitude: 18.179405,
          longitude: 74.607698,
        };
        cam.zoom = 13;
        map?.current?.animateCamera(cam);
      });
      setRoute([]);
      fetchRoute(selectedCategory.route?.[0].points);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (route.length > 0) {
      if (!loading) {
        polylineref.current?.setNativeProps({
          coordinates: route,
        });
      }
    } else {
      polylineref.current?.setNativeProps({
        coordinates: [],
      });
    }
  }, [route, loading]);

  useEffect(() => {
    markerRefs.current = Array(selectedCategory?.intervals?.length)
      .fill()
      .map((_, index) => markerRefs.current[index] || createRef());
  }, [selectedCategory]);

  // useEffect(() => {
  //   console.log(markerRefs?.current?.[0]?.current?.showCallout());
  // }, [markerRefs]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.cont}>
        {/* <Button
          label={"loguot"}
          onPress={() => dispatch(deleteUser())}
          width={50}
        /> */}
        <View style={styles.mainCont}>
          <Ionicons name="search" size={24} color="#666666" />
          <TextInput
            onFocus={() => {
              setIsDropdownOpen(true);
            }}
            blurOnSubmit
            clearTextOnFocus
            onBlur={() => {
              setIsDropdownOpen(false);
            }}
            value={searchValue}
            onChangeText={(e) => {
              setIsDropdownOpen(true);
              setSearchValue(e);
            }}
            style={{ flex: 1, marginLeft: 10, fontSize: 16 }}
            placeholder="Search by name or BIB No."
            placeholderTextColor="#999999"
            cursorColor="#999999"
          />
        </View>

        <View style={styles.cardTitleCont}>
          {categories.map((cate, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              onPress={() => {
                setSelectedCategory(cate);
              }}
              style={[
                styles.cardTitleBUtton,
                {
                  backgroundColor:
                    selectedCategory?.title === cate.title
                      ? "#FF92301A"
                      : "#fff",
                  borderColor:
                    selectedCategory?.title === cate.title
                      ? "#FF9230"
                      : "#666666",
                },
              ]}
            >
              <Text
                style={[
                  styles.cardTitle,
                  {
                    color:
                      selectedCategory?.title === cate.title
                        ? "#FF9230"
                        : "#666666",
                  },
                ]}
              >
                {cate.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ marginTop: 24, flex: 1, overflow: "hidden" }}>
          {/* {loading && <Text>Loading...</Text>} */}

          <MapView
            ref={map}
            mapType="none"
            provider={PROVIDER_DEFAULT}
            rotateEnabled={false}
            style={{ height: "110%" }}
            initialRegion={{
              latitude: 18.179405,
              longitude: 74.607698,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            region={{
              latitude: 18.179405,
              longitude: 74.607698,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            mapPadding={{
              top: 0,
              right: 0,
              bottom: -100,
              left: 0,
            }}
          >
            <UrlTile
              urlTemplate="https://tile.openstreetmap.de/{z}/{x}/{y}.png"
              // urlTemplate="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              zIndex={-1}
            />

            <Polyline
              ref={polylineref}
              coordinates={
                selectedCategory.routes?.points
                  ? selectedCategory.routes?.points?.map((ev) => ({
                      latitude: ev[0],
                      longitude: ev[1],
                    }))
                  : []
              }
              strokeColor={"#003c00"}
              strokeWidth={5}
            />
            {currentLocation.latitude && (
              <Marker.Animated
                ref={markerRef}
                // image={ImagesSource.Maps.marker}
                title="Current Location"
                coordinate={currentLocation}
              >
                <Image
                  source={ImagesSource.Maps.marker}
                  width={20}
                  height={20}
                  style={{ width: 60, height: 60 }}
                />
              </Marker.Animated>
            )}
            {selectedCategory?.intervals?.map((interval, index) => (
              <Marker.Animated
                ref={markerRefs.current[index]}
                title={`T${index + 1}`}
                coordinate={{ latitude: interval[0], longitude: interval[1] }}
                centerOffset={[0, 0]}
              >
                <Image
                  source={ImagesSource.Maps[`t${index + 1}`]}
                  width={30}
                  height={30}
                  style={{ width: 30, height: 30 }}
                />
              </Marker.Animated>
            ))}
            {selectedCategory?.route?.[0]?.start_point?.length > 0 &&
              selectedCategory?.route?.[0]?.end_point?.length > 0 && (
                <>
                  <Marker.Animated
                    title="Start"
                    coordinate={{
                      latitude: selectedCategory.route[0]?.start_point[0],
                      longitude: selectedCategory.route[0]?.start_point[1],
                    }}
                    centerOffset={[10, 10]}
                  >
                    <Image
                      source={ImagesSource.Maps.start}
                      width={100}
                      height={30}
                      style={{ width: 40, height: 20 }}
                    />
                  </Marker.Animated>
                  <Marker.Animated
                    title={`Finish`}
                    coordinate={{
                      latitude: selectedCategory.route[0]?.end_point[0],
                      longitude: selectedCategory.route[0]?.end_point[1],
                    }}
                    centerOffset={[10, 10]}
                  >
                    <Image
                      source={ImagesSource.Maps.finish}
                      width={200}
                      height={20}
                      style={{ width: 50, height: 25 }}
                    />
                  </Marker.Animated>
                </>
              )}
          </MapView>

          <TouchableOpacity
            style={{
              position: "absolute",
              right: 12,
              bottom: 12,
              backgroundColor: "#fff",
              paddingHorizontal: 12,
              paddingVertical: 4,
              opacity: 0.8,
              borderRadius: 4,
            }}
            onPress={() => {
              if (map.current) {
                map?.current?.getCamera().then((cam) => {
                  cam.center = {
                    latitude: 18.179405,
                    longitude: 74.607698,
                  };
                  cam.zoom = 13;
                  map?.current?.animateCamera(cam);
                });
              }
            }}
          >
            <Text>Reset</Text>
          </TouchableOpacity>

          {loading && (
            <View style={styles.activityIncCont}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          )}
        </View>
        <View
          style={[
            styles.activCont,
            {
              display: isDropdownOpen ? "flex" : "none",
            },
          ]}
        >
          {searchLoading ? (
            <ActivityIndicator size={"small"}></ActivityIndicator>
          ) : searchResults.length === 0 ? (
            <Text style={styles.activityText}>No search results found</Text>
          ) : (
            searchResults.map((result, index) => (
              <TouchableOpacity
                key={index}
                style={styles.activityBUtton}
                onPress={() => {
                  setIsDropdownOpen(false);

                  const intervals = allIntervals.filter(
                    (interv) => interv.race_id === selectedCategory?.race_id
                  );

                  const index = intervals.findIndex(
                    (inter) => inter.interval_id === result.results_interval_id
                  );

                  markerRefs.current[index]?.current.showCallout();

                  setSearchValue(result.results_bib);
                  Keyboard.dismiss();
                }}
              >
                <Text>
                  {result.results_bib} - {result.results_first_name}{" "}
                  {result.results_last_name}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Map;

const styles = StyleSheet.create({
  cont: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 16,
    paddingTop: 24,
  },
  mainCont: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#999999",
    borderRadius: 3,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    position: "relative",
  },
  cardTitleCont: {
    // marginTop: 0,
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  cardTitleBUtton: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 24,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  activityIncCont: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#0064AD1A",
    justifyContent: "center",
    alignItems: "center",
  },
  activCont: {
    backgroundColor: "#fff",
    elevation: 5,
    top: 72,
    right: 16,
    left: 16,
    maxHeight: 200,
    position: "absolute",
    padding: 16,
  },
  activityText: {
    textAlign: "center",
    fontSize: 16,
    verticalAlign: "middle",
  },
  activityBUtton: {
    paddingVertical: 8,
    borderBottomColor: "#999",
    borderBottomWidth: 1,
  },
});
