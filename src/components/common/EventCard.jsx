import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

const EventCard = ({
  imageSource,
  text,
  onPress,
  id,
  isSelected = false,
  item,
  isFetched = false,
}) => {
  return (
    // <TouchableOpacity onPress={() => onPress(id)} style={styles.backButton}>
    <TouchableOpacity
      disabled={text === undefined}
      style={styles.container}
      onPress={() => onPress(item)}
      activeOpacity={9}
    >
      <Image
        source={
          isFetched
            ? {
                uri: imageSource,
              }
            : imageSource
        }
        style={
          isSelected
            ? { ...styles.imageContainer, ...styles.selected }
            : styles.imageContainer
        }
        resizeMode="cover"
      />
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
    // </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 150,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // padding: 5,
    flex: 1,
    // backgroundColor: "#000",
  },
  selected: {
    borderWidth: 2,
    borderColor: "#0064AD",
  },
  imageContainer: {
    width: "90%",
    height: 100,
    borderRadius: 4,
  },
  subtext: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "400",
    color: "#999",
    textAlign: "center",
  },
  selectedSubText: {
    fontWeight: "700",
    color: "#0064AD",
  },
});

export default EventCard;
