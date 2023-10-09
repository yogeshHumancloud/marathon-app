import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Map from "../Screens/Map";
import Login from "../Screens/Login";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Constants from "expo-constants";
import { ImagesSource } from "../assets/images/images";
import Leaderboard from "../Screens/Leaderboard";
import Results from "../Screens/Results";
const Tab = createBottomTabNavigator();

const DashboardNavigator = () => {
  return (
    // <NavigationContainer>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabel: ({ focused, color }) => {
          return focused ? (
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#FF9230",
              }}
            >
              {route.name}
            </Text>
          ) : //   <Text></Text>
          null;
        },
        tabBarStyle: {
          height: 64,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Map") {
            iconName = "map-sharp";
          } else if (route.name === "Leaderboard") {
            iconName = "podium";
          } else if (route.name === "Results") {
            iconName = "trophy";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarIconStyle: {
          flex: 0,
          height: 32,
        },
        tabBarItemStyle: {
          justifyContent: "center",
          marginHorizontal: 5,
        },
        tabBarActiveTintColor: "#FF9230",
        tabBarInactiveTintColor: "#AEAEAE",

        header: ({ route }) => {
          return (
            <View
              style={{
                height: 68,
                padding: 16,
                marginTop: Constants.statusBarHeight,
                backgroundColor: "#fff",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "500", color: "#0064AD" }}
              >
                {route.name}
              </Text>
              <Image
                style={{ width: 36, height: 36, resizeMode: "cover" }}
                source={ImagesSource.mainScreen.ProfilePictire}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Map" component={Map} />
      <Tab.Screen name="Leaderboard" component={Leaderboard} />
      <Tab.Screen name="Results" component={Results} />
    </Tab.Navigator>
    // </NavigationContainer>
  );
};

export default DashboardNavigator;

const styles = StyleSheet.create({});
