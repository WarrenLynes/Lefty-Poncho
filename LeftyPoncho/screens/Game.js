
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {Box, Button, FormControl, HStack, Input, Text, View, VStack} from "native-base";
import {handleFetchActiveGame, handleFetchGame, handleSubmitScore} from "../state/Game/actions";
import {fetchActiveGame} from "../utils/api";


export default function GameScreen({navigation}) {
  const dispatch = useDispatch();
  const game = useSelector((state) => state.game);
  const app = useSelector((state) => state.app);
  const state = useSelector((state) => state);
  const [teams, setTeams] = useState(null);
  const [scores, setScores] = useState(null);

  useEffect(() => {
    dispatch(handleFetchGame());
  }, []);

  useEffect(() => {
    setScores(null);
    if(game && game.id) {
      setScores(() => ({
        [game.teams.left.players[0].player_id]: null,
        [game.teams.left.players[1].player_id]: null,
        [game.teams.right.players[0].player_id]: null,
        [game.teams.right.players[1].player_id]: null,
      }));
    }

  }, [game]);

  function setScore(player, score) {
    setScores({
      ...scores,
      [player]: score
    })
  }

  async function submitHole() {
    const payload = {
      ...game,
      teams: {
        left: {
          id: game.teams.left.id,
          player_1: scores[game.teams.left.players[0].player_id],
          player_2: scores[game.teams.left.players[1].player_id]
        },
        right: {
          id: game.teams.right.id,
          player_1: scores[game.teams.right.players[0].player_id],
          player_2: scores[game.teams.right.players[1].player_id]
        },
      }
    };
    setScores(null);
    dispatch(handleSubmitScore(payload));
  }

  if(game.status === 'complete') {
    // return <GameReview game={game} />
    navigation.navigate('Game-Review')
  }

  return game && game.id && scores && !app.loading
    ? (
    <View w='100%' h="100%">

      <HStack
        justifyContent='space-between'
      >
        <Text> hole: {game.hole.num} </Text>
        <Text> par: {game.hole.par} </Text>
        <Text> {game.hole.distance} yards </Text>
      </HStack>


      <VStack
        mx="10px"
      >
        <Text>Team 1</Text>
        <FormControl isRequired px='10px'>
          <HStack
            justifyContent="space-between"
          >
            <FormControl.Label>{game.teams.left.players[0].player_username}</FormControl.Label>
            <Input
              width="75"
              type='number'
              size='2xl'
              value={scores[game.teams.left.players[0].player_id]}
              onKeyPress={x => console.log(x)}
              onChangeText={score => setScore(game.teams.left.players[0].player_id, Number(score))}
            />
          </HStack>
        </FormControl>

        <FormControl isRequired px='10px'>
          <HStack
            justifyContent="space-between"
          >
            <FormControl.Label>{game.teams.left.players[1].player_username}</FormControl.Label>
            <Input
              width="75"
              type='number'
              size='2xl'
              value={scores[game.teams.left.players[1].player_id]}
              onChangeText={score => setScore(game.teams.left.players[1].player_id, Number(score))}
            />
          </HStack>
        </FormControl>


        <Text>Team 2</Text>
        <FormControl isRequired px='10px'>
          <HStack
            justifyContent="space-between"
          >
            <FormControl.Label>{game.teams.right.players[0].player_username}</FormControl.Label>
            <Input
              width="75"
              type='number'
              size='2xl'
              value={scores[game.teams.right.players[0].player_id]}
              onChangeText={score => setScore(game.teams.right.players[0].player_id, Number(score))}
            />
          </HStack>
        </FormControl>

        <FormControl isRequired px='10px'>
          <HStack
            justifyContent="space-between"
          >
            <FormControl.Label>{game.teams.right.players[1].player_username}</FormControl.Label>
            <Input
              width="75"
              type='number'
              size='2xl'
              value={scores[game.teams.right.players[1].player_id]}
              onChangeText={score => setScore(game.teams.right.players[1].player_id, Number(score))}
            />
          </HStack>
        </FormControl>
      </VStack>

      <Button
        w="50%"
        margin="0 auto"
        onPress={submitHole}
      >
        Submit Scores
      </Button>
    </View>
  ) : <Text>Loading</Text>
}

