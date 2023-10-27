import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// import TabBarIcon from "../components/utils/TabBarIcon";
// import TabBarText from "../components/utils/TabBarText";
//Screens
import Home from "../components/Home/Home";
// Auth screens
// import { AuthContext } from "../provider/AuthProvider";
import Login from "../Screens/Login";
import { useSelector } from "react-redux";
import PhoneNumber from "../Screens/PhoneNumber";
import OTPVerification from "../Screens/OTPVerification";
import DashboardNavigator from "./DashboardNavigator";
import Welcome from "../Screens/Welcome";
import ChooseUser from "../Screens/ChooseUser";
import MarathonCategoryList from "../Screens/MarathonCategoryList";
import MarathonList from "../Screens/MarathonList";
import MarathonDetails from "../Screens/MarathonDetails";
import ActivityStart from "../Screens/ActivityStart";
import { Text, TouchableOpacity, View } from "react-native";
import Constants from "expo-constants";
import { AntDesign } from "@expo/vector-icons";

const MainStack = createNativeStackNavigator();
// const MainStack = createBottomTabNavigator();
const MarathonNavigator = ({ navigation }) => {
  const marathon = useSelector((store) => store.marathon);
  return (
    <MainStack.Navigator
      // initialRouteName={
      //   marathon.marathon?.id !== undefined &&
      //   marathon.marathon?.selectedType?.id !== undefined
      //     ? "dashboard"
      //     : "welcome"
      // }
      screenOptions={{
        animation: "slide_from_right",
        header: ({ route }) => {
          return (
            <View
              style={{
                height: route.name === "dashboard" ? 0 : 68,
                paddingHorizontal: 16,
                marginTop: Constants.statusBarHeight,
                backgroundColor: "#fff",
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
              }}
            >
              {(route.name === "marathondetails" ||
                route.name === "marathoncategorylist") && (
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  <AntDesign name="arrowleft" size={24} color="#000" />
                </TouchableOpacity>
              )}
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "700",
                  color: "#0064AD",
                  textTransform: "capitalize",
                }}
              >
                {route.name === "marathonlist" && "Marathons"}
                {route.name === "marathoncategorylist" &&
                  `${route.params.type} Marathons`}
                {route.name === "marathondetails" &&
                  `${route.params.marathon?.title}`}
              </Text>
            </View>
          );
        },
      }}
    >
      {/* <MainStack.Screen name="welcome" component={Welcome} />
      <MainStack.Screen name="choosetype" component={ChooseUser} /> */}
      <MainStack.Screen name="marathonlist" component={MarathonList} />
      <MainStack.Screen
        name="marathoncategorylist"
        component={MarathonCategoryList}
      />
      <MainStack.Screen name="marathondetails" component={MarathonDetails} />

      {/* <MainStack.Screen name="dashboard" component={DashboardNavigator} /> */}
    </MainStack.Navigator>
  );
};

export default MarathonNavigator;
