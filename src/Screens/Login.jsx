import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ImageBackground } from "react-native";
import Button from "../components/common/Button";
import { ImagesSource } from "../assets/images/images";
import { StyleSheet } from "react-native";

const Login = () => {
  const handleLogin = () => {
    console.log("hello login");
  };
  return (
    <ImageBackground
      source={ImagesSource.mainScreen.backgroundImage}
      style={{ height: "100%", width: "100%" }}
    >
      <View style={styles.button}>
        <Button color={"#0064AD"} label="Login" onPress={handleLogin} />
        {/* <TouchableOpacity onPress={handleLogin}>
          <Text>Login</Text>
        </TouchableOpacity> */}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    width: "100%",
    position: "absolute",
    bottom: 20,
    paddingHorizontal: 20,
    borderRadius: 40,
  },
});

export default Login;
