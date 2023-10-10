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

const ChooseUser = () => {
  const [selectedMarathon, setSelectedMarathon] = useState("44445");
  const [loading, setLoading] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState("run");
  const handleEventSelect = (id) => {
    setSelectedMarathon(id);
  };
  const handleActivitySelect = (id) => {
    setSelectedActivity(id);
  };
  const renderItem = ({ item, index }) => {
    return (
      <EventCard
        imageSource={item.imageSource}
        text={item.text}
        key={item.id}
        id={item.id}
        onPress={handleEventSelect}
        isSelected={item.id === selectedMarathon}
      />
    );
  };
  const renderActivityItem = ({ item, index }) => {
    return (
      <ActivityCard
        ImageSource={item.ImageSource}
        text={item.text}
        key={item.id}
        id={item.id}
        onPress={handleActivitySelect}
        isSelected={item.id === selectedActivity}
      />
    );
  };
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        onPress={() => {
          console.log("back");
        }}
        style={styles.backButton}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title1}>Welcome to the</Text>
      <Text style={styles.titleNext2}>Baramathi</Text>
      <Text style={styles.titleNext2}>
        Power Marathon <Text style={styles.titleNext3}>2023</Text>
      </Text>
      <Text style={styles.subtext}>Are you a?</Text>
      <FlatList
        contentContainerStyle={{ marginTop: 50 }}
        data={[
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
        ]}
        numColumns={2}
        renderItem={renderItem}
      />

      <Button
        color={"#0064AD"}
        label="Next"
        onPress={() => console.log("next")}
        isLoading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingTop: 44,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  titleNext3: {
    fontSize: 24,
    marginBottom: 0,
    fontFamily: "Montserrat",
    fontWeight: "700",
    marginTop: 0,
    padding: 0,
    color: "#FF9230",
  },
  titleNext2: {
    fontSize: 24,
    marginBottom: 0,
    fontFamily: "Montserrat",
    fontWeight: "700",
    marginTop: 0,
    padding: 0,
    color: "#0064AD",
  },
  title1: {
    fontSize: 24,
    marginBottom: 0,
    fontFamily: "Montserrat",
    fontWeight: "700",
    marginTop: 0,
    padding: 0,
    color: "#999999",
  },
  title: {
    fontSize: 24,
    marginBottom: 0,
    fontFamily: "Montserrat",
    fontWeight: "700",
    marginTop: 0,
    padding: 0,
  },
  title2: {
    fontSize: 20,
    marginBottom: 16,
    fontFamily: "Montserrat",
    fontWeight: "700",
    marginTop: 32,
    padding: 5,
  },
  subtext: {
    fontSize: 16,
    fontWeight: "400",
    paddingLeft: 5,
    paddingRight: 20,
    lineHeight: 20,
    marginTop: 10,
    flexWrap: "wrap",
    color: "#666",
    marginTop: 16,
  },
  backButton: {
    paddingHorizontal: 5,
    marginBottom: 32,
  },
});

export default ChooseUser;
