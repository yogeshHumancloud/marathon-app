import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import OTPTextInput from "react-native-otp-textinput";
const OTPInput = ({ setOTP }) => {
  let otpInput = useRef("");

  const handleChange = (otp) => {
    setOTP(otp);
  };

  return (
    <OTPTextInput
      autoFocus
      keyboardType="number-pad"
      inputCount={6}
      defaultValue=""
      containerStyle={styles.textInputContainer}
      textInputStyle={styles.roundedTextInput}
      handleTextChange={handleChange}
      tintColor={"#0064AD"}
      ref={(e) => (otpInput = e)}
    />
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },

  textInputContainer: {
    marginBottom: 10,
    marginLeft: -1,
  },
  roundedTextInput: {
    borderRadius: 5,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#999999",
  },
});

export default OTPInput;
