/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';

import React, { Component, useEffect, useState } from 'react';
import {
  Linking,
View
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import Login from '../screens/Login';
import ProfileScreen from '../screens/Profile';
import Goal from '../screens/Goal';
import Dashboard from '../screens/Dashboard';
import Day from '../screens/Day';

const Stack = createStackNavigator(); 
const Tab = createBottomTabNavigator();

export default function AppStack () {

  console.log("here in App Stack start");
  
  function Home() {
    return(
      <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Goals" component={Dashboard} />
          <Stack.Screen name="Goal" component={Goal} />
      </Stack.Navigator>
    );
  }

  return (
    <Tab.Navigator screenOptions={{headerShown: true}}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Day" component={Day} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

