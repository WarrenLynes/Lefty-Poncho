import {StyleSheet} from "react-native";
import {primaryTextColor} from "../utils/styles";
import {useState} from "react";
import {handleSignIn, handleUserAuthenticated} from "../state/auth/actions";
import {useDispatch} from "react-redux";
import {signIn} from "../utils/api";
import {Button, FormControl, Input, Stack, View} from "native-base";

export default function LoginScreen({navigation}) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('warrenlynes@gmail.com');
  const [password, setPassword] = useState('123456789');
  // const { setUserToken } = route.params;

  function handleSubmit() {
    dispatch(handleSignIn(email, password));
  }

  return (
    <View w='100%' h="100%" bg="#111111">
      <Stack
        safeArea
        alignSelft={"center"}
        space={2.5}
        px="4"
        mt="4"
        w={{
          base: "100%",
          md: "25%"
        }}
      >
        <FormControl mb="5" isRequired>
          <Stack mx="4">
            <FormControl.Label>Email</FormControl.Label>
            <Input
              value={email}
              placeholder="Email"
              onChangeText={setEmail}
            />
            <FormControl.HelperText>
              Enter your email
            </FormControl.HelperText>
          </Stack>
        </FormControl>

        <FormControl mb="10" isRequired>
          <Stack mx="4">
            <FormControl.Label>Password</FormControl.Label>
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry={true}
            />
            <FormControl.HelperText>
              Must be at least .. its your password do whatever you want.
            </FormControl.HelperText>
          </Stack>
        </FormControl>
        <Button
          onPress={handleSubmit}
        >
          Sign In
        </Button>
      </Stack>
    </View>
  )
}

/*
* */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
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