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

const SelectWorkout = ({ navigation }) => {
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
      <Text style={styles.header}>Select Activity</Text>
      {/* <View style={styles.mainActivityCont}></View> */}
      <View style={styles.activityContanier}>
        <TouchableOpacity style={styles.activityButton}>
          <View style={styles.activityIcon}>
            <Text style={styles.textwithSymbol}>None</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.activityContanier}>
        <TouchableOpacity style={styles.activityButton}>
          <View style={styles.activityIcon}>
            <Text style={styles.textwithSymbol}>20 mins</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.activityContanier}>
        <TouchableOpacity style={styles.activityButton}>
          <View style={styles.activityIcon}>
            <Text style={styles.textwithSymbol}>1 Km</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.activityContanier}>
        <TouchableOpacity style={styles.activityButton}>
          <View style={styles.activityIcon}>
            <Text style={styles.textwithSymbol}>2 Km</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.activityContanier}>
        <TouchableOpacity style={styles.activityButton}>
          <View style={styles.activityIcon}>
            <Text style={styles.textwithSymbol}>Long Distance</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.activityContanier}>
        <TouchableOpacity style={styles.activityButton}>
          <View style={styles.activityIcon}>
            <Text style={styles.textwithSymbol}>Short Bursts</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* <Button color={"#0064AD"} label="Next" onPress={handleNext} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  activityContanier: {
    //   height: 628,
    // flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#33333333",
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Montserrat",
    color: "#0064AD",
    paddingBottom: 8,
    paddingLeft: 16,
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
  activityIcon: {
    flexDirection: "row",
    gap: 8,
    // backgroundColor: "black",
  },
  activityButton: {
    backgroundColor: "#FFF",
    width: "100%",
    // height: 48,
    paddingVertical: 12,
    paddingHorizontal: 16,
    // marginTop: 6,
    marginBottom: 8,
    borderRadius: 4,
    border: "1px solid rgba(51, 51, 51, 0.20)",

    flexDirection: "row",
    justifyContent: "space-between",
  },
  mainActivityCont: {
    // flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "##33333333",
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  textwithSymbol: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Open Sans",
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
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  stopBUtton: {
    backgroundColor: "#0064AD",
    paddingHorizontal: 24,
    paddingVertical: 13,
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

export default SelectWorkout;
