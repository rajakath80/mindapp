import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import auth from '@react-native-firebase/auth';

import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import {DAYAPI} from '@env';

const Day = (): JSX.Element => {

  const [userId, setUserId] = useState<String | undefined>('');
  const [loading, setLoading] = useState(false);

  const [exercise, setExercise] = useState(0);
  const [project, setProject] = useState(0);
  const [boredom, setBoredom] = useState(0);
  const [cravings, setCravings] = useState(0);
  const [relapse, setRelapse] = useState(0);

  const [dayDataFound, setDayDataFound] = useState(false);

  const [items, setItems] = useState([
    {label: 'Poor', value: '1'},
    {label: 'Ok', value: '2'},
    {label: 'Good', value: '3'},
    {label: 'Very good', value: '4'},
  ]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [show, setShow] = useState(true);

  const loadDayDataFromJSON = (jsonDayData: any) => {
    console.log('here loadDayDataFromJSON', jsonDayData);
    if(jsonDayData) {
        setExercise(jsonDayData.exercise);
        setProject(jsonDayData.project);
        setBoredom(jsonDayData.boredom);
        setCravings(jsonDayData.cravings);
        setRelapse(jsonDayData.relapse);
    }
  }

  const cleanUpVariables = () => {
    setExercise(0);
    setProject(0);
    setBoredom(0);
    setCravings(0);
    setRelapse(0);
  }

  const fetchDay = () => {
    console.log('fetching true..');
    cleanUpVariables();
    
    setLoading(true);
    console.log('selected date: ', selectedDate);
    
    console.log(userId, selectedDate.toISOString().split('T')[0], exercise, project, boredom, cravings, relapse);
    
    fetch(DAYAPI+'/'+userId, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            date: selectedDate.toISOString().split('T')[0],
        },
        })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            console.log('json', json);
            
            loadDayDataFromJSON(json[0]);
        })
        .catch((error) => console.error(error))
        .finally(() => {
            setLoading(false);
            console.log('here in finally');
        });
  }

  useEffect(() => {
    console.log('Fetching day ..');
    
    setUserId(auth().currentUser?.uid);

    fetchDay();
  }, [selectedDate]);

  const onChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const currentDate = selectedDate;
    setShow(false);
    if(currentDate) {
        setSelectedDate(currentDate);
        fetchDay();
    }
  };

  const handleSave = () => {
    setLoading(true);
    const userId = auth().currentUser?.uid;

    console.log(userId, selectedDate.toISOString().split('T')[0], exercise, project, boredom, cravings, relapse);
    
    fetch(DAYAPI, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId: userId,
            date: selectedDate.toISOString().split('T')[0],
            exercise: exercise,
            project: project,
            boredom: boredom,
            cravings: cravings,
            relapse: relapse,
        }),
        })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            console.log(JSON.stringify(json));
        })
        .catch((error) => console.error(error))
        .finally(() => {
            setLoading(false);
            console.log('here in finally');
        });
  }

  return (
    <View>       
        <Text>How was your day?</Text>
        
        <DateTimePicker 
            style={{marginTop: 1, alignContent:'flex-start'}}
            testID="dateTimePicker"
            value={selectedDate}
            is24Hour={true}
            onChange={onChange}
        />

        <View className='flex mt-6'>
        <View className='flex flex-row items-center justify-around'>
            <Text className='text-xl font-bold mt-4'>Exercise</Text>
            <View className='flex flex-col items-center justify-around'>
                <TouchableOpacity onPress={() => setExercise(1)}>
                    <Image className={`h-10 w-10 ${exercise === 1 ? 'bg-green-500' : ''}`} source={require('../../assets/images/happy.png')}/>
                </TouchableOpacity>
                <Text>Good</Text>
            </View>

            <View className='flex flex-col items-center justify-around'>
            <TouchableOpacity onPress={() => setExercise(2)}>
                    <Image className={`h-10 w-10 ${exercise === 2 ? 'bg-green-500' : ''}`} source={require('../../assets/images/confused.png')}/>
                </TouchableOpacity>
                <Text>Ok</Text>
            </View>

            <View className='flex flex-col items-center justify-around'>
            <TouchableOpacity onPress={() => setExercise(3)}>
                    <Image className={`h-10 w-10 ${exercise === 3 ? 'bg-green-500' : ''}`} source={require('../../assets/images/angry.png')}/>
                </TouchableOpacity>
                <Text>Bad</Text>
            </View>
        </View>
        </View>

        <View>
        <View className='flex flex-row items-center justify-around'>
            <Text className='text-xl font-bold mt-4'>Project</Text>
            <View className='flex flex-col items-center justify-around'>
                <TouchableOpacity onPress={() => setProject(1)}>
                    <Image className={`h-10 w-10 ${project === 1 ? 'bg-green-500' : ''}`} source={require('../../assets/images/happy.png')}/>
                </TouchableOpacity>
                <Text>Good</Text>
            </View>

            <View className='flex flex-col items-center justify-around'>
            <TouchableOpacity onPress={() => setProject(2)}>
                    <Image className={`h-10 w-10 ${project === 2 ? 'bg-green-500' : ''}`} source={require('../../assets/images/confused.png')}/>
                </TouchableOpacity>
                <Text>Ok</Text>
            </View>

            <View className='flex flex-col items-center justify-around'>
            <TouchableOpacity onPress={() => setProject(3)}>
                    <Image className={`h-10 w-10 ${project === 3 ? 'bg-green-500' : ''}`} source={require('../../assets/images/angry.png')}/>
                </TouchableOpacity>
                <Text>Bad</Text>
            </View>
        </View>
        </View>

        <View>
        <View className='flex flex-row items-center justify-around'>
            <Text className='text-xl font-bold mt-4'>Boredom</Text>
            <View className='flex flex-col items-center justify-around'>
                <TouchableOpacity onPress={() => setBoredom(1)}>
                    <Image className={`h-10 w-10 ${boredom === 1 ? 'bg-green-500' : ''}`} source={require('../../assets/images/happy.png')}/>
                </TouchableOpacity>
                <Text>Good</Text>
            </View>

            <View className='flex flex-col items-center justify-around'>
            <TouchableOpacity onPress={() => setBoredom(2)}>
                    <Image className={`h-10 w-10 ${boredom === 2 ? 'bg-green-500' : ''}`} source={require('../../assets/images/confused.png')}/>
                </TouchableOpacity>
                <Text>Ok</Text>
            </View>

            <View className='flex flex-col items-center justify-around'>
            <TouchableOpacity onPress={() => setBoredom(3)}>
                    <Image className={`h-10 w-10 ${boredom === 3 ? 'bg-green-500' : ''}`} source={require('../../assets/images/angry.png')}/>
                </TouchableOpacity>
                <Text>Bad</Text>
            </View>
        </View>
        </View>

        <View>
        <View className='flex flex-row items-center justify-around'>
            <Text className='text-xl font-bold mt-4'>Cravings</Text>
            <View className='flex flex-col items-center justify-around'>
                <TouchableOpacity onPress={() => setCravings(1)}>
                    <Image className={`h-10 w-10 ${cravings === 1 ? 'bg-green-500' : ''}`} source={require('../../assets/images/happy.png')}/>
                </TouchableOpacity>
                <Text>Good</Text>
            </View>

            <View className='flex flex-col items-center justify-around'>
            <TouchableOpacity onPress={() => setCravings(2)}>
                    <Image className={`h-10 w-10 ${cravings === 2 ? 'bg-green-500' : ''}`} source={require('../../assets/images/confused.png')}/>
                </TouchableOpacity>
                <Text>Ok</Text>
            </View>

            <View className='flex flex-col items-center justify-around'>
            <TouchableOpacity onPress={() => setCravings(3)}>
                    <Image className={`h-10 w-10 ${cravings === 3 ? 'bg-green-500' : ''}`} source={require('../../assets/images/angry.png')}/>
                </TouchableOpacity>
                <Text>Bad</Text>
            </View>
        </View>
        </View>

        <View>
        <View className='flex flex-row items-center justify-around'>
            <Text className='text-xl font-bold mt-4'>Relapse</Text>
            <View className='flex flex-col items-center justify-around'>
                <TouchableOpacity onPress={() => setRelapse(1)}>
                    <Image className={`h-10 w-10 ${relapse === 1 ? 'bg-green-500' : ''}`} source={require('../../assets/images/happy.png')}/>
                </TouchableOpacity>
                <Text>Good</Text>
            </View>

            <View className='flex flex-col items-center justify-around'>
            <TouchableOpacity onPress={() => setRelapse(2)}>
                    <Image className={`h-10 w-10 ${relapse === 2 ? 'bg-green-500' : ''}`} source={require('../../assets/images/confused.png')}/>
                </TouchableOpacity>
                <Text>Ok</Text>
            </View>

            <View className='flex flex-col items-center justify-around'>
            <TouchableOpacity onPress={() => setRelapse(3)}>
                    <Image className={`h-10 w-10 ${relapse === 3 ? 'bg-green-500' : ''}`} source={require('../../assets/images/angry.png')}/>
                </TouchableOpacity>
                <Text>Bad</Text>
            </View>
        </View>
        </View>

        <TouchableOpacity style={{marginTop: 20}} onPress={() => handleSave()}>
            <Text style={styles.buttonLogin}>Save</Text>
        </TouchableOpacity>
        
    </View>
  );
}

const styles = StyleSheet.create({
    buttonLogin: {
        height: 40,
        backgroundColor: 'coral',
        width: Dimensions.get('window').width - 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        fontWeight: 'bold',
        fontSize: 18
      },
      buttonLoginLabel: {
        fontWeight: 'bold',
        color: '#fafafa',
        fontSize: 18,
        textTransform: 'uppercase'
      },
});

export default Day;
