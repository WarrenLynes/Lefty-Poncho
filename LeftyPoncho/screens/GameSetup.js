import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  SafeAreaView, StatusBar,
  StyleSheet
} from "react-native";
import {handleFetchOptions} from "../state/GameOptions/actions";
import SetBetForm from "../components/SetBetForm";
import {Avatar, Button, Center, HStack, Input, Pressable, ScrollView, Text, View, VStack} from "native-base";
import Item from "../components/Item";
import ReviewGameSetup from "../components/ReviewGameSetup";
import axios from "axios";
import {createGame} from "../utils/api";
import {handleFetchActiveGame, handleNewGame} from "../state/Game/actions";

export default function GameSetupScreen({navigation}) {
  const dispatch = useDispatch();
  const {playerOptions, courseOptions} = useSelector(({gameOptions}) => gameOptions)
  const {token} = useSelector(({auth}) => auth)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)
  const [course, setCourse] = useState(null);
  const [players, setPlayers] = useState([]);
  const [bet, setBet] = useState({
    amount: null,
    type: null
  });

  function submit() {
    setLoading(true);
    const gameInfo = {
      course_id: course,
      bet_type_id: 1,
      bet_amount: bet.amount,
      bet_rate: bet.type,
      players
    };

    dispatch(handleNewGame(gameInfo, () => {
      dispatch(handleFetchActiveGame());
      navigation.navigate('Game');
    }));

  }

  function handleStep0(courseId) {
    // setCourse(courseId);
    setStep(1);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 50)
  }

  function handleStep1(players) {
    // setPlayers(players);
    setStep(2);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 50)
  }

  function handleStep2(bet) {
    setBet(bet);
    setStep(3);
  }

  function handleSelectPlayers(id) {
    const indx = players.indexOf(id);
    if(indx > -1) {
      setPlayers(
        players.filter(x => x !== id)
      )
    } else if(players.length === 3) {
      console.log('already picked 3 players');
    } else {
      setPlayers([
        ...players,
        id
      ])
    }
  }

  useEffect(() => {
    dispatch(handleFetchOptions());
  }, [dispatch]);

  function renderStep() {
    if(!courseOptions || !playerOptions || loading) {
      return (<Text>loading</Text>)
    }
    else if(step === 0) {
      return (
        <Select
          handleNext={handleStep0}
          items={courseOptions}
          titleKey="name"
          selected={course}
          onSelect={(id) => setCourse(id)}
        />
      )
    }
    else if(step === 1) {
      return (
        <Select
          handleNext={handleStep1}
          items={playerOptions}
          titleKey="username"
          selected={players}
          onSelect={handleSelectPlayers}
        />
      )
    }
    else if(step === 2) {
      return (
        <SetBetForm
          onSubmit={handleStep2}
        />
      )
    }
    else if(step === 3) {
      return (
        <ReviewGameSetup
          onConfirm={submit}
          game={{
            course,
            players,
            bet
          }}
        />
      )
    }
  }

  return (
    <View w='100%' h="100%" pt="10px">
      {renderStep()}
    </View>
  )
}

function Select({handleNext, titleKey, items, selected, onSelect, ...options}) {
  const [search, setSearch] = useState('');
  function handleSearch(q) {
    setSearch(q);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Input
        size='xl'
        variant='underlined'
        placeholder='Search'
        clearButtonMode='always'
        autoCapitalize='none'
        autoCorrect={false}
        value={search}
        onChangeText={handleSearch}
      />

      <ScrollView>
        <VStack
          pt='10px'
          space={4}
          alignItems='stretch'
          justifyContent='center'
        >
          {items.map((item) => (
            <Item
              key={item.id}
              {...item}
              displayText={item[titleKey]}
              selected={
                Array.isArray(selected)
                  ? selected.indexOf(item.id) > -1
                  : item.id === selected
              }
              onSelect={onSelect}
            />
          ))}
        </VStack>
      </ScrollView>

      {
        ((selected && !Array.isArray(selected)) || Array.isArray(selected) && selected.length === 3 ) && (
          <Button
            onPress={() => handleNext(selected)}
          >
            <Text style={styles.nextBtnText}> Next </Text>
          </Button>
        )
      }
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: StatusBar.currentHeight || 0,
  },
  searchInput: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius:8,
  },

  pressableItem: {
    border: '1px solid grey',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },

  nextBtn: {
    textAlign: 'center',
    backgroundColor: 'blue',
    border: '1px solid grey',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  nextBtnText: {
    fontSize: '20'
  }
});