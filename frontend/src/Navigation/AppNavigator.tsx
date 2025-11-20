import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../Screens/Home/HomeScreen";
import LoginScreen from "../Screens/Login/LoginScreen";
import RegisterScreen from "../Screens/Register/RegisterScreen";
import { RootStackParamList } from "./types";

const WebStack = createStackNavigator<RootStackParamList>();

const NativeStack =
  Platform.OS === "web"
    ? null
    : // eslint-disable-next-line @typescript-eslint/no-var-requires
      require("@react-navigation/native-stack").createNativeStackNavigator<
        RootStackParamList
      >();

export default function AppNavigator() {
  if (Platform.OS === "web") {
    return (
      <WebStack.Navigator
        initialRouteName="Register"
        screenOptions={{ headerShown: false }}
      >
        <WebStack.Screen name="Home" component={HomeScreen} />
        <WebStack.Screen name="Login" component={LoginScreen} />
        <WebStack.Screen name="Register" component={RegisterScreen} />
      </WebStack.Navigator>
    );
  }

  if (!NativeStack) return null;

  return (
    <NativeStack.Navigator
      initialRouteName="Register"
      screenOptions={{ headerShown: false }}
    >
      <NativeStack.Screen name="Home" component={HomeScreen} />
      <NativeStack.Screen name="Login" component={LoginScreen} />
      <NativeStack.Screen name="Register" component={RegisterScreen} />
    </NativeStack.Navigator>
  );
}
