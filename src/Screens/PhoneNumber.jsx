import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TextInput } from "react-native";
import { Input } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
// import Button from "../components/common/BackButton";
import { Icon } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import BackButton from "../components/common/BackButton";
import Button from "../components/common/Button";
import Toast from "react-native-toast-message";
import { sendOTP } from "../api";

const PhoneNumber = ({ onVerify, navigation }) => {
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const [loading, setLoading] = useState(false);

  const [text, setText] = React.useState("");
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleVerify = () => {
    const formattedOTP = otp.join("");
    if (formattedOTP.length === 6) {
      onVerify(formattedOTP);
    } else {
      Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP.");
    }
  };

  const handleOTPChange = (text, index) => {
    if (text.length <= 1) {
      const updatedOTP = [...otp];
      updatedOTP[index] = text;
      setOTP(updatedOTP);
      if (text === "" && index > 0) {
        // If the current input is empty and it's not the first input, move to the previous input
        inputRefs.current[index - 1].focus();
      }

      if (text.length === 1 && index < 5) {
        inputRefs.current[index + 1].focus(); // Move to the next input
      } else if (text.length === 0 && index > 0) {
        inputRefs.current[index - 1].focus(); // Move to the previous input
      }
    }
  };
  const handleKeyPress = (e, index) => {
    console.log("press button");
    if (e.nativeEvent.key === "Backspace" && index > 0 && otp[index] === "") {
      //   setTimeout(() => {
      inputRefs.current[index - 1].focus();
      //   }, 0);
    }
    if (otp[index] !== "") {
      console.log("input field not blank", e.nativeEvent.key);
      const updatedOTP = [...otp];
      updatedOTP[index] = e.nativeEvent.key;
      setOTP(updatedOTP);
      console.log(updatedOTP, "updatedopt");
      if (index < 5 && e.nativeEvent.key !== "Backspace") {
        inputRefs.current[index + 1].focus();
      }
    }
  };
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
      {/* <TouchableOpacity style={styles.backButton}>
        <Text>Back</Text>
      </TouchableOpacity> */}
      <BackButton />
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
        <LinearGradient
          colors={["#4c669f", "#3b5998", "#192f6a"]}
          style={styles.buttonContainer}
        ></LinearGradient>
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
    fontSize: 20,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 5,
    alignSelf: "flex-start",

    paddingHorizontal: 10,
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
    // fontFamily: "Open Sans",
    paddingLeft: 5,
    paddingRight: 5,
    color: "#666",
  },
  otpContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 6,
  },
  phoneHeader: {
    marginLeft: 7,
    fontSize: 14,
    color: "#333",
    fontWeight: "400",
  },
  input: {
    width: 40,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    textAlign: "center",
    fontSize: 20,
    marginTop: 200,
  },
  buttonContainer: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "blue",
  },
  button: {
    borderRadius: 10,
    backgroundColor: "blue",
  },
});

export default PhoneNumber;
