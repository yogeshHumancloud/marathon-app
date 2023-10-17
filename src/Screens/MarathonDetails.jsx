import React, { useEffect } from "react";

import { View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import { useState } from "react";
import ActivityCard from "../components/common/ActivityCard";
import EventCard from "../components/common/EventCard";
import { FlatList } from "react-native";
import { ImagesSource } from "../assets/images/images";
import Button from "../components/common/Button";
import Jogging from "../assets/icons/Jogging";
import Hiking from "../assets/icons/Hiking";
import Runner from "../assets/icons/Runner";
import Bicycle from "../assets/icons/BicycleIcon";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { setMarathon } from "../reduxToolkit/marathon/marathonSlice";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import MarathonCard from "../components/common/MarathonCard";
import { Image } from "react-native";

const MarathonDetails = ({ navigation, route }) => {
  const { marathon, category } = route.params;
  const dispatch = useDispatch();

  useEffect(() => {
    navigation.getParent()?.setOptions({
      headerTitle: marathon.title,
    });
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Image
        style={{
          width: "100%",
          height: 240,
          resizeMode: "cover",
          borderRadius: 2,
        }}
        source={{ uri: marathon?.thumbnail }}
      />
      <ScrollView style={{ marginTop: 16, flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            borderRadius: 4,
          }}
        >
          <Text style={{ color: "#333", fontSize: 14, fontWeight: "700" }}>
            {marathon.title}
          </Text>
          <View
            style={{
              backgroundColor:
                category === "live"
                  ? "#79FF7E"
                  : category === "past"
                  ? "red"
                  : "#FFEA30",
              borderRadius: 4,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                color: "#574F09",
                fontSize: 12,
                fontWeight: "500",
                textTransform: "uppercase",
              }}
            >
              {category}
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 8,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "#999", fontSize: 12 }}>Date: </Text>
          <Text style={{ color: "#000", fontSize: 12 }}>
            {" "}
            {new Date(marathon.date)?.toUTCString()}
          </Text>
        </View>
        <View
          style={{
            marginTop: 8,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "#999", fontSize: 12 }}>Location: </Text>
          <Text style={{ color: "#000", fontSize: 12 }}>
            {marathon.location}
          </Text>
        </View>

        <View
          style={{
            marginTop: 8,
          }}
        >
          <Text style={{ color: "#999", fontSize: 12 }}>Events: </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 4,
              marginTop: 4,
              flexWrap: "wrap",
            }}
          >
            {marathon.categories?.map((category, i) => (
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderWidth: 1,
                  borderColor: "#99999966",
                  borderRadius: 80,
                  alignSelf: "flex-start",
                }}
              >
                <Text style={{ color: "#666", fontSize: 12 }}>
                  {category.title}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={{
            marginTop: 8,
          }}
        >
          <Text style={{ color: "#999", fontSize: 12 }}>Description: </Text>
          <Text
            style={{
              marginTop: 8,
              color: "#333",
            }}
          >
            {marathon.description}
          </Text>
        </View>
      </ScrollView>

      <Button
        color={"#0064AD"}
        label={
          category === "live"
            ? "Enter Marathon"
            : category === "past"
            ? "View Results"
            : "Register"
        }
        onPress={() => {
          if (category === "live") {
            dispatch(setMarathon(marathon));
            navigation.navigate("dashboard");
          } else if (category === "upcoming") {
            dispatch(setMarathon(marathon));

            // Linking.openURL(marathon.registration_link);
            navigation.navigate("choosetype");
            // navigation.getParent()?.setOptions({
            //   tabBarStyle: {
            //     height: 0,
            //   },
            // });
          } else {
            navigation.navigate("results");
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 0,
    fontFamily: "Montserrat",
    fontWeight: "700",
    marginTop: 0,
    padding: 0,
  },
  mainContainer: {
    flex: 1,
    // flexDirection: "column",
    // justifyContent: "flex-start",
    // alignItems: "flex-start",
    // paddingTop: 44,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontFamily: "Montserrat",
    fontWeight: "700",
    marginTop: 32,
    padding: 5,
  },
  title2: {
    fontSize: 14,
    // marginBottom: 16,
    fontFamily: "Montserrat",
    fontWeight: "700",
    // marginTop: 32,
    // padding: 5,
  },
  subtext: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,

    flexWrap: "wrap",
    color: "#333",
  },

  viewall: {
    color: "#FF9230",
  },
});

export default MarathonDetails;
