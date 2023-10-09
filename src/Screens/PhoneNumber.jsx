import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { TouchableOpacity } from "react-native";
import Button from "../components/common/Button";
import Toast from "react-native-toast-message";
import { sendOTP } from "../api";

const PhoneNumber = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const [text, setText] = React.useState("");

  const handleLogin = async () => {
    if (text.length === 10) {
      try {
        setLoading(true);
        const response = await sendOTP({ mobile_number: text });

        if (response.response.status === "success") {
          setLoading(false);
          navigation.navigate("otpverify", {
            mobile_number: text,
          });
        } else {
          setLoading(false);
          Toast.show({
            type: "error",
            text1: "Some error occured, please try again",
            position: "bottom",
          });
        }
      } catch (e) {
        console.log(e);
        setLoading(false);
        Toast.show({
          type: "error",
          text1: "Some error occured, please try again",
          position: "bottom",
        });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Please enter valid mobile number",
        position: "bottom",
      });
    }
  };

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        onPress={() => {
          console.log("back");
        }}
        style={styles.backButton}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Enter Phone Number</Text>

      <Text style={styles.subtext}>
        Please enter your valid phone number. We will send you a 4-digit code to
        verify your account .
      </Text>
      <View style={styles.container}>
        <Text style={styles.phoneHeader}>Phone Number</Text>

        <View style={styles.phoneContainer}>
          <Text
            style={{
              verticalAlign: "middle",
              paddingLeft: 15,
              paddingRight: 2,
            }}
          >
            +91
          </Text>
          <TextInput
            value={text}
            onChangeText={(text) => setText(text)}
            mode="outlined"
            style={styles.inputTextPhone}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
      </View>
      <Button
        color={"#0064AD"}
        label="Continue"
        onPress={handleLogin}
        isLoading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 48,
  },
  mainContainer: {
    flex: 1,
    paddingTop: 44,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  backButton: {
    paddingHorizontal: 5,
  },
  phoneContainer: {
    fontSize: 20,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    marginVertical: 4,
    width: "100%",
    justifyContent: "center",
    height: 48,
  },
  inputTextPhone: {
    padding: 0,
    margin: 0,
    flex: 1,
    borderWidth: 0,
    outline: "none",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontFamily: "Montserrat",
    fontWeight: "700",
    marginTop: 32,
    padding: 5,
  },
  subtext: {
    fontSize: 16,
    fontWeight: "400",
    paddingLeft: 5,
    paddingRight: 5,
    color: "#666",
  },

  phoneHeader: {
    marginLeft: 7,
    fontSize: 14,
    color: "#333",
    fontWeight: "400",
  },
});

export default PhoneNumber;
