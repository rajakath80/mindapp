import React, {useEffect, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';

import auth from '@react-native-firebase/auth';

import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import {GOALAPI} from '@env';

const Goal = ({navigation}: {navigation: any}): JSX.Element => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');

  const [open, setOpen] = useState(false);
  const [noOfDays, setNoOfDays] = useState(null);
  const [items, setItems] = useState([
    {label: '14 days', value: '14'},
    {label: '30 days', value: '30'},
    {label: '90 days', value: '90'},
    {label: '180 days', value: '180'},
    {label: '365 days', value: '365'},
    {label: 'Lifetime', value: '100000000'},
  ]);

  const [startDate, setStartDate] = useState(new Date());
  const [show, setShow] = useState(true);

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
  ) => {
    const currentDate = selectedDate;
    setShow(false);
    if (currentDate) {
      setStartDate(currentDate);
    }
  };

  const handleSave = () => {
    setLoading(true);
    const userId = auth().currentUser?.uid;

    console.log('SAVING GOAL: ', GOALAPI, userId, name, noOfDays, startDate);

    fetch(GOALAPI, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        name: name,
        noOfDays: noOfDays,
        startDate: startDate,
      }),
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

    navigation.navigate('Goals');
  };

  return (
    <View>
      <Text>This is Goal screen</Text>
      <Text>Welcome, {email}</Text>

      <Text>Set your absitence goal</Text>

      <TextInput
        placeholder="Name (optional)"
        maxLength={100}
        value={name}
        onChangeText={val => setName(val)}
      />

      <Text>Number of days</Text>

      <DropDownPicker
        open={open}
        value={noOfDays}
        items={items}
        setOpen={setOpen}
        setValue={setNoOfDays}
        setItems={setItems}
      />

      <Text>Abstinence start date: {startDate.toLocaleString()}</Text>

      <DateTimePicker
        testID="dateTimePicker"
        value={startDate}
        is24Hour={true}
        onChange={onChange}
      />

      <TouchableOpacity onPress={() => handleSave()}>
        <Text>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Goal;
