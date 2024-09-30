import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  HomeScreen,
  ForgotPasswordScreen,
  LoginScreen,
  SignupScreen,
} from './src/screens';
import {RootNavigator} from './src/navigation/RootNavigator';
import {AuthenticatedUserProvider} from './src/providers';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {FavoriteProvider} from './src/context/users/FavoriteContext';
import {CartProvider} from './src/context/users/CartContext';
import {StripeProvider} from '@stripe/stripe-react-native';

const App = () => {
  const createDummyAdminAccount = async () => {
    try {
      const email = 'admin@example.com';
      const password = 'adminadmin';

      // Create user in Firebase Authentication
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;

      // Set user as admin in Firestore
      await firestore().collection('users').doc(user.uid).set({
        email: user.email,
        isAdmin: true,
      });

      console.log('Dummy admin account created successfully');
    } catch (error) {
      console.error('Error creating dummy admin account:', error);
    }
  };

  // // Call this function once to create the dummy admin account
  // createDummyAdminAccount();

  return (
    <StripeProvider publishableKey="pk_test_51PGJ8i00QwZABgmv3128y150TdUBV7fCoNX0xP4DEtKDJsdX9HnODldba2Ra9fs2wHEyRlL7KRGqySw4jXvi1h2n00aMP8vt3M">
      <AuthenticatedUserProvider>
        <FavoriteProvider>
          <CartProvider>
            <SafeAreaProvider>
              <RootNavigator />
            </SafeAreaProvider>
          </CartProvider>
        </FavoriteProvider>
      </AuthenticatedUserProvider>
    </StripeProvider>
  );
};
export default App;
