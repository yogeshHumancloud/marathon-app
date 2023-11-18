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
import { getEvents } from "../api";
import Toast from "react-native-toast-message";
import { setMarathon } from "../reduxToolkit/marathon/marathonSlice";
import { useDispatch } from "react-redux";

const Welcome = ({ navigation }) => {
  const dispatch = useDispatch();
  const [selectedMarathon, setSelectedMarathon] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState("run");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await getEvents();
      setEvents(response.data.results);
      setSelectedMarathon(response.data.results[0]);
    };
    fetchEvents();
  }, []);

  const handleEventSelect = (marathon) => {
    setSelectedMarathon(marathon);
  };
  const handleActivitySelect = (id) => {
    setSelectedActivity(id);
  };

  const handleNext = () => {
    if (selectedMarathon.id) {
      dispatch(setMarathon(selectedMarathon));
      navigation.navigate("dashboard");
    } else {
      Toast.show({
        type: "error",
        text1: "Select Marathon to continue",
        position: "bottom",
      });
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <EventCard
        item={item}
        imageSource={item.thumbnail}
        text={item.title}
        key={item.id}
        id={item.id}
        onPress={handleEventSelect}
        isSelected={item.id && item.id === selectedMarathon.id}
        isFetched={true}
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
      <View style={{ flex: 0.4 }}>
        <FlatList
          contentContainerStyle={{
            marginTop: 36,
            paddingBottom: 48,
            // flex: 0.8,
          }}
          scrollEnabled
          data={events.length % 2 === 0 ? events : [...events, {}]}
          numColumns={2}
          renderItem={renderItem}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 12,
        }}
      >
        <Text style={styles.title2}>Start activity</Text>
        <Text style={[styles.title2, { color: "#FF9230" }]}>View all</Text>
      </View>
      <View style={{ flex: 0.6 }}>
        <FlatList
          contentContainerStyle={{ marginTop: 24 }}
          data={[
            {
              id: "run",
              text: "Run",
              ImageSource: <Runner selected={selectedActivity === "run"} />,
            },
            {
              id: "walk",
              text: "Walk",
              ImageSource: <Hiking selected={selectedActivity === "walk"} />,
            },
            {
              id: "cycle",
              text: "Cycle",
              ImageSource: <Bicycle selected={selectedActivity === "cycle"} />,
            },
            {
              id: "jogging",
              text: "Jogging",
              ImageSource: (
                <Jogging selected={selectedActivity === "jogging"} />
              ),
            },
          ]}
          // horizontal
          numColumns={4}
          renderItem={renderActivityItem}
        />
      </View>

      <Button
        color={"#0064AD"}
        label="Next"
        onPress={handleNext}
        isLoading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // flexDirection: "column",
    // justifyContent: "flex-start",
    // alignItems: "flex-start",
    // paddingTop: 44,
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 48,
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
    fontSize: 16,
    fontWeight: "400",
    paddingLeft: 5,
    paddingRight: 20,
    lineHeight: 20,
    marginTop: 48,
    marginBottom: 12,
    flexWrap: "wrap",
    color: "#666",
  },
});

export default Welcome;
