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
          routes: [{ name: "welcome" }],
        });
      }
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
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                color: "#000",
              }}
            >
              No data found
            </Text>
          )}
        </ScrollView>
      ) : (
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
      )}
    </View>
  );
};

export default Results;

const styles = StyleSheet.create({});
