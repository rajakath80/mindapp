import React, { useContext, useState } from 'react';

import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import {AuthContext} from '../navigation/AuthProvider';

const ProfileScreen = (): JSX.Element => {

  const {user, logout, forgotPassword} = useContext(AuthContext);

  const [firstName, setFirstName] = useState(user.displayName != null ? user.displayName : '');
  const [lastName, setLastName] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <View className='flex-1 py-10'>

      <ScrollView className='p-2'>
        <Text className='text-xl font-bold mb-2 text-black'>Profile</Text>

        <View className='flex items-center mb-4'>
          <Image className='border-2 w-10 h-10 rounded-full mb-4' source={require('../../assets/images/account.png')}/>
          <Text className='text-slate-500'>{user.email}</Text>
        </View>

        <View>
          <TextInput
            autoCapitalize='words'
            autoComplete='given-name'
            className='w-full bg-white border border-slate-200 rounded-md h-12 px-4 mb-4 text-base'
            placeholder="First Name"
            maxLength={100}
            value={firstName}
            onChangeText={val => setFirstName(val)}
          />
        </View>

        <View>
          <TextInput
            autoCapitalize='words'
            autoComplete='family-name'
            className='w-full bg-white border border-slate-200 rounded-md h-12 px-4 mb-4 text-base'
            placeholder="Last Name"
            maxLength={100}
            value={lastName}
            onChangeText={val => setLastName(val)}
          />
        </View>
      
      <View className='mt-2'>

        <TouchableOpacity onPress={() => forgotPassword(user.email)}  className='h-12 bg-orange-500 rounded-2xl justify-center items-center mt-2'>
          <Text className='text-base text-white'>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => logout()}  className='h-12 bg-white border-2 border-orange-500 rounded-2xl justify-center items-center mt-4'>
          <Text className='text-base text-orange-500'>Signout</Text>
        </TouchableOpacity>
        
        <ActivityIndicator animating={loading} size="large" color="orange" />
        {(errorMessage && errorMessage == '' ) ? '' :
          <Text className='text-red-500'>{errorMessage}</Text>
        }

      </View>

      </ScrollView>
      
    </View>
  );

};

export default ProfileScreen;
