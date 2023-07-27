import {Pressable, Text, View} from "react-native";
import {useSelector} from "react-redux";
import GameSetup from "./GameSetup";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";

const GameStack = createNativeStackNavigator();

export default function GameScreen() {
  const game = useSelector((state) => state.game);

  return (
    <View w='100%' h="100%">
      <Text>GAME</Text>
    </View>
  )
}