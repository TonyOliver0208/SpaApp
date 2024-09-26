import React, {useState, useContext, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {AuthStack} from './AuthStack';
import {AppStack} from './AppStack';
import {AuthenticatedUserContext} from '../providers';
import {LoadingIndicator} from '../components';
export const RootNavigator = () => {
  //@ts-ignore
  const {user, setUser} = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuthStateChanged = auth().onAuthStateChanged(
      authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      },
    );
    // unsubscribe auth listener on unmount
    return unsubscribeAuthStateChanged;
  }, [user]);
  if (isLoading) {
    return <LoadingIndicator />;
  }
  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
