import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { ImagesSource } from "../../assets/images/images";

const MarathonCard = ({ marathon, navigation, category }) => {
  return (
    // <TouchableOpacity onPress={() => onPress(id)} style={styles.backButton}>
    <>
      {marathon.title !== undefined ? (
        <TouchableOpacity
          style={styles.container}
          onPress={() => {
            navigation.navigate("marathondetails", { marathon, category });
          }}
          activeOpacity={9}
        >
          <Image
            source={{ uri: marathon.thumbnail }}
            style={styles.imageContainer}
            resizeMode="cover"
          />
          <Text style={styles.title}>{marathon.title}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginTop: 8,
            }}
          >
            <Text style={styles.propertyname}>Date:</Text>
            <Text style={styles.propertyvalue}>
              {" "}
              {new Date(marathon.date)
                ?.toUTCString()
                ?.split(" ")
                ?.splice(0, 4)
                ?.join(" ")}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginTop: 4,
            }}
          >
            <Text style={styles.propertyname}>Location:</Text>
            <Text style={styles.propertyvalue}>{marathon.location}</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginTop: 8,
              gap: 4,
              width: "100%",
            }}
          >
            {marathon.categories?.map((category, i) => (
              <View
                key={i}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderWidth: 1,
                  borderColor: "#99999966",
                  borderRadius: 80,
                }}
              >
                <Text style={{ color: "#666", fontSize: 10 }}>
                  {category.title}
                </Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      ) : (
        <View style={{ flex: 1 }}></View>
      )}
    </>
    // </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    // justifyContent: "center",
    alignItems: "center",
    padding: 8,
    flex: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#99999966",
    background: "#FFF",
    // backgroundColor: "#000",
  },
  imageContainer: {
    width: "100%",
    height: 120,
    borderRadius: 4,
    resizeMode: "repeat",
  },
  title: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    width: "100%",
  },
  propertyname: {
    fontSize: 12,
    fontWeight: "400",
    color: "#999",
  },
  propertyvalue: {
    fontSize: 12,
    fontWeight: "400",
    color: "#333",
  },
});

export default MarathonCard;
