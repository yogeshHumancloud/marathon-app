import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { Provider } from "react-redux";
import { persistor, store } from "./src/reduxToolkit/store";
import Toast from "react-native-toast-message";
import AppNavigator from "./src/navigation/AppNavigator";
import { PersistGate } from "redux-persist/integration/react";
import { MenuProvider } from "react-native-popup-menu";

export default function App() {
  const [fontsLoaded, fontError] = Font.useFonts({
    Montserrat: require("./src/assets/fonts/Montserrat-VariableFont_wght.ttf"),
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
        <MenuProvider>
          <View style={styles.container} onLayout={onLayoutRootView}>
            <AppNavigator />
            <Toast />
          </View>
        </MenuProvider>
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
