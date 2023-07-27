import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput
} from "react-native";
import {handleFetchOptions} from "../state/GameOptions/actions";
import SetBetForm from "./SetBetForm";
import {View} from "native-base";

export default function GameSetup() {
  const dispatch = useDispatch();
  const {playerOptions, courseOptions} = useSelector(({gameOptions}) => gameOptions)
  const [step, setStep] = useState(0)
  const [course, setCourse] = useState(null);
  const [players, setPlayers] = useState(null);
  const [bet, setBet] = useState({
    amount: null,
    type: null
  });

  function handleStep0(courseId) {
    setCourse(courseId);
    setStep(1);
  }

  function handleStep1(players) {
    setPlayers(players);
    setStep(2);
  }

  function handleStep2(bet) {
    setBet(bet);
  }

  useEffect(() => {
    dispatch(handleFetchOptions());
  }, [dispatch])

  function renderStep() {
    if(!courseOptions || !playerOptions) {
      return (<Text>loading</Text>)
    } else if(step === 0) {
      return (
        <Select
          handleNext={handleStep0}
          items={courseOptions}
          ItemComponent={CourseItem}
        />
      )
    } else if(step === 1) {
      return (
        <Select
          handleNext={handleStep1}
          items={playerOptions}
          ItemComponent={PlayerItem}
          multi={true}
        />
      )
    } else if(step === 2) {
      return (
        <SetBetForm
          onSubmit={handleStep2}
        />
      )
    }
  }

  return (
    <View w='100%' h="100%" bg="#111111" pt="10px">
      {renderStep()}
    </View>
  )
}

function PlayerItem({id, username, selected, onSelect}) {
  return (
    <Pressable
      style={
        selected
          ? {
            ...styles.pressableItem,
            borderColor: 'green'
          } : styles.pressableItem
      }
      onPress={() => onSelect(id)}
    >
      <Text> {username} </Text>
    </Pressable>
  )
}

function CourseItem({id, name, selected, onSelect}) {
  return (
    <Pressable
      style={
        selected
          ? {
            ...styles.pressableItem,
            borderColor: 'green'
          } : styles.pressableItem
      }
      onPress={() => onSelect(id)}
    >
      <Text> {name} </Text>
    </Pressable>
  )
}

function Select({handleNext, items, ItemComponent}) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  function handleSearch(q) {
    setSearch(q);
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder='Search'
        clearButtonMode='always'
        style={styles.searchInput}
        autoCapitalize='none'
        autoCorrect={false}
        value={search}
        onChangeText={handleSearch}
      />

      <ScrollView>
        <FlatList
          data={items}
          renderItem={({item}) => (
            <ItemComponent
              {...item}
              selected={item.id === selected}
              onSelect={(itemId) => setSelected(itemId)}
            />
          )}
        />
      </ScrollView>

      {
        selected && (
          <Pressable
            style={styles.nextBtn}
            onPress={() => handleNext(selected)}
          >
            <Text style={styles.nextBtnText}> Next </Text>
          </Pressable>
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