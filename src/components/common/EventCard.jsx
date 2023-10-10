import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";

const EventCard = ({ imageSource, text, onPress, id, isSelected = false }) => {
  return (
    <TouchableOpacity onPress={() => onPress(id)} style={styles.backButton}>
      <View style={styles.container}>
        <Image
          source={imageSource}
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
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 150,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  selected: {
    borderWidth: 1,
    borderColor: "#0064AD",
  },
  imageContainer: {
    height: 100,
    borderRadius: 5,
  },
  subtext: {
    fontSize: 16,
    fontWeight: "400",
    color: "#666",
  },
  selectedSubText: {
    fontWeight: "700",
    color: "blue",
  },
});

export default EventCard;
