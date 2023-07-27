import {View, Text, Button, Pressable, StyleSheet} from "react-native";
import {primaryTextColor} from "../utils/styles";

export default function SignupScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() =>
          navigation.navigate('Login', {someRouteProp: 'someRouteValue'})
        }
      >
        <Text style={styles.buttonText}>
          login
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'none'
  },
  buttonText: {
    color: primaryTextColor
  }
});