import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { ImagesSource } from "../../assets/images/images";

const Card = ({ bib, isResult = false }) => {
  return (
    <View
      style={{
        padding: 8,
        // elevation: 5,
        borderWidth: 1,
        borderColor: "#0000001A",
        backgroundColor: "#fff",
        flexDirection: "row",
        gap: 8,
        marginBottom: 8,
      }}
    >
      <Image
        style={{
          width: 74,
          minHeight: 74,
          height: "100%",
          resizeMode: "cover",
        }}
        source={
          bib.picture
            ? {
                uri: bib.picture,
              }
            : ImagesSource.Profile.placeholder
        }
      />
      <View style={{ flex: 1 }}>
        <Text style={{ color: "#333", fontSize: 16, fontWeight: "700" }}>
          {bib.results_first_name} {bib.results_last_name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <Text style={{ color: "#999", fontSize: 14 }}>Bib No:</Text>
          <Text style={{ color: "#333", fontSize: 14 }}>{bib.results_bib}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "#999", fontSize: 14 }}>
            {isResult ? "Rank:" : "Current Position:"}
          </Text>
          <Text style={{ color: "#333", fontSize: 14 }}>
            {bib.results_rank}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "#999", fontSize: 14 }}>
            {isResult ? "Award Time:" : "Start Time:"}
          </Text>
          <Text style={{ color: "#333", fontSize: 14 }}>
            {isResult ? bib.results_time : bib.results_time}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({});
