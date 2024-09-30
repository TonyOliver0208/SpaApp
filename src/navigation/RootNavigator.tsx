// import React, {useState, useContext, useEffect} from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import auth from '@react-native-firebase/auth';
// import {AuthStack} from './AuthStack';
// import {AppStack} from './AppStack';
// import {AuthenticatedUserContext} from '../providers';
// import {LoadingIndicator} from '../components';
// export const RootNavigator = () => {
//   //@ts-ignore
//   const {user, setUser} = useContext(AuthenticatedUserContext);
//   const [isLoading, setIsLoading] = useState(true);
//   useEffect(() => {
//     // onAuthStateChanged returns an unsubscriber
//     const unsubscribeAuthStateChanged = auth().onAuthStateChanged(
//       authenticatedUser => {
//         authenticatedUser ? setUser(authenticatedUser) : setUser(null);
//         setIsLoading(false);
//       },
//     );
//     // unsubscribe auth listener on unmount
//     return unsubscribeAuthStateChanged;
//   }, [user]);
//   if (isLoading) {
//     return <LoadingIndicator />;
//   }
//   return (
//     <NavigationContainer>
//       {user ? <AppStack /> : <AuthStack />}
//     </NavigationContainer>
//   );
// };

// RootNavigator.js
import React, {useState, useContext, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {AuthStack} from './AuthStack';
import {AppStack} from './AppStack';
import {UserStack} from './Users/UserStack';
import {AuthenticatedUserContext} from '../providers';
import {LoadingIndicator} from '../components';

export const RootNavigator = () => {
  const {user, setUser} = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribeAuthStateChanged = auth().onAuthStateChanged(
      async authenticatedUser => {
        if (authenticatedUser) {
          setUser(authenticatedUser);
          // Check if the user is an admin
          const userDoc = await firestore()
            .collection('users')
            .doc(authenticatedUser.uid)
            .get();
          if (userDoc.exists) {
            setIsAdmin(userDoc.data().isAdmin || false);
          }
          setIsLoading(false);
        } else {
          setUser(null);
          setIsAdmin(false);
          setIsLoading(false);
        }
      },
    );

    return unsubscribeAuthStateChanged;
  }, []);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <NavigationContainer>
      {user ? isAdmin ? <AppStack /> : <UserStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
