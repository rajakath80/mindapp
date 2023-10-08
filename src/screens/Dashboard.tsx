import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';

import auth from '@react-native-firebase/auth';

import {GOALAPI} from '@env';

const Dashboard = ({navigation}: {navigation: any}): JSX.Element => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [changes, setChanges] = useState(false);

  const [goals, setGoals] = useState<jsonGoal[]>();

  console.log('GOALAPI: ', GOALAPI);

  interface jsonGoal {
    id: string;
    name: string;
    noofdays: number;
    startdate: string;
    streak: number;
    progress: number;
  }

  function formatGoalsFromJSON(jsonGoalsData: jsonGoal[]) {
    console.log('here formatGoals', jsonGoalsData);

    const goalsData: jsonGoal[] = [];
    const today = new Date();
    const timeDivide = 1000 * 3600 * 24;

    jsonGoalsData.map(goal => {
      const id = goal.id;
      const name = goal.name;
      const noOfDays = goal.noofdays;
      const startDate = new Date(goal.startdate);
      const streak = Math.ceil(
        (today.getTime() - startDate.getTime()) / timeDivide,
      );
      const progress = Math.ceil((streak / noOfDays) * 100);
      const date = startDate.toLocaleDateString('en-GB');
      goalsData.push({
        id: id,
        name: name,
        noofdays: noOfDays,
        startdate: date,
        streak: streak,
        progress: progress,
      });
    });
    console.log(goalsData);
    setGoals(goalsData);
  }

  const fetchGoals = () => {
    setLoading(true);
    const userId = auth().currentUser?.uid;

    console.log('Fetching goals for user >>> : ', userId, GOALAPI);

    fetch(GOALAPI, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        userId: userId,
      },
    })
      .then(response => {
        const json = response.json();
        console.log('goals json: ', json);
        return json;
      })
      .then(json => {
        console.log(JSON.stringify(json));
        formatGoalsFromJSON(json);
      })
      .catch(error => console.error(error))
      .finally(() => {
        setLoading(false);
        console.log('here in finally');
      });
  };

  useEffect(() => {
    console.log('Fetching goals..');
    setChanges(false);
    fetchGoals();
  }, [changes]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('RE Fetching goals.. RELOAD');
      setChanges(false);
      fetchGoals();
    });
    return unsubscribe;
  }, [navigation]);

  const deleteGoal = id => {
    setLoading(true);
    const userId = auth().currentUser?.uid;

    console.log('DELETE GOAL: ', GOALAPI, userId, id);

    fetch(GOALAPI + '/' + id, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        console.log(JSON.stringify(json));
      })
      .catch(error => console.error(error))
      .finally(() => {
        setLoading(false);
        console.log('here in finally');
      });

    //navigation.navigate('Goals');
  };

  const editGoal = id => {
    setLoading(true);
    const userId = auth().currentUser?.uid;

    console.log('EDIT GOAL: ', GOALAPI + '/' + id, userId, id);

    console.log('TO DO -- write code for edit goal');

    //navigation.navigate('Goals');
  };

  return (
    <ScrollView>
      <Text>Welcome, {email}</Text>

      <FlatList
        data={goals}
        renderItem={({item}) => {
          return (
            <View>
              <View className="flex flex-row justify-between p-2">
                <Text className="text-lg"> {item.name}</Text>
                <TouchableOpacity
                  id={item.id}
                  onPress={() => editGoal(item.id)}>
                  <Image
                    className="w-5 h-5"
                    source={require('../../assets/images/edit.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  id={item.id}
                  onPress={() => deleteGoal(item.id)}>
                  <Image
                    className="w-5 h-5"
                    source={require('../../assets/images/delete.png')}
                  />
                </TouchableOpacity>
              </View>

              <View className="flex flex-row items-center justify-around overflow-y-scroll text-gray-500 cursor-pointer space-x-1">
                <View className="flex flex-col items-center justify-center w-20 h-20 bg-green-200 rounded-2xl text-green-600 mb-2">
                  <Text className="text-2xl font-bold mt-2">
                    {' '}
                    {item.streak}
                  </Text>
                  <Text className="text-m mt-1"> Streak </Text>
                </View>
                <View className="flex flex-col items-center justify-center w-20 h-20 bg-indigo-200 rounded-2xl text-indigo-600 mb-2">
                  <Text className="text-2xl font-bold mt-2">
                    {' '}
                    {item.progress} %{' '}
                  </Text>
                  <Text className="text-m mt-1"> Progress </Text>
                </View>
                <View className="flex flex-col items-center justify-center w-20 h-20 bg-pink-200 rounded-2xl text-pink-600 mb-2">
                  <Text className="text-2xl font-bold mt-2">
                    {' '}
                    {item.noofdays}{' '}
                  </Text>
                  <Text className="text-m mt-1"> Goal </Text>
                </View>
              </View>

              <Text style={{fontSize: 16, fontWeight: '200', marginTop: 20}}>
                {' '}
                {item.startdate}
              </Text>
              <Text style={{fontSize: 16, color: 'coral'}}> Start date </Text>
            </View>
          );
        }}
      />

      <TouchableOpacity
        style={{marginTop: 20}}
        onPress={() => {
          setChanges(true);
          navigation.navigate('Goal');
        }}>
        <Text style={styles.buttonLogin}>Create a new goal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonLogin: {
    height: 30,
    backgroundColor: 'coral',
    width: Dimensions.get('window').width - 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    fontSize: 18,
  },
  buttonLoginLabel: {
    fontWeight: 'bold',
    color: '#fafafa',
    fontSize: 18,
    textTransform: 'uppercase',
  },
});

export default Dashboard;
