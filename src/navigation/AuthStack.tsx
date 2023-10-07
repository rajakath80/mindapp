import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import Login from '../screens/Login';

const Stack = createStackNavigator();

const AuthStack = () => {

  useEffect(() => {
    console.log('here in authstack, useEffect');
  }, []);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{header: () => null}}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;