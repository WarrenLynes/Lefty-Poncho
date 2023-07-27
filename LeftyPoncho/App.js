import { StatusBar } from 'expo-status-bar';
import {Provider, useSelector} from 'react-redux';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import {Box, Center, NativeBaseProvider, useColorMode, View} from "native-base";
import { store } from './state/index.js';

import LoginScreen from "./screens/Login";
import GameScreen from "./screens/Game";
import {theme} from "./utils/theme";

const Stack = createNativeStackNavigator();

export default function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

function App() {
  const auth = useSelector((state) => state.auth);
  const {
    colorMode,
    toggleColorMode
  } = useColorMode();
  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerStyle: {
            backgroundColor: '#111111',
            color: '#0cb7f0',
            borderBottomColor: '#0cb7f0'
          },
          headerTitleStyle: {
            color: '#0cb7f0',
          },
        }}>
          {
            auth && auth.token
              ? (
                <Stack.Screen
                  name="Game"
                  component={GameScreen}
                  options={{title: 'Game'}}
                />
              ) : (
                <Stack.Screen
                  name="SignIn"
                  component={LoginScreen}
                  options={{title: 'Login'}}
                />
              )
          }
        </Stack.Navigator>
      </NavigationContainer>

    </NativeBaseProvider>
  );
}
