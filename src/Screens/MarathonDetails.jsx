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
import { Image } from "react-native";

const MarathonDetails = ({ navigation }) => {
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
      <Image
        style={{
          width: "100%",
          height: 120,
          resizeMode: "cover",
          borderRadius: 2,
        }}
        source={ImagesSource.chooseActivity.marathon2}
      />
      <ScrollView style={{ marginTop: 16, flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            borderRadius: 4,
          }}
        >
          <Text style={{ color: "#333", fontSize: 14, fontWeight: "700" }}>
            Marathon 1
          </Text>
          <View
            style={{
              backgroundColor: "#79FF7E",
              borderRadius: 4,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                color: "#574F09",
                fontSize: 12,
                fontWeight: "500",
                textTransform: "uppercase",
              }}
            >
              Live
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 8,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "#999", fontSize: 12 }}>Date: </Text>
          <Text style={{ color: "#000", fontSize: 12 }}>10-09-2023</Text>
        </View>
        <View
          style={{
            marginTop: 8,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "#999", fontSize: 12 }}>Location: </Text>
          <Text style={{ color: "#000", fontSize: 12 }}>10-09-2023</Text>
        </View>

        <View
          style={{
            marginTop: 8,
          }}
        >
          <Text style={{ color: "#999", fontSize: 12 }}>Events: </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 4,
              marginTop: 4,
              flexWrap: "wrap",
            }}
          >
            {Array(20)
              .fill(0)
              .map((i, ii) => (
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderWidth: 1,
                    borderColor: "#99999966",
                    borderRadius: 80,
                    alignSelf: "flex-start",
                  }}
                >
                  <Text style={{ color: "#666", fontSize: 12 }}>{ii}</Text>
                </View>
              ))}
          </View>
        </View>

        <View
          style={{
            marginTop: 8,
          }}
        >
          <Text style={{ color: "#999", fontSize: 12 }}>Description: </Text>
          <Text
            style={{
              marginTop: 8,
              color: "#333",
            }}
          >
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
            fugit, sed quia consequuntur ma Ut enim ad minima veniam, quis
            nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut
            al Quis autem vel eum iure reprehenderit qui in ea voluptate velit
            esse quam nihil molestiae consequatu
          </Text>
        </View>
      </ScrollView>

      <Button color={"#0064AD"} label="Register" onPress={() => {}} />
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

export default MarathonDetails;
