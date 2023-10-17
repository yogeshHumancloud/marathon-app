import React from "react";

import { View, Text, StyleSheet } from "react-native";
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
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { setMarathon } from "../reduxToolkit/marathon/marathonSlice";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import Constants from "expo-constants";

const StopWatch = ({ navigation }) => {
  const dispatch = useDispatch();
  const [selectedType, setSelectedType] = useState({});
  const marathon = useSelector((store) => store.marathon);
  // const [loading, setLoading] = useState(false);
  // const [selectedActivity, setSelectedActivity] = useState("run");

  const handleEventSelect = (id) => {
    setSelectedType(id);
  };

  const renderItem = ({ item, index }) => {
    return (
      <EventCard
        imageSource={item.imageSource}
        text={item.text}
        key={item.id}
        id={item.id}
        item={item}
        onPress={handleEventSelect}
        isSelected={item.id === selectedType?.id}
      />
    );
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
    <View style={styles.mainContainer}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={styles.backButton}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.stopWatchContainer}>
        <View style={styles.stopWatchSubCont}>
          <View style={styles.timeWithIcon}>
            <Ionicons name="alarm" size={24} color="#666666" />
            <Text style={styles.textwithSymbol}>Time</Text>
          </View>

          <Text style={styles.textwithSymbol}>16.24.00</Text>
        </View>
        <View style={styles.stopWatchSubCont}>
          <View style={styles.timeWithIcon}>
            <Ionicons name="location" size={24} color="#666666" />

            <Text style={styles.textwithSymbol}>Distance</Text>
          </View>
          <Text style={styles.textwithSymbol}>0.00 kms</Text>
        </View>
        <View style={styles.stopWatchSubCont}>
          <Text style={styles.textwithSymbol}>Calories</Text>
          <Text style={styles.textwithSymbol}>0.00</Text>
        </View>
        <View style={styles.stopWatchSubCont}>
          <Text style={styles.textwithSymbol}>Cureent Place</Text>
          <Text style={styles.textwithSymbol}>0.00</Text>
        </View>
        <View style={styles.stopWatchSubCont}>
          <Text style={styles.textwithSymbol}>Avg Pace</Text>
          <Text style={styles.textwithSymbol}>72.34</Text>
        </View>
      </View>
      <View style={styles.buttonCont}>
        <TouchableOpacity style={styles.stopBUtton}>
          <FontAwesome
            name="stop"
            size={16}
            color="#FFF"
            style={styles.stopIcon}
          />
          <Text style={styles.buttonText}>STOP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pauseBUtton}>
          <FontAwesome
            name="pause"
            size={16}
            color="#FFF"
            style={styles.stopIcon}
          />
          <Text style={styles.buttonText}>PAUSE</Text>
        </TouchableOpacity>
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
    backgroundColor: "#33333333",
    paddingTop: 16,
    paddingHorizontal: 16,
  },

  mainContainer: {
    flex: 1,
    // flexDirection: "column",
    // justifyContent: "flex-start",
    // alignItems: "flex-start",
    // paddingTop: 44,
    paddingBottom: 0,
    paddingTop: Constants.statusBarHeight,
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
    backgroundColor: "#33333333",
    width: "100%",
    gap: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
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
