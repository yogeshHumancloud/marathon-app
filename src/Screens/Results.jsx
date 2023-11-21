import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import Card from "../components/common/Card";
import { useSelector } from "react-redux";
import { getEventBibs, getEventData } from "../api";

const Results = () => {
  const [results, setResults] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [loading, setLoading] = useState(false);
  const selectedMarathon = useSelector((store) => store.marathon);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedMarathon.marathon?.id) {
        const data = await getEventData({
          event_id: selectedMarathon.marathon?.id,
        });

        setCategories(data.event.categories);
        setSelectedCategory(data.event.categories[0]);

        //   const data = await axios.get(
        //     `https://api.chronotrack.com:443/api/event/${selectedMarathon?.marathon?.ct_id}/race?format=json&client_id=727dae7f&user_id=test-api%40chronotrack.com&user_pass=cd77558dc610ca8dc956b0a2b2cec47c26e75e8b&page=1&size=50&include_not_wants_results=true`
        //   );
        //   setCategories(data.data.event_race);
        //   setSelectedCategory(data.data.event_race[0]);
        // } else {
        //   navigation.reset({
        //     index: 0,
        //     routes: [{ name: "marathons" }],
        //   });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchBibs = async () => {
      if (selectedMarathon.marathon?.id) {
        setLoading(true);
        const data = await getEventBibs({
          event_id: selectedMarathon.marathon?.id,
          query: searchValue !== "" ? searchValue : undefined,
          sortBy: "position",
          type: "result",
          race_id: selectedCategory.race_id,
          ct_id: selectedMarathon?.marathon?.ct_id,
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
  }, [searchValue, selectedCategory, selectedMarathon]);

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

      <View style={styles.cardTitleCont}>
        {categories.map((cate, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.9}
            onPress={() => {
              setSelectedCategory(cate);
            }}
            style={[
              styles.cardTitleBUtton,
              {
                backgroundColor:
                  selectedCategory?.title === cate.title ? "#FF92301A" : "#fff",
                borderColor:
                  selectedCategory?.title === cate.title
                    ? "#FF9230"
                    : "#666666",
              },
            ]}
          >
            <Text
              style={[
                styles.cardTitle,
                {
                  color:
                    selectedCategory?.title === cate.title
                      ? "#FF9230"
                      : "#666666",
                },
              ]}
            >
              {cate.title}
            </Text>
          </TouchableOpacity>
        ))}
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
  cardTitleCont: {
    // marginTop: 0,
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  cardTitleBUtton: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 24,
  },
});
