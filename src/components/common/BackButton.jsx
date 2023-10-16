import React from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import Ionicons from "react-native-vector-icons/Ionicons";

const BackButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginLeft: 5,
        borderRadius: "2",
        fontSize: 20,
        borderWidth: 0,
        borderRadius: 10,
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        backgroundColor: "#0064AD",
      }}
    >
      {/* <Ionicons name="arrow-back-outline" size={24} color="#000" /> */}
      <Text style={{ color: "white" }}>Back</Text>
    </TouchableOpacity>
  );
};

export default BackButton;
