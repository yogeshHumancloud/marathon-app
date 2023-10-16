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
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(id)}
      activeOpacity={0.9}
    >
      <View
        style={
          isSelected
            ? { ...styles.imageContainer, ...styles.selectedImageContainer }
            : styles.imageContainer
        }
      >
        {ImageSource}
      </View>
      <Text
        style={
          isSelected
            ? { ...styles.subtext, ...styles.selectedSubText }
            : styles.subtext
        }
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  selected: {
    // borderWidth: 1,
    // borderColor: "#0064AD",
  },
  imageContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#0064AD1A",
  },
  selectedImageContainer: {
    borderWidth: 2,
    borderColor: "#0064AD66",
    backgroundColor: "#0064AD1A",
  },
  subtext: {
    fontSize: 14,
    fontWeight: "500",
    color: "#C0BDC9",
    marginTop: 8,
  },
  selectedSubText: {
    color: "#0064AD",
  },
});
export default ActivityCard;
