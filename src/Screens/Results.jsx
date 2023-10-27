import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import Card from "../components/common/Card";
import { useSelector } from "react-redux";
import { getEventBibs } from "../api";

const Results = () => {
  const [results, setResults] = useState([]);
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
          type: "result",
        });
        setResults(data.data.results);
        setLoading(false);
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "marathons" }],
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
          value={searchValue}
          onChangeText={(e) => setSearchValue(e)}
          style={{ flex: 1, marginLeft: 10, fontSize: 16 }}
          placeholder="Search by name or BIB No."
          placeholderTextColor="#999999"
          cursorColor="#999999"
        />
      </View>
      {results.status !== "pending" ? (
        <ScrollView style={{ marginTop: 24 }}>
          {loading ? (
            <ActivityIndicator color={"#999"} size={"large"} />
          ) : results.length > 0 ? (
            results.map((bib, index) => (
              <Card key={index} bib={bib} isResult={true} />
            ))
          ) : (
            <Text style={styles.textCont}>No data found</Text>
          )}
        </ScrollView>
      ) : (
        <View style={styles.commingSoonMainCont}>
          <Text style={styles.commingSoonTextCont}>Coming Soon..</Text>
          <Text style={styles.resultTextCont}>
            Results will be uploaded once the race {"\n"} concludes and tallies
            are done.
          </Text>
        </View>
      )}
    </View>
  );
};

export default Results;

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
  commingSoonMainCont: {
    marginTop: 24,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  commingSoonTextCont: {
    color: "#0064AD",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  resultTextCont: {
    color: "#666",
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
});
