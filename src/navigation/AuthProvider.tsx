import React, {createContext, useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
//import { LoginManager, AccessToken, Settings } from 'react-native-fbsdk-next';
import { appleAuth } from '@invertase/react-native-apple-authentication';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    GoogleSignin.configure({webClientId: '74214128356-d1a6rj1kifl6d0pu8dudo6rkm2p2cl0c.apps.googleusercontent.com'});
    //Settings.setAdvertiserTrackingEna bled(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            await auth().signInWithEmailAndPassword(email, password);
          } catch (e) {
            console.log(e);
          }
        },
        register: async (email, password) => {
          try {
            await auth().createUserWithEmailAndPassword(email, password)
            .catch(error => {
              console.log('Error during email verification', error);
              setErrorMessage('Cannot register, reason: ' + error);
            })
            .then(() => {
              firestore().collection('users')
              .doc(auth().currentUser?.uid)
              .set({uid: auth().currentUser?.uid, email})
            })
            .catch(error => {
              console.log('Error adding to FB DB:', error.message);
              setErrorMessage('Cannot register, reason 2: ' + error);
            })
          } catch (e) {
            console.log(e);
          }
        },
        googleLogin: async () => {
          try {
            // Get the users ID token
            const { idToken } = await GoogleSignin.signIn();

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            await auth().signInWithCredential(googleCredential)
            // Use it only when user Sign's up, 
            // so create different social signup function
            // .then(() => {
            //   //Once the user creation has happened successfully, we can add the currentUser into firestore
            //   //with the appropriate details.
            //   // console.log('current User', auth().currentUser);
            //   firestore().collection('users').doc(auth().currentUser.uid)
            //   .set({
            //       fname: '',
            //       lname: '',
            //       email: auth().currentUser.email,
            //       createdAt: firestore.Timestamp.fromDate(new Date()),
            //       userImg: null,
            //   })
            //   //ensure we catch any errors at this stage to advise us if something does go wrong
            //   .catch(error => {
            //       console.log('Something went wrong with added user to firestore: ', error);
            //   })
            // })
            //we need to catch the whole sign up process if it fails too.
            .catch(error => {
                console.log('Something went wrong with sign up: ', error);
            });
          } catch(error) {
            console.log({error});
          }
        },
        facebookLogin: async () => {
          try {
            /*
            // Attempt login with permissions
            const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

            if (result.isCancelled) {
              throw 'User cancelled the login process';
            }

            // Once signed in, get the users AccesToken
            const data = await AccessToken.getCurrentAccessToken();

            if (!data) {
              throw 'Something went wrong obtaining access token';
            }

            // Create a Firebase credential with the AccessToken
            const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

            // Sign-in the user with the credential
            await auth().signInWithCredential(facebookCredential)
            // Use it only when user Sign's up, 
            // so create different social signup function
            // .then(() => {
            //   //Once the user creation has happened successfully, we can add the currentUser into firestore
            //   //with the appropriate details.
            //   console.log('current User', auth().currentUser);
            //   firestore().collection('users').doc(auth().currentUser.uid)
            //   .set({
            //       fname: '',
            //       lname: '',
            //       email: auth().currentUser.email,
            //       createdAt: firestore.Timestamp.fromDate(new Date()),
            //       userImg: null,
            //   })
            //   //ensure we catch any errors at this stage to advise us if something does go wrong
            //   .catch(error => {
            //       console.log('Something went wrong with added user to firestore: ', error);
            //   })
            // })
            //we need to catch the whole sign up process if it fails too.
            .catch(error => {
                console.log('Something went wrong with sign up: ', error);
            });
            */
          } catch(error) {
            console.log({error});
          }
        },
        register: async (email, password) => {
          try {
            await auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
              //Once the user creation has happened successfully, we can add the currentUser into firestore
              //with the appropriate details.
              firestore().collection('users').doc(auth().currentUser.uid)
              .set({
                  fname: '',
                  lname: '',
                  email: email,
                  createdAt: firestore.Timestamp.fromDate(new Date()),
                  userImg: null,
              })
              //ensure we catch any errors at this stage to advise us if something does go wrong
              .catch(error => {
                  console.log('Something went wrong with added user to firestore: ', error);
              })
            })
            //we need to catch the whole sign up process if it fails too.
            .catch(error => {
                console.log('Something went wrong with sign up: ', error);
            });
          } catch (e) {
            console.log(e);
          }
        },
        appleLogin: async () => {
          try {
            // performs login request
            const appleAuthRequestResponse = await appleAuth.performRequest({
              requestedOperation: appleAuth.Operation.LOGIN,
              // Note: it appears putting FULL_NAME first is important, see issue #293
              requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
            });

            // get current authentication state for user
            // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
            const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

            // use credentialState response to ensure the user is authenticated
            if (credentialState === appleAuth.State.AUTHORIZED) {
              // user is authenticated
              console.log('apple sign in successful');
              const { identityToken, nonce } = appleAuthRequestResponse;
              console.log('identityToken, nonce', identityToken, nonce);

              const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

              auth().signInWithCredential(appleCredential)
              .then(response => {
                const isNewUser = response.additionalUserInfo.isNewUser;
                const {
                  first_name,
                  last_name,
                  family_name,
                  given_name,
                } = response.additionalUserInfo.profile;
                const { uid, email, phoneNumber, photoURL } = response.user
                console.log('Apple user details: ', email, first_name, given_name, family_name);
                console.log('is New User ', isNewUser);
                if(isNewUser) {
                  firestore().collection('users').doc(auth().currentUser.uid)
                  .set({
                      fname: '',
                      lname: '',
                      email: email,
                      createdAt: firestore.Timestamp.fromDate(new Date()),
                      userImg: null,
                  })
                  .catch(error => {
                      console.log('Something went wrong with added user to firestore: ', error);
                  })
                }
              })
            }
          } catch (e) {
            console.log(e);
          }
        },
        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {
            console.log(e);
          }
        },
        forgotPassword: async (email) => {
          try {
            await auth().sendPasswordResetEmail(email);
          } catch (e) {
            console.log(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};