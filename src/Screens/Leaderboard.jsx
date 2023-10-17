import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import Card from "../components/common/Card";
import { getEventBibs } from "../api";
import { useSelector } from "react-redux";

const Leaderboard = ({ navigation }) => {
  const [bibs, setBibs] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedMarathon = useSelector((store) => store.marathon);

  useEffect(() => {
    const fetchBibs = async () => {
      if (selectedMarathon.marathon?.id) {
        setLoading(true);
        const data = await getEventBibs({
          event_id: selectedMarathon.marathon?.id,
          query: searchValue !== "" ? searchValue : undefined,
          sortBy: "position",
        });
        setBibs(data.data.results);
        setLoading(false);
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "welcome" }],
        });
      }
    };
    fetchBibs();
  }, [searchValue]);

  return (
    <View style={styles.cont}>
      <View style={styles.mainCont}>
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
        {loading ? (
          <ActivityIndicator color={"#999"} size={"large"} />
        ) : bibs.length > 0 ? (
          bibs.map((bib, index) => <Card key={index} bib={bib} />)
        ) : (
          <Text style={styles.textCont}>No data found</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Leaderboard;

const styles = StyleSheet.create({
  cont: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 16,
    paddingTop: 24,
  },
  mainCont: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#999999",
    borderRadius: 3,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
  },
  textCont: {
    textAlign: "center",
    fontSize: 16,
    color: "#000",
  },
});
