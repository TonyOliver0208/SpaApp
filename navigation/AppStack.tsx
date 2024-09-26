import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import {ProfileScreen} from '../screens/ProfileScreen'; // Make sure to create this component
import {AddFoodOrCategoryScreen} from '../screens/AddFoodOrCategoryScreen'; // Make sure this component exists

const Stack = createStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="AddFoodOrCategory"
        component={AddFoodOrCategoryScreen}
      />
    </Stack.Navigator>
  );
};
