import {Pressable, Text, View} from "react-native";
import {useSelector} from "react-redux";
import GameSetup from "../components/GameSetup";

export default function GameScreen() {
  const game = useSelector((state) => state.game);

  return game && game.id ? (
    <View w='100%' h="100%" bg="#111111">
      <Text>GAME</Text>
    </View>
  ): (
    <GameSetup />
  );
}