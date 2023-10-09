import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../components/common/Button";
import { TouchableOpacity } from "react-native";
import { sendOTP, verifyOTP } from "../api";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { setUser } from "../reduxToolkit/user/userSlice";
import OTPInput from "../components/common/OTPInput";

const OTPVerification = ({ onVerify, navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [text, setText] = React.useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("OTP lenght", text.length);
  }, [text]);

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
        otp: text,
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
      <TouchableOpacity
        onPress={() => {
          console.log("back");
        }}
        style={styles.backButton}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Enter OTP</Text>

      <Text style={styles.subtext}>
        Type the verification code we’ve sent you.
      </Text>
      <View style={styles.container}>
        <OTPInput setOTP={setText} />

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
        isDisabled={text.length !== 6}
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
  },
  backButton: {
    paddingHorizontal: 5,
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
  resendContainer: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "flex-start",
    paddingLeft: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
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
