import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {BottomTabNavigator} from './BottomTabNavigator';
import AddServiceOrCategory from '../screens/AddServiceOrCategoryScreen';
import ServiceDetailScreen from '../screens/ServiceDetailScreen';

import AddServiceScreen from '../screens/AddServiceScreen';
import UpdateServiceScreen from '../screens/UpdateServiceScreen';
import HomeScreen from '../screens/HomeScreen';
import CategoryServicesScreen from '../screens/CategoryServicesScreen';
import AddCategoryScreen from '../screens/AddCategoryScreen';
import UpdateCategoryScreen from '../screens/UpdateCategoryScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {CustomersScreen} from '../screens/CustomersScreen';

const Stack = createStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen
        name="AddServiceOrCategory"
        component={AddServiceOrCategory}
      />
      <Stack.Screen
        name="ServiceDetail"
        component={ServiceDetailScreen}
        options={({route}) => ({title: route.params.title})}
      />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Customers" component={CustomersScreen} />
      <Stack.Screen name="AddService" component={AddServiceScreen} />
      <Stack.Screen name="UpdateService" component={UpdateServiceScreen} />
      <Stack.Screen
        name="CategoryServices"
        component={CategoryServicesScreen}
      />
      <Stack.Screen name="AddCategory" component={AddCategoryScreen} />
      <Stack.Screen name="UpdateCategory" component={UpdateCategoryScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};
