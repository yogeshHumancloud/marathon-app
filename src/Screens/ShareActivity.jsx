import React, { useRef } from "react";

import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";

const ShareActivity = ({ navigation, route }) => {
  const viewShot = useRef(null);

  return (
    <ViewShot
      style={styles.mainContainer}
      ref={viewShot}
      options={{ format: "jpg", quality: 0.9 }}
    >
      <View style={styles.mainContainer}>
        <View
          style={[
            styles.stopWatchContainer,
            {
              paddingTop: 16,
              paddingHorizontal: 16,
            },
          ]}
        >
          <View
            style={{
              width: "100%",
            }}
          >
            <View style={styles.stopWatchSubCont}>
              <View style={styles.timeWithIcon}>
                <Ionicons name="alarm" size={24} color="#666666" />
                <Text style={styles.textwithSymbol}>Time</Text>
              </View>

              <Text style={styles.textwithSymbol}>{route.params?.time}</Text>
            </View>
            <View style={styles.stopWatchSubCont}>
              <View style={styles.timeWithIcon}>
                <Ionicons name="location" size={24} color="#666666" />

                <Text style={styles.textwithSymbol}>Distance</Text>
              </View>
              <Text style={styles.textwithSymbol}>
                {`${(route.params?.distance / 1000).toFixed(2)} KM`}
              </Text>
            </View>
            <View style={styles.stopWatchSubCont}>
              <Text style={styles.textwithSymbol}>Calories</Text>
              <Text style={styles.textwithSymbol}>
                {route.params?.calories}
              </Text>
            </View>
            {/* <View style={styles.stopWatchSubCont}>
            <Text style={styles.textwithSymbol}>Current Pace</Text>
            <Text style={styles.textwithSymbol}>{getCurrentPace()}</Text>
          </View> */}
            <View style={styles.stopWatchSubCont}>
              <Text style={styles.textwithSymbol}>Average Pace</Text>
              <Text style={styles.textwithSymbol}>
                {route.params?.average_pace}
              </Text>
            </View>
          </View>

          <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
            <View style={[styles.buttonCont, { paddingHorizontal: 16 }]}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.pauseBUtton}
                onPress={() => {
                  viewShot.current.capture().then((uri) => {
                    console.log("do something with ", uri);
                    Sharing.shareAsync("file://" + uri);
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "activity" }],
                    });
                  }),
                    (error) => console.error("Oops, snapshot failed", error);
                }}
              >
                <FontAwesome
                  name={"share-alt"}
                  size={16}
                  color="#FFF"
                  style={styles.stopIcon}
                />
                <Text style={styles.buttonText}>Share Activity</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* <Button color={"#0064AD"} label="Next" onPress={handleNext} /> */}
      </View>
    </ViewShot>
  );
};

const styles = StyleSheet.create({
  stopWatchContainer: {
    //   height: 628,
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },

  mainContainer: {
    flex: 1,
    // flexDirection: "column",
    // justifyContent: "flex-start",
    // alignItems: "flex-start",
    // paddingTop: 44,
    // paddingBottom: 0,
    // paddingTop: Constants.statusBarHeight,
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
    backgroundColor: "transparent",
    width: "100%",
    gap: 16,
    paddingBottom: 16,
    // position: "absolute",
    // bottom: 0,
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
    textTransform: "uppercase",
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

export default ShareActivity;
