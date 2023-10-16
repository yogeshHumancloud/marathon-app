import React from "react";

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

const MarathonList = ({ navigation }) => {
  const dispatch = useDispatch();
  const [selectedType, setSelectedType] = useState({});
  const marathon = useSelector((store) => store.marathon);
  // const [loading, setLoading] = useState(false);
  // const [selectedActivity, setSelectedActivity] = useState("run");

  const handleEventSelect = (id) => {
    setSelectedType(id);
  };

  const renderItem = ({ item, index }) => {
    return <MarathonCard marathon={item} />;
  };

  const handleNext = () => {
    if (selectedType.id) {
      dispatch(setMarathon({ ...marathon.marathon, selectedType }));
      navigation.reset({
        index: 0,
        routes: [{ name: "dashboard" }],
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Select option to continue",
        position: "bottom",
      });
    }
  };

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
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.subtext}>Live Marathons</Text>
        <Text style={{ ...styles.subtext, ...styles.viewall }}>View All</Text>
      </View>
      <View style={{ marginTop: 16, flexDirection: "row", gap: 8 }}>
        {[
          {
            id: "44445",
            text: "Runner",
            imageSource: ImagesSource.WelcomeMarathon.runner,
          },
          {
            id: "4445",
            text: "Spectator",
            imageSource: ImagesSource.WelcomeMarathon.spectator,
          },
        ].map((item) => (
          <MarathonCard marathon={item} />
        ))}
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 40,
        }}
      >
        <Text style={styles.subtext}>Upcoming Marathons</Text>
        <Text style={{ ...styles.subtext, ...styles.viewall }}>View All</Text>
      </View>
      <View style={{ marginTop: 16, flexDirection: "row", gap: 8 }}>
        {[
          {
            id: "44445",
            text: "Runner",
            imageSource: ImagesSource.WelcomeMarathon.runner,
          },
          {
            id: "4445",
            text: "Spectator",
            imageSource: ImagesSource.WelcomeMarathon.spectator,
          },
        ].map((item) => (
          <MarathonCard marathon={item} />
        ))}
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 40,
        }}
      >
        <Text style={styles.subtext}>Past Marathons</Text>
        <Text style={{ ...styles.subtext, ...styles.viewall }}>View All</Text>
      </View>
      <View
        style={{
          marginTop: 16,
          flexDirection: "row",
          gap: 8,
          marginBottom: 36,
        }}
      >
        {[
          {
            id: "44445",
            text: "Runner",
            imageSource: ImagesSource.WelcomeMarathon.runner,
          },
          {
            id: "4445",
            text: "Spectator",
            imageSource: ImagesSource.WelcomeMarathon.spectator,
          },
        ].map((item) => (
          <MarathonCard marathon={item} />
        ))}
      </View>

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
