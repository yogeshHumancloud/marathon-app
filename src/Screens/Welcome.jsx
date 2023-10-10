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

const Welcome = () => {
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
      <Text style={styles.title}>Choose an Activity</Text>
      <Text style={styles.subtext}>
        Choose a marathon you want to access data for
      </Text>
      <FlatList 
        contentContainerStyle={{ marginTop: 50 }}
        data={[
          {
            id: "44445",
            text: "Marathon 1",
            imageSource: ImagesSource.chooseActivity.marathon1,
          },
          {
            id: "4445",
            text: "Marathon 2",
            imageSource: ImagesSource.chooseActivity.marathon2,
          },
        ]}
        numColumns={2}
        renderItem={renderItem}
      />

      <Text style={styles.title2}>Start activity</Text>
      <FlatList
        data={[
          {
            id: "run",
            text: "Run",
            ImageSource: <Runner />,
          },
          {
            id: "walk",
            text: "Walk",
            ImageSource: <Hiking />,
          },
          {
            id: "cycle",
            text: "Cycle",
            ImageSource: <Bicycle />,
          },
          {
            id: "jogging",
            text: "Jogging",
            ImageSource: <Jogging />,
          },
        ]}
        numColumns={4}
        renderItem={renderActivityItem}
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
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontFamily: "Montserrat",
    fontWeight: "700",
    marginTop: 32,
    padding: 5,
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
  },
});

export default Welcome;
