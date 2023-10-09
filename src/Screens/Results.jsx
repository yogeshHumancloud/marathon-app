import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import Card from "../components/common/Card";

const Results = () => {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        flex: 1,
        padding: 16,
        paddingTop: 24,
      }}
    >
      <View
        style={{
          width: "100%",
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "#999999",
          borderRadius: 3,
          paddingVertical: 12,
          paddingHorizontal: 16,
          flexDirection: "row",
        }}
      >
        <Ionicons name="search" size={24} color="#666666" />
        <TextInput
          style={{ flex: 1, marginLeft: 10, fontSize: 16 }}
          placeholder="Search by name or BIB No."
          placeholderTextColor="#999999"
          cursorColor="#999999"
        />
      </View>
      {/* <ScrollView style={{ marginTop: 24 }}>
        {Array(10)
          .fill(0)
          .map((e) => (
            <Card />
          ))}
      </ScrollView> */}

      <View
        style={{
          marginTop: 24,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#0064AD",
            fontSize: 16,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          Coming Soon..
        </Text>
        <Text
          style={{
            color: "#666",
            fontSize: 16,
            marginTop: 8,
            textAlign: "center",
          }}
        >
          Results will be uploaded once the race {"\n"} concludes and tallies
          are done.
        </Text>
      </View>
    </View>
  );
};

export default Results;

const styles = StyleSheet.create({});
