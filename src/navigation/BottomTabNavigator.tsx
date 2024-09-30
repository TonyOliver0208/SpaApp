import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import {CustomersScreen} from '../screens/CustomersScreen';
import {ProfileScreen} from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Transactions') {
            iconName = 'receipt';
          } else if (route.name === 'Customers') {
            iconName = 'people';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          // Use the theme color for the icon
          return (
            <Icon
              name={iconName}
              size={size}
              color={focused ? '#FF6347' : color}
            />
          );
        },
        tabBarActiveTintColor: '#FF6347', // Set the active tab color to orange
        tabBarInactiveTintColor: 'gray', // Color for inactive tabs
        headerShown: false, // Disable the header for all screens
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Customers" component={CustomersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
