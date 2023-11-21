import React, { useContext, useEffect, useState } from "react";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
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
import MarathonNavigator from "./MarathonNavigator";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import ActivityNavigator from "./ActivityNavigator";
import * as TaskManager from "expo-task-manager";
import { LOCATION_TRACKING } from "../constants";

const AuthStack = createNativeStackNavigator();
const Auth = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <AuthStack.Screen name="phonenumber" component={PhoneNumber} />
      <AuthStack.Screen name="otpverify" component={OTPVerification} />
    </AuthStack.Navigator>
  );
};

// const MainStack = createNativeStackNavigator();
const MainStack = createBottomTabNavigator();
const Main = ({ navigation }) => {
  const marathon = useSelector((store) => store.marathon);

  return (
    <MainStack.Navigator
      // initialRouteName={
      //   marathon.marathon?.id !== undefined &&
      //   marathon.marathon?.selectedType?.id !== undefined
      //     ? "dashboard"
      //     : "welcome"
      // }
      initialRouteName={"marathons"}
      screenOptions={({ route }) => {
        return {
          headerShown: false,
          animation: "slide_from_right",
          tabBarLabel: ({ focused, color }) => {
            return (
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: focused ? "#0064AD" : "#AEAEAE",
                  textTransform: "capitalize",
                }}
              >
                {route.name}
              </Text>
            );
          },

          // tabBarStyle: {
          //   height: 64,
          // },
          tabBarIcon: ({ focused, color, size }) => {
            return null;
          },
          tabBarIconStyle: {
            flex: 0,
          },
          tabBarItemStyle: {
            justifyContent: "center",
            marginHorizontal: 5,
          },
          tabBarActiveTintColor: "#FF9230",
          tabBarInactiveTintColor: "#AEAEAE",
          // header: ({ route }) => {
          //   return (
          //     <View
          //       style={{
          //         // height: 68,
          //         paddingHorizontal: 16,
          //         marginTop: Constants.statusBarHeight,
          //         backgroundColor: "#fff",
          //       }}
          //     >
          // {/* {route.name === "marathons" && (
          //   <TouchableOpacity
          //     onPress={() => {
          //       console.log("back");
          //     }}
          //   >
          //     <AntDesign name="arrowleft" size={24} color="#000" />
          //   </TouchableOpacity>
          // )} */}
          //       <Text
          //         style={{
          //           fontSize: 24,
          //           fontWeight: "700",
          //           color: "#0064AD",
          //           textTransform: "capitalize",
          //         }}
          //       >
          //         {route.name}
          //       </Text>
          //     </View>
          //   );
          // },
        };
      }}
    >
      {/*  <MainStack.Screen name="choosetype" component={ChooseUser} />
      <MainStack.Screen
      name="marathoncategorylist"
      component={MarathonCategoryList}
      />
      <MainStack.Screen name="marathonlist" component={MarathonList} />
      <MainStack.Screen name="marathondetails" component={MarathonDetails} />
      
    <MainStack.Screen name="dashboard" component={DashboardNavigator} /> */}
      <MainStack.Screen name="marathons" component={MarathonNavigator} />
      <MainStack.Screen name="training" component={ActivityNavigator} />
      {/* <MainStack.Screen
        name="choosetype"
        component={ChooseUser}
        options={{
          tabBarButton: () => {
            null;
          },
          tabBarStyle: {
            display: "none",
            tabBarStyle: {
              height: 0,
            },
          },
        }}
      /> */}
      <MainStack.Screen
        name="dashboard"
        component={DashboardNavigator}
        options={{
          tabBarButton: () => null,
          tabBarStyle: {
            display: "none",
            tabBarStyle: {
              height: 0,
            },
          },
        }}
      />
    </MainStack.Navigator>
  );
};

// const Tabs = createBottomTabNavigator();
// const MainTabs = () => {
//   const { isDarkmode } = useTheme();
//   return (
//     <Tabs.Navigator
//       screenOptions={{
//         headerShown: false,
//         tabBarStyle: {
//           borderTopColor: isDarkmode ? themeColor.dark100 : "#c0c0c0",
//           backgroundColor: isDarkmode ? themeColor.dark200 : "#ffffff",
//         },
//       }}
//     >
//       {/* these icons using Ionicons */}
//       <Tabs.Screen
//         name="Home"
//         component={Home}
//         options={{
//           tabBarLabel: ({ focused }) => (
//             <TabBarText focused={focused} title="Home" />
//           ),
//           tabBarIcon: ({ focused }) => (
//             <TabBarIcon focused={focused} icon={"md-home"} />
//           ),
//         }}
//       />
//       {/* <Tabs.Screen
//         name="Profile"
//         component={Profile}
//         options={{
//           tabBarLabel: ({ focused }) => (
//             <TabBarText focused={focused} title="Profile" />
//           ),
//           tabBarIcon: ({ focused }) => (
//             <TabBarIcon focused={focused} icon={"person"} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="About"
//         component={About}
//         options={{
//           tabBarLabel: ({ focused }) => (
//             <TabBarText focused={focused} title="About" />
//           ),
//           tabBarIcon: ({ focused }) => (
//             <TabBarIcon focused={focused} icon={"ios-information-circle"} />
//           ),
//         }}
//       /> */}
//     </Tabs.Navigator>
//   );
// };

export default () => {
  // const auth = useContext(AuthContext);
  // const user = auth.user;

  const user = useSelector((store) => store.user);

  // useEffect(() => {
  //   console.log(
  //     "USER DATA CHANGE RECEIVED FROM APPNABIGUEGD",
  //     JSON.stringify(user)
  //   );
  // }, [user]);

  return (
    <NavigationContainer>
      {user?.user == null && <Auth />}
      {/* {user == false && <Auth />} */}
      {user?.user?.tokens && <Main />}
    </NavigationContainer>
  );
};
