import React, {useEffect, useState} from 'react';
import {Text, View, VStack} from "native-base";
import {useSelector} from "react-redux";

export default function GameReviewScreen({navigation}) {

  const game = useSelector((state) => state.game);
  const [winningTeam, setWinningTeam] = useState(null);
  const [losingTeam, setLosingTeam] = useState(null);

  useEffect(() => {
    if(game && game.id) {
      const winner = game.teams.left.victory ? game.teams.left : game.teams.right
      setWinningTeam(winner)
      setLosingTeam(winner.team === 'left' ? game.teams.right : game.teams.left);
    }
  }, [game]);


  return game && winningTeam && losingTeam
    ? (
      <View w='100%' h='100%'>
        <VStack
          mx='10px'
        >
          <Text>{winningTeam.team} Wins!</Text>
          <Text>Winnings: </Text>
          <Text color='green.900'>${(losingTeam.score - winningTeam.score) * game.bet.amount}</Text>

          <Text>{losingTeam.team} loses :(</Text>
          <Text>losses: </Text>
          <Text color='red.900'>${(losingTeam.score - winningTeam.score) * game.bet.amount}</Text>

        </VStack>
      </View>
    )
    : <Text>Loading</Text>
}