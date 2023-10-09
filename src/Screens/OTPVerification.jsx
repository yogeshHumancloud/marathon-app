import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
// import { Button } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import BackButton from "../components/common/BackButton";
import Button from "../components/common/Button";
import { TouchableOpacity } from "react-native";
import { sendOTP, verifyOTP } from "../api";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { setUser } from "../reduxToolkit/user/userSlice";

const OTPVerification = ({ onVerify, navigation, route }) => {
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = React.useState("");
  const [otpLength, setotpLenght] = React.useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    console.log(route);
  }, []);

  useEffect(() => {
    console.log("OTP", otp.length);
    let lenght = 0;
    otp.map((ele) => {
      if (ele.trim() !== "") {
        lenght++;
        setotpLenght(lenght);
      }
    });
    // console.log(otpLength, "otpLength");
  }, [otp]);
  useEffect(() => {
    console.log("OTP lenght", otpLength);
  }, [otpLength]);
  const handleVerify = () => {
    const formattedOTP = otp.join("");
    if (formattedOTP.length === 6) {
      onVerify(formattedOTP);
    } else {
      Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP.");
    }
  };

  const handleOTPChange = (text, index) => {
    console.log(text.length, " ltext length");
    if (text.length <= 1) {
      const updatedOTP = [...otp];
      updatedOTP[index] = text;
      setOTP(updatedOTP);
      // if (text === "" && index > 0) {
      // If the current input is empty and it's not the first input, move to the previous input
      // inputRefs.current[index - 1].focus();
      // }

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
    if (e.nativeEvent.key === "Backspace" && otp[index] !== "") {
      console.log("insert as it is");
      inputRefs.current[index].focus();
    }
  };
  const handleLogin = () => {
    console.log("hello login");
  };
  handleResendOtp = async () => {
    try {
      const response = await sendOTP({
        mobile_number: route.params.mobile_number,
      });

      if (response.response.status === "success") {
        // navigation.navigate("otpverify", {
        //   mobile_number: text,
        // });
        Toast.show({
          type: "success",
          text1: "OTP sent successfully",
          position: "bottom",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Some error occured, please try again",
          position: "bottom",
        });
      }
    } catch (e) {
      console.log(e);
      Toast.show({
        type: "error",
        text1: "Some error occured, please try again",
        position: "bottom",
      });
    }
  };

  const handleVerifys = async () => {
    try {
      setLoading(true);
      const response = await verifyOTP({
        mobile_number: route.params.mobile_number,
        otp: otp?.join(""),
      });
      if (response.tokens) {
        dispatch(setUser(response));
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
  };

  return (
    <View style={styles.mainContainer}>
      {/* <TouchableOpacity style={styles.backButton}>
        <Text>Back</Text>
      </TouchableOpacity> */}
      <BackButton />
      <Text style={styles.title}>Enter OTP</Text>

      <Text style={styles.subtext}>
        Type the verification code we’ve sent you.
      </Text>
      <View style={styles.container}>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={[
                styles.input,
                { backgroundColor: digit !== "" ? "#9999991A" : "#fff" },
              ]}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={(text) => handleOTPChange(text, index)}
              value={digit}
              ref={(input) => (inputRefs.current[index] = input)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
        </View>
        <View style={styles.resendContainer}>
          <Text style={styles.resendMainText}>Didn't receive the code? </Text>
          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendOtp}
          >
            <Text style={styles.resendText}>Resend</Text>
          </TouchableOpacity>
        </View>
        <LinearGradient
          colors={["#4c669f", "#3b5998", "#192f6a"]}
          style={styles.buttonContainer}
        ></LinearGradient>
      </View>
      <Button
        isDisabled={otpLength !== 6 ? true : false}
        isLoading={loading}
        color={"#0064AD"}
        disabledColor="#D7DDE0"
        label="Verify"
        onPress={handleVerifys}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "blue",
    alignItems: "center",
    paddingTop: 48,
  },
  mainContainer: {
    flex: 1,
    paddingTop: 44,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",

    // backgroundColor: "blue",
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
    margin: 4,
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
    marginBottom: 0,
  },
  phoneHeader: {
    marginLeft: 7,
    fontSize: 14,
    color: "#333",
    fontWeight: "400",
  },
  input: {
    width: 45,
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    textAlign: "center",
    fontSize: 20,
    // marginTop: 200,
  },
  resendContainer: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "flex-start",
    paddingLeft: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  resendMainText: {
    alignItems: "center",
    justifyContent: "center",
    color: "#A2A2A2",
  },
  resendButton: {
    // backgroundColor: "blue",
    padding: 3,
  },
  resendText: {
    // backgroundColor: "black",
    // marginTop: 10,
    color: "#666",
    textDecorationLine: "underline",
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

export default OTPVerification;
