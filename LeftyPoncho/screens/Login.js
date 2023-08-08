import {StyleSheet} from "react-native";
import {primaryTextColor} from "../utils/styles";
import {useEffect, useState} from "react";
import {handleSignIn, handleUserAuthenticated} from "../state/auth/actions";
import {useDispatch} from "react-redux";
import {signIn} from "../utils/api";
import {Button, Center, FormControl, Input, Stack, View} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function LoginScreen({navigator}) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('warrenlynes@gmail.com');
  const [password, setPassword] = useState('123456789');
  // const { setUserToken } = route.params;

  function handleSubmit() {
    dispatch(handleSignIn(email, password));
  }

  /*useEffect(() => {
    AsyncStorage.getItem('AUTH')
      .then((value) => {
        if (value !== null) {
          const data = JSON.parse(value);
          axios({
            url: 'http://localhost:3333/user',
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + data.token
            }
          }).then(({data}) => {
            console.log(data);
            dispatch(handleUserAuthenticated(data));
            navigator.navigate('Game');
          }).catch((err) => {
            console.log(err);
          })
        }
      });
  }, [])*/

  return (
    <Center
      justifyContent={'flex-start'}
      w='100%' h="100%"
    >
      <Stack
        safeArea
        alignSelf={"center"}
        justifyContent={'flex-start'}
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
              size="2xl"
              required
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
              size="2xl"
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
    </Center>
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