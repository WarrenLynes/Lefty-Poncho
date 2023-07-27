import {Avatar, HStack, Pressable, Text} from "native-base";

export default function Item({id, displayText, selected, onSelect, ...restItem}) {
  console.log(id, displayText, restItem);
  return (
    <Pressable
      onPress={() => onSelect(id)}
      rounded="8"
      overflow="hidden"
      borderWidth="1"
      borderColor="coolGray.300"
      maxW="96"
      shadow="3"
      bg="coolGray.100"
      p="5"
      style={
        selected && {
          border: 'none',
          background: '#e8e8e8',
          boxShadow: 'none',
        }
      }
    >
      <HStack space={[2, 3]} justifyContent="space-between">
        <Avatar size="48px" source={{
          uri: restItem['img_url']
        }} />
        <Text> {displayText} </Text>
      </HStack>
    </Pressable>
  )
}