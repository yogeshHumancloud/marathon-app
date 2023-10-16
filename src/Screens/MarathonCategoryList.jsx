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

const MarathonCategoryList = ({ navigation }) => {
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
    <View style={styles.mainContainer}>
      <FlatList
        contentContainerStyle={{
          marginBottom: 36,
        }}
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
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ gap: 8 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }}></View>}
      ></FlatList>
    </View>
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

export default MarathonCategoryList;
