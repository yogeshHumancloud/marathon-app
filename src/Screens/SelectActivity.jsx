import React from "react";

import { View, Text, StyleSheet, FlatList } from "react-native";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Constants from "expo-constants";
import RunningSVG from "../assets/icons/RunningSVG";
import WalkingSVG from "../assets/icons/WalkingSVG";
import HikingSVG from "../assets/icons/HikingSVG";
import SwimmingSVG from "../assets/icons/SwimmingSVG";
import BicycleSVG from "../assets/icons/BicycleSVG";
import OtherSVG from "./OtherSVG";
import { setActivity } from "../reduxToolkit/activity/activitySlice";

const activities = [
  {
    name: "Running",
    icon: <RunningSVG />,
  },
  {
    name: "Walking",
    icon: <WalkingSVG />,
  },
  {
    name: "Swimming",
    icon: <SwimmingSVG />,
  },
  {
    name: "Cycling",
    icon: <BicycleSVG />,
  },
  {
    name: "Hiking",
    icon: <HikingSVG />,
  },
  {
    name: "Other",
    icon: <OtherSVG />,
  },
];

const SelectActivity = ({ navigation }) => {
  const dispatch = useDispatch();
  const [selectedType, setSelectedType] = useState({});
  const activityState = useSelector((store) => store.activity);

  return (
    <View style={styles.mainContainer}>
      {/* {activities.map((activity) => (
        <View style={styles.activityContanier}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              ...styles.activityButton,
              ...(activity.name === activityState.activity?.name && {
                backgroundColor: "#0064AD1A",
                borderColor: "#0064AD66",
              }),
            }}
            onPress={() => {
              dispatch(
                setActivity({ ...activityState.activity, name: activity.name })
              );
              navigation.navigate("activity");
            }}
          >
            <View style={styles.activityIcon}>
              {activity.icon}
              <Text style={styles.textwithSymbol}>{activity.name}</Text>
            </View>
          </TouchableOpacity>
        </View>
      ))} */}

      <FlatList
        data={activities}
        renderItem={({ item }) => (
          <View style={styles.activityContanier}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                ...styles.activityButton,
                ...(item.name === activityState.activity?.name && {
                  backgroundColor: "#0064AD1A",
                  borderColor: "#0064AD66",
                }),
              }}
              onPress={() => {
                dispatch(
                  setActivity({ ...activityState.activity, name: item.name })
                );
                navigation.navigate("activity");
              }}
            >
              <View style={styles.activityIcon}>
                {item.icon}
                <Text style={styles.textwithSymbol}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      ></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  // activityContanier: {
  //   //   height: 628,
  //   flex: 1,
  //   width: "100%",
  //   alignItems: "center",
  //   backgroundColor: "#F5F5F5",
  //   paddingTop: 16,
  //   paddingHorizontal: 16,
  // },
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

export default SelectActivity;
