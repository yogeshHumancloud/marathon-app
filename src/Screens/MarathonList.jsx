import React, { useEffect } from "react";

import { View, Text, StyleSheet, ScrollView } from "react-native";
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
import { getEvents } from "../api";

const MarathonList = ({ navigation }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await getEvents();
      setEvents(response.data);
    };
    fetchEvents();
  }, []);

  return (
    <ScrollView style={styles.mainContainer}>
      {/* <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={styles.backButton}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title1}>Welcome to the</Text>
      <Text style={styles.titleNext2}>Baramathi</Text>
      <Text style={styles.titleNext2}>
        Power Marathon <Text style={styles.titleNext3}>2023</Text>
      </Text> */}
      {events.live?.length > 0 && (
        <>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.subtext}>Live Marathons</Text>
            {events.live?.length > 2 && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("marathoncategorylist", { type: "live" });
                }}
              >
                <Text style={{ ...styles.subtext, ...styles.viewall }}>
                  View All
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={{ marginTop: 16, flexDirection: "row", gap: 8 }}>
            {events.live?.map((item) => (
              <MarathonCard
                navigation={navigation}
                marathon={item}
                category="live"
              />
            ))}
            {events.live?.length % 2 !== 0 && <View style={{ flex: 1 }}></View>}
          </View>
        </>
      )}

      {events.upcoming?.length > 0 && (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: events.live?.length > 0 ? 40 : 0,
            }}
          >
            <Text style={styles.subtext}>Upcoming Marathons</Text>
            {events.upcoming?.length > 2 && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("marathoncategorylist", {
                    type: "upcoming",
                  });
                }}
              >
                <Text style={{ ...styles.subtext, ...styles.viewall }}>
                  View All
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={{ marginTop: 16, flexDirection: "row", gap: 8 }}>
            {events?.upcoming?.map((item) => (
              <MarathonCard
                navigation={navigation}
                marathon={item}
                category="upcoming"
              />
            ))}
            {events.upcoming?.length % 2 !== 0 && (
              <View style={{ flex: 1 }}></View>
            )}
          </View>
        </>
      )}

      {events?.past?.length > 0 && (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: events.upcoming?.length > 0 ? 40 : 0,
            }}
          >
            <Text style={styles.subtext}>Past Marathons</Text>
            {events.past?.length > 2 && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("marathoncategorylist", { type: "past" });
                }}
              >
                <Text style={{ ...styles.subtext, ...styles.viewall }}>
                  View All
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              marginTop: 16,
              flexDirection: "row",
              gap: 8,
              marginBottom: 36,
            }}
          >
            {events?.past?.map((item) => (
              <MarathonCard
                navigation={navigation}
                marathon={item}
                category="past"
              />
            ))}
            {events.past?.length % 2 !== 0 && <View style={{ flex: 1 }}></View>}
          </View>
        </>
      )}

      {/* <Button color={"#0064AD"} label="Next" onPress={handleNext} /> */}
    </ScrollView>
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

export default MarathonList;
