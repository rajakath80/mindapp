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

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';

import {AuthContext} from '../navigation/AuthProvider';

const LoginScreen = (): JSX.Element => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [isRegister, setIsRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const {login, register, googleLogin, facebookLogin, appleLogin, forgotPassword} = useContext(AuthContext);

  GoogleSignin.configure({webClientId: '74214128356-d1a6rj1kifl6d0pu8dudo6rkm2p2cl0c.apps.googleusercontent.com'});

  const handleLogin = async () => {
    console.log('log in ...', email, password);
    setLoading(true);
    setErrorMessage('');

    try {
      login(email, password);
    } catch (error) {
      console.log('can not login: ', error);
      setErrorMessage('Cannot login, please check your credentials, reason: ' + error);
    }

    setLoading(false);
  }

  const handleRegister = async () => {
    setLoading(true);
    setErrorMessage('');

    console.log('registering ...', email, password, password2);

    if(email && password && password2) {
      if(password == password2) {
        if(password.length >= 6) {
          console.log('starting registration herre !!');

          register(email, password);
          
          /*await auth().sendSignInLinkToEmail(email, {url: 'https://main.d227vxv8v0qy8t.amplifyapp.com/verifyemail', handleCodeInApp: true})
          .then(() => {
            // The link was successfully sent. Inform the user.
            // Save the email locally so you don't need to ask the user for it again
            // if they open the link on the same device.
            //TODO: SAVE EMAIL IN LOCAL STORAGE
            console.log('email sent');
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            console.log('error sending signin link email', error)
          });*/
          
        } else {
          console.log('Passwords do not match');
          setErrorMessage('Passwords do not match');
        }
      } else {
        console.log('Email or password not entered');
        setErrorMessage('Email or password not entered');
      }
      setLoading(false);
    }
  }

  const handleForgotPassword = () => {
    setErrorMessage('');
    setLoading(true);

    if(email) {
      forgotPassword(email);
    } else {
      console.log('Enter your email to reset the password');
      setErrorMessage('Enter your email to reset the password');
    }

    setLoading(false);
  }

  const signUpGoogle = async () => {
    setErrorMessage('');
    setLoading(true);

    console.log('Google sign in or sign up');

    googleLogin();
    
    setLoading(false);

  }

  const signUpFacebook = async () => {
    setErrorMessage('');
    setLoading(true);

    console.log('Facebook sign in or sign up');

    facebookLogin();
    
    setLoading(false);
  }

  const signUpApple = async () => {
    setErrorMessage('');
    setLoading(true);

    console.log('Apple sign in or sign up');

    appleLogin();
    
    setLoading(false);
  }

  return (
    <View className='flex-1 py-20'>

      <ScrollView className='p-2'>
        <Text className='text-xl font-bold mb-2 text-black'>{isRegister ? 'Register': 'Login'}</Text>

        <View>
          
          <View>
            <TextInput
              autoCapitalize='none'
              autoCorrect={false}
              className='w-full bg-white border border-slate-200 rounded-md h-12 px-4 mb-4 text-base'
              placeholder="Email"
              maxLength={100}
              keyboardType="email-address"
              value={email}
              onChangeText={val => setEmail(val)}
            />
          </View>

          <View>
            <TextInput
              autoCapitalize='none'
              className='w-full bg-white border border-slate-200 rounded-md h-12 px-4 mb-4 text-base'
              placeholder="Password"
              maxLength={100}
              value={password}
              onChangeText={val => setPassword(val)}
              secureTextEntry
            />
          </View>

          {isRegister && (
            <View>
              <TextInput
                autoCapitalize='none'
                className='w-full bg-white border border-slate-200 rounded-md h-12 px-4 mb-4 text-base'
                placeholder="Re-enter your password"
                maxLength={100}
                value={password2}
                onChangeText={val => setPassword2(val)}
                secureTextEntry
              />
          </View>
       
          )}

        </View>
      
      <View className='mt-2'>

        <TouchableOpacity onPress={() => isRegister ? handleRegister() : handleLogin()}  className='h-12 bg-orange-500 rounded-2xl flex flex-row justify-center items-center px-2'>
          <Text className='font-bold text-base text-white'>{isRegister ? 'Register' : 'Login'}</Text>
        </TouchableOpacity>
        
        {isRegister ? <></> :
          <TouchableOpacity className='items-center' onPress={() => handleForgotPassword()}>
            <Text className='text-blue-500 mt-4 items-center'>Forgot password?</Text>
          </TouchableOpacity>
        }

        <ActivityIndicator animating={loading} size="large" color="orange" />
        {(errorMessage && errorMessage == '' ) ? '' :
          <Text className='text-red-500'>{errorMessage}</Text>
        }

      </View>

      <View className='items-center mt-6'>
        <Text>- Or sign {isRegister ? 'up' : 'in'} with -</Text>
      </View>

      <View className='flex flex-row items-center justify-around mt-4'>
    
        <TouchableOpacity className='w-16 items-center p-1 rounded-lg bg-slate-100 shadow-sm shadow-black/10' onPress={() => signUpGoogle()}>
          <Image className='h-6 w-6 mb-1' source={require('../../assets/images/google.png')}/>
          <Text className='text-slate-500 text-xs'>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity className='w-16 items-center p-1 rounded-lg bg-slate-100 shadow-sm shadow-black/10' onPress={() => signUpFacebook()}>
          <Image className='h-6 w-6 mb-1' source={require('../../assets/images/facebook.png')}/>
          <Text className='text-slate-500 text-xs'>Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity className='w-16 items-center p-1 rounded-lg bg-slate-100 shadow-sm shadow-black/10' onPress={() => signUpApple()}>
          <Image className='h-6 w-6 mb-1' source={require('../../assets/images/apple.png')}/>
          <Text className='text-slate-500 text-xs'>Apple</Text>
        </TouchableOpacity>

      </View>

      <TouchableOpacity className='items-center mt-1' onPress={() => {
        setIsRegister(!isRegister);
        setErrorMessage('');
        setLoading(false);
      }}>
        <Text className='text-blue-500 font-bold mt-6'>{isRegister ? 'Already an user? Login instead' : 'New user? Register instead'}</Text>
      </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

export default LoginScreen;