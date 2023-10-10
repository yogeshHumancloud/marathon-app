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

const AuthStack = createNativeStackNavigator();
const Auth = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="phonenumber" component={PhoneNumber} />
      <AuthStack.Screen name="otpverify" component={OTPVerification} />
    </AuthStack.Navigator>
  );
};

const MainStack = createNativeStackNavigator();
const Main = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="dashboard" component={DashboardNavigator} />
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

  useEffect(() => {
    console.log(
      "USER DATA CHANGE RECEIVED FROM APPNABIGUEGD",
      JSON.stringify(user)
    );
  }, [user]);

  return (
    <NavigationContainer>
      {user?.user == null && <Auth />}
      {/* {user == false && <Auth />} */}
      {user?.user?.tokens && <Main />}
    </NavigationContainer>
  );
};
