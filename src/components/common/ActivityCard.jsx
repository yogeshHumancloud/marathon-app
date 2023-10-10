import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";

const ActivityCard = ({
  ImageSource,
  text,
  onPress,
  id,
  isSelected = false,
}) => {
  return (
    <View
      style={
        isSelected
          ? { ...styles.container, ...styles.selected }
          : styles.activityConatiner
      }
    >
      <TouchableOpacity onPress={() => onPress(id)}>
        <View style={styles.imageContainer}>{ImageSource}</View>
        <Text>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  selected: {
    borderWidth: 1,
    borderColor: "#0064AD",
  },
  imageContainer: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  subtext: {
    fontSize: 16,
    fontWeight: "400",
    color: "#666",
  },
});
export default ActivityCard;
