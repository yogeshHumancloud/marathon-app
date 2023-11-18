import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import Card from "../components/common/Card";
import { getEventBibs, getEventData } from "../api";
import { useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

const Leaderboard = ({ navigation }) => {
  const [bibs, setBibs] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedMarathon = useSelector((store) => store.marathon);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [intervals, setIntervals] = useState([]);
  const [selectedInterval, setSelectedInterval] = useState({});
  const [allIntervals, setAllIntervals] = useState([]);

  // useEffect(() => {
  // const fetchBibs = async () => {
  //   if (selectedMarathon.marathon?.id) {
  //     setLoading(true);
  //     const data = await getEventBibs({
  //       event_id: selectedMarathon.marathon?.id,
  //       query: searchValue !== "" ? searchValue : undefined,
  //       sortBy: "position",
  //     });
  //     setBibs(data.data.results);
  //     setLoading(false);
  //   } else {
  //     navigation.reset({
  //       index: 0,
  //       routes: [{ name: "marathons" }],
  //     });
  //   }
  // };
  // fetchBibs();
  // }, [searchValue]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedMarathon.marathon?.id) {
        const data = await getEventData({
          event_id: selectedMarathon.marathon?.id,
        });

        setCategories(data.races);
        setSelectedCategory(data.races[0]);
        setAllIntervals(data.intervals);
        setIntervals(
          data.intervals?.filter(
            (intse) => intse.race_id === data.races[0]?.race_id
          )
        );

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
    intervals?.length > 0 && setSelectedInterval(intervals[0]);
  }, [intervals]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedCategory.race_id) {
        setIntervals(
          allIntervals?.filter(
            (intse) => intse.race_id === selectedCategory?.race_id
          )
        );
        // const data = await axios.get(
        //   `https://api.chronotrack.com:443/api/race/${selectedCategory?.race_id}/interval?format=json&client_id=727dae7f&user_id=test-api%40chronotrack.com&user_pass=cd77558dc610ca8dc956b0a2b2cec47c26e75e8b&page=1&size=50`
        // );
        // setIntervals(data.data.race_interval);
        // setSelectedInterval(data.data.race_interval[0]);
      }
    };
    fetchData();
  }, [selectedCategory]);

  useEffect(() => {
    // const fetchBibs = async () => {
    //   if (
    //     selectedMarathon.marathon?.id &&
    //     selectedCategory?.race_id &&
    //     selectedInterval.interval_id
    //   ) {
    //     setLoading(true);
    //     const data = await axios.get(
    //       `https://api.chronotrack.com:443/api/interval/${selectedInterval.interval_id}/results?format=json&client_id=727dae7f&user_id=test-api%40chronotrack.com&user_pass=cd77558dc610ca8dc956b0a2b2cec47c26e75e8b&page=1&size=50`
    //     );
    //     setBibs(data.data.interval_results);
    //     setLoading(false);
    //   }
    //   // else {
    //   //   navigation.reset({
    //   //     index: 0,
    //   //     routes: [{ name: "marathons" }],
    //   //   });
    //   // }
    // };
    // fetchBibs();
    const fetchBibs = async () => {
      if (selectedMarathon.marathon?.id && selectedInterval.interval_id) {
        setLoading(true);
        setBibs([]);
        const data = await getEventBibs({
          event_id: selectedMarathon.marathon?.id,
          query: searchValue !== "" ? searchValue : undefined,
          sortBy: "position",
          interval_id: selectedInterval.interval_id,
          ct_id: selectedMarathon?.marathon?.ct_id,
          race_id: selectedCategory?.race_id,
        });

        setBibs(data.data.results);
        setLoading(false);
      }
      //  else {
      //   navigation.reset({
      //     index: 0,
      //     routes: [{ name: "marathons" }],
      //   });
      // }
    };
    fetchBibs();
  }, [selectedCategory, selectedInterval, searchValue]);

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
      <View style={styles.cardTitleCont}>
        {categories.map((cate, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.9}
            onPress={() => {
              setSelectedInterval({});
              setSelectedCategory(cate);
            }}
            style={[
              styles.cardTitleBUtton,
              {
                backgroundColor:
                  selectedCategory?.race_name === cate.race_name
                    ? "#FF92301A"
                    : "#fff",
                borderColor:
                  selectedCategory?.race_name === cate.race_name
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
                    selectedCategory?.race_name === cate.race_name
                      ? "#FF9230"
                      : "#666666",
                },
              ]}
            >
              {cate.race_name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Picker
        style={{
          backgroundColor: "#fff",
          marginVertical: 12,
          borderWidth: 1,
          borderColor: "#000",
          elevation: 5,
        }}
        selectedValue={selectedInterval}
        onValueChange={(itemValue, itemIndex) => setSelectedInterval(itemValue)}
      >
        {/* <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" /> */}
        {intervals?.map((inter, index) => (
          <Picker.Item label={`Interval ${index + 1}`} value={inter} />
        ))}
      </Picker>
      <ScrollView style={{ marginTop: 24 }}>
        {loading ? (
          <ActivityIndicator color={"#999"} size={"large"} />
        ) : bibs.length > 0 ? (
          bibs.map((bib, index) => <Card key={index} bib={bib} />)
        ) : (
          <Text style={styles.textCont}>No results yet</Text>
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
