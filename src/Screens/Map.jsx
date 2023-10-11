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
  PROVIDER_DEFAULT,
  Polyline,
  UrlTile,
} from "react-native-maps";
import axios from "axios";
import { getEventData } from "../api";
import Button from "../components/common/Button";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "../reduxToolkit/user/userSlice";

const Map = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const polylineref = useRef(null);
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [route, setRoute] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState({});
  const selectedMarathon = useSelector((store) => store.marathon);

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
  }, []);

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
    <View
      style={{
        backgroundColor: "#fff",
        flex: 1,
        padding: 16,
        paddingTop: 24,
      }}
    >
      {/* <Button
        label={"loguot"}
        onPress={() => dispatch(deleteUser())}
        width={50}
      /> */}
      <View
        style={{
          width: "100%",
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "#999999",
          borderRadius: 3,
          paddingVertical: 12,
          paddingHorizontal: 16,
          flexDirection: "row",
        }}
      >
        <Ionicons name="search" size={24} color="#666666" />
        <TextInput
          style={{ flex: 1, marginLeft: 10, fontSize: 16 }}
          placeholder="Search by name or BIB No."
          placeholderTextColor="#999999"
          cursorColor="#999999"
        />
      </View>

      <View
        style={{
          marginTop: 16,
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {categories.map((cate, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.9}
            onPress={() => {
              setSelectedCategory(cate);
            }}
            style={{
              backgroundColor:
                selectedCategory?.title === cate.title ? "#FF92301A" : "#fff",
              alignSelf: "flex-start",
              paddingVertical: 4,
              paddingHorizontal: 8,
              borderColor:
                selectedCategory?.title === cate.title ? "#FF9230" : "#666666",
              borderWidth: 1,
              borderRadius: 24,
            }}
          >
            <Text
              style={{
                color:
                  selectedCategory?.title === cate.title
                    ? "#FF9230"
                    : "#666666",
                fontSize: 12,
                fontWeight: "500",
                textTransform: "uppercase",
              }}
            >
              {cate.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ marginVertical: 24, flex: 1, overflow: "hidden" }}>
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
        </MapView>
        {loading && (
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: "#0064AD1A",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}
      </View>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({});
