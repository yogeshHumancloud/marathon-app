import { StyleSheet, View, TextInput, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import Card from "../components/common/Card";
import { getEventBibs } from "../api";

const Leaderboard = () => {
  const [bibs, setBibs] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchBibs = async () => {
      const data = await getEventBibs({
        query: searchValue !== "" ? searchValue : undefined,
      });
      setBibs(data.data.results);
    };
    fetchBibs();
  }, [searchValue]);

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
          value={searchValue}
          onChangeText={setSearchValue}
        />
      </View>
      <ScrollView style={{ marginTop: 24 }}>
        {bibs.map((bib) => (
          <Card bib={bib} />
        ))}
      </ScrollView>
    </View>
  );
};

export default Leaderboard;

const styles = StyleSheet.create({});
