import React, { useEffect } from "react";

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
import { getWorkoutList } from "../api";
import { setActivity } from "../reduxToolkit/activity/activitySlice";

const SelectWorkout = ({ navigation }) => {
  const dispatch = useDispatch();
  const [selectedType, setSelectedType] = useState({});
  const activityState = useSelector((store) => store.activity);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await getWorkoutList();
      setWorkouts(response.data);
    };
    fetchWorkouts();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.activityContanier}>
        <TouchableOpacity
          style={{
            ...styles.activityButton,
            ...(activityState.activity?.workout === null && {
              backgroundColor: "#0064AD1A",
              borderColor: "#0064AD66",
            }),
          }}
          onPress={() => {
            dispatch(setActivity({ ...activityState.activity, workout: null }));
            navigation.navigate("activity");
          }}
        >
          <View style={styles.activityIcon}>
            <Text style={styles.textwithSymbol}>None</Text>
          </View>
        </TouchableOpacity>
      </View>
      {workouts.map((workout) => (
        <View style={styles.activityContanier}>
          <TouchableOpacity
            style={{
              ...styles.activityButton,
              ...(activityState.activity?.workout?.id === workout.id && {
                backgroundColor: "#0064AD1A",
                borderColor: "#0064AD66",
              }),
            }}
            onPress={() => {
              dispatch(setActivity({ ...activityState.activity, workout }));
              navigation.navigate("activity");
            }}
          >
            <View style={styles.activityIcon}>
              <Text style={styles.textwithSymbol}>{workout.name}</Text>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
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
    paddingHorizontal: 24,
    // marginTop: 6,
    marginBottom: 8,
    borderRadius: 4,
    // border: "1px solid rgba(51, 51, 51, 0.20)",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#33333333",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mainActivityCont: {
    // flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#33333333",
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
