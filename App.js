import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ImageBackground } from "react-native";

import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ImagesSource } from "./src/assets/images/images";
import { useCallback } from "react";
import Button from "./src/components/common/Button";
import { Provider } from "react-redux";
import { store } from "./src/reduxToolkit/store";
import Login from "./src/Screens/Login";
import DashboardNavigator from "./src/navigation/DashboardNavigator";

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
      <View style={styles.container} onLayout={onLayoutRootView}>
        {/* <Login /> */}
        <DashboardNavigator />
        <StatusBar style="auto" backgroundColor="#fff" />
      </View>
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
