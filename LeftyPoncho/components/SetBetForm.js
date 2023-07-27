import {StyleSheet} from "react-native";
import {useState} from "react";
import {Button, Center, FormControl, HStack, Icon, Input, Pressable, Stack, Text, View, VStack} from "native-base";

export default function SetBetForm({onSubmit}) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState()

  function handleSubmit(e) {
    e.preventDefault();
    console.log({amount, type});
    onSubmit({amount, type});
  }

  return (
    <View style={styles.container}>
      <FormControl mb="5" isRequired>
        <Center>
          <FormControl.Label>Bet Amount</FormControl.Label>
          <Input
            type='number'
            w={{
              base: "25%",
              md: "25%"
            }}
            size="2xl"
            InputLeftElement={
              <Text ml="2" color="muted.400">$</Text>
            }
            value={amount}
            placeholder="0"
            onChangeText={setAmount}
          />
          <FormControl.HelperText>
            Enter Bet Amount
          </FormControl.HelperText>
        </Center>
      </FormControl>

      <FormControl mb="5" isRequired>
        <FormControl.Label>
          Bet Type
        </FormControl.Label>
        <HStack
          justifyContent="space-around"
        >
          <Button
            w="50%"
            flexGrow={1}
            style={
              type === 'per_stroke' && {
                backgroundColor: '#055669'
              }
            }
            onPress={() => setType('per_stroke')}
          >
            Per Stroke
          </Button>

          <Button
            w="50%"
            flexGrow={1}
            style={
              type === 'per_hole' && {
                backgroundColor: '#055669'
              }
            }
            onPress={() => setType('per_hole')}
          >
            Per Hole
          </Button>
        </HStack>
      </FormControl>

      <Center>
        <Button
          style={styles.btn}
          onPress={handleSubmit}
        > Next </Button>
      </Center>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    flexDirection: 'column'
  },
  btn: {

  },
  btnTxt: {

  },
  btnRow: {

  }
})