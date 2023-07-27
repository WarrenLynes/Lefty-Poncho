import {useSelector} from "react-redux";
import {Box, Button, HStack, Text, VStack} from "native-base";
import Item from "./Item";

export default function ReviewGameSetup({ game, onConfirm }) {
  const {courseOptions, playerOptions} = useSelector(({gameOptions}) => gameOptions);

  const players = playerOptions.filter((x) =>
    game.players.indexOf(x.id) > -1
  );
  const course = courseOptions.filter((x) =>
    game.course === x.id
  )[0];

  return (
    <Box w="100%" h="100%">
      <VStack spacing={4}>
        <Box mx="10" mb="10">
          <Text size='l'>Course</Text>
          <Item
            id={course.id}
            displayText={course.name}
            selected={false}
            onSelect={(x) => {console.log(x)}}
            {...course}
          />
        </Box>

        <Box mx="10" mb="10">
          <Text size='l'>Players</Text>
          <VStack spacing={2}>
            {players.map((player) => (
              <Item
                id={player.id}
                displayText={player.username}
                selected={false}
                onSelect={(x) => {console.log(x)}}
                {...player}
              />
            ))}
          </VStack>
        </Box>

        <Box mx="10" mb="10">
          <Text size='l'>Bet</Text>
          <HStack>
            <Text size='l'>${game.bet.amount}</Text>
            <Text size='l'>/</Text>
            <Text size='l'>{game.bet.type}</Text>
          </HStack>
        </Box>

        <Button onPress={onConfirm}>
          Start Round
        </Button>
      </VStack>
    </Box>
  );
}
