import {Pressable, Text, TextInput, View, StyleSheet} from "react-native";
import {useState} from "react";

export default function SetBetForm({submit}) {
  const [amount, setAmount] = useState();
  const [type, setType] = useState()

  function handleSubmit() {
    submit({amount, type});
  }

  return (
    <View style={styles.container}>
      <Text>Bet Amount</Text>
      <TextInput
        style={styles.input}
        value={amount}
        placeholder="Bet Amount"
        onChangeText={setAmount}
      />

      <View style={styles.btnRow}>
        <Pressable
          style={styles.btn}
          onPress={() => setType('stroke')}
        >
          <Text style={styles.btnTxt}>Stroke</Text>
        </Pressable>

        <Pressable
          style={styles.btn}
          onPress={() => setType('hole')}
        >
          <Text style={styles.btnTxt}>Hole</Text>
        </Pressable>
      </View>


      <Pressable
        style={styles.btn}
        onPress={handleSubmit}
      >
        <Text style={styles.btnTxt}>Next</Text>
      </Pressable>
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