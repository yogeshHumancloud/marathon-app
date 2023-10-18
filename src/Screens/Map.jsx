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

  const polylineref = useRef(null);
  const markerRef = useRef(null);
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [route, setRoute] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const selectedMarathon = useSelector((store) => store.marathon);
  const user = useSelector((store) => store.user);

  const fetchRoute = async (points) => {
    setLoading(true);

    const coordinates = points?.map((co) => co.reverse().join(","));

    try {
      const url = `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${coordinates.join(
        ";"
      )}?overview=full&geometries=polyline&steps=true`;

      const res = await axios.get(url);

      res.data.routes.map((route) => {
        route.legs.map((leg) => {
          leg.steps.map((step) => {
            step.intersections.map((inter) => {
              setRoute((prevState) => [
                ...prevState,
                { latitude: inter.location[1], longitude: inter.location[0] },
              ]);
            });
          });
        });
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
    //     }
    //   })
    // );
  };

  useEffect(() => {
    const fetchData = async () => {
      if (selectedMarathon.marathon?.id) {
        const data = await getEventData({
          event_id: selectedMarathon.marathon?.id,
        });
        setCategories(data.event.categories);
        setSelectedCategory(data.event.categories[0]);
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "welcome" }],
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

  useEffect(() => {
    let sendUpdatedLocationInterval;
    if (
      selectedMarathon.marathon?.selectedType?.text?.toLowerCase() === "runner"
    ) {
      sendUpdatedLocationInterval = setInterval(() => {
        socket.emit("updateRunnerLocation", {
          user: user.user.user.id,
          marathon: selectedMarathon.marathon.id,
          currentLocation,
        });
      }, 10000);
    } else {
      socket.on(
        `${user.user.user.id}-${selectedMarathon.marathon.id}`,
        (message) => {
          console.log(message);
        }
      );
    }

    return () => {
      clearInterval(sendUpdatedLocationInterval);
    };
  }, [selectedMarathon, currentLocation]);

  useEffect(() => {
    const fetchBibs = async () => {
      if (selectedMarathon.marathon?.id) {
        setSearchLoading(true);
        const data = await getEventBibs({
          event_id: selectedMarathon.marathon?.id,
          query: searchValue !== "" ? searchValue : undefined,
          sortBy: "position",
        });
        console.log(data.data.results?.slice(0, 5));
        setSearchResults(data.data.results?.slice(0, 5));
        setSearchLoading(false);
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "welcome" }],
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
    if (markerRef.current && currentLocation.latitude) {
      markerRef.current.animateMarkerToCoordinate(currentLocation, 200);
    }
  }, [currentLocation]);

  useEffect(() => {
    if (selectedCategory.route?.[0].points?.length > 0) {
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

  return (
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
          onBlur={() => {
            setIsDropdownOpen(false);
          }}
          value={searchValue}
          onChangeText={setSearchValue}
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
                  selectedCategory?.title === cate.title ? "#FF92301A" : "#fff",
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
          mapType="none"
          provider={PROVIDER_DEFAULT}
          rotateEnabled={false}
          style={{ height: "110%" }}
          initialRegion={{
            latitude: 18.174495,
            longitude: 74.614503,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          region={{
            latitude: 18.174495,
            longitude: 74.614503,
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
            strokeColor={"#FF0000"}
            strokeWidth={3}
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
        </MapView>
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
          [
            ...searchResults,
            ...searchResults,
            ...searchResults,
            ...searchResults,
          ].map((result, index) => (
            <TouchableOpacity key={index} style={styles.activityBUtton}>
              <Text>
                {result.bib_id} - {result.name}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
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
