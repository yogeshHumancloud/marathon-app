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
import SelectActivity from "../Screens/SelectActivity";
import SelectWorkout from "../Screens/SelectWorkout";
import StopWatch from "../Screens/StopWatch";
import ShareActivity from "../Screens/ShareActivity";

const MainStack = createNativeStackNavigator();
// const MainStack = createBottomTabNavigator();
const ActivityNavigator = ({ navigation }) => {
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

        header: ({ route, navigation }) => {
          return (
            <View
              style={{
                height: 68,
                paddingHorizontal: 16,
                marginTop: Constants.statusBarHeight,
                backgroundColor: "#fff",
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
              }}
            >
              {route.name !== "activity" && (
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
                {route.name === "activity" && "Activity"}
                {route.name === "selectactivity" && "Select Activity"}
                {route.name === "selectworkout" && "Select Workout"}
              </Text>
            </View>
          );
        },
      }}
    >
      <MainStack.Screen name="activity" component={ActivityStart} />
      <MainStack.Screen name="selectactivity" component={SelectActivity} />
      <MainStack.Screen name="selectworkout" component={SelectWorkout} />
      <MainStack.Screen name="stopwatch" component={StopWatch} />
      <MainStack.Screen name="shareactivity" component={ShareActivity} />
    </MainStack.Navigator>
  );
};

export default ActivityNavigator;
