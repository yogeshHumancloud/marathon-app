import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ImageBackground, Text } from "react-native";

import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ImagesSource } from "./src/assets/images/images";
import { useCallback } from "react";
import Button from "./src/components/common/Button";
import { Provider } from "react-redux";
import { persistor, store } from "./src/reduxToolkit/store";
import Login from "./src/Screens/Login";
import OTPVerification from "./src/Screens/OTPVerification";
import PhoneNumber from "./src/Screens/PhoneNumber";
import DashboardNavigator from "./src/navigation/DashboardNavigator";
import Toast from "react-native-toast-message";
import AppNavigator from "./src/navigation/AppNavigator";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

export default function App() {
  const [fontsLoaded, fontError] = Font.useFonts({
    "Montserrat-VariableFont_wght": require("./src/assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });

  SplashScreen.preventAutoHideAsync();

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar style="auto" backgroundColor="#fff" />
        <View style={styles.container} onLayout={onLayoutRootView}>
          {/* <Login /> */}
          {/* <OTPVerification /> */}
          {/* <PhoneNumber /> */}
          {/* <DashboardNavigator /> */}
          <AppNavigator />
          <Toast />
        </View>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
});
