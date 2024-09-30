import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {UserBottomTabNavigator} from './UserBottomTabNavigator';
import ProductDetailsScreen from '../../screens/Users/ProductDetailsScreen';
import CheckoutSuccessScreen from '../../screens/Users/CheckoutSuccessScreen';
import ProductListScreen from '../../screens/Users/ProductListScreen';
import StripePaymentScreen from '../../screens/Users/StripePaymentScreen';

const Stack = createStackNavigator();

export const UserStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="UserMain" component={UserBottomTabNavigator} />
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      {/* <Stack.Screen name="CheckoutSuccess" component={CheckoutSuccessScreen} /> */}
      <Stack.Screen name="StripePayment" component={StripePaymentScreen} />
    </Stack.Navigator>
  );
};
