// ProfileScreen.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      firestore()
        .collection('users')
        .doc(currentUser.uid)
        .get()
        .then(doc => {
          if (doc.exists) {
            setUser({id: doc.id, ...doc.data()});
          }
        });
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Here you would typically update the app's theme
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      <View style={styles.header}>
        <Image
          source={{uri: user.photoURL || 'https://via.placeholder.com/150'}}
          style={styles.profileImage}
        />
        <Text style={[styles.name, darkMode && styles.darkText]}>
          {user.displayName || 'User'}
        </Text>
        <Text style={[styles.email, darkMode && styles.darkText]}>
          {user.email}
        </Text>
      </View>

      <View style={styles.settingsContainer}>
        <TouchableOpacity style={styles.settingItem}>
          <Icon
            name="edit"
            size={24}
            color={darkMode ? '#FFFFFF' : '#333333'}
          />
          <Text style={[styles.settingText, darkMode && styles.darkText]}>
            Edit Profile
          </Text>
        </TouchableOpacity>

        <View style={styles.settingItem}>
          <Icon
            name="brightness-6"
            size={24}
            color={darkMode ? '#FFFFFF' : '#333333'}
          />
          <Text style={[styles.settingText, darkMode && styles.darkText]}>
            Dark Mode
          </Text>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{false: '#767577', true: '#FF6347'}}
            thumbColor={darkMode ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={styles.settingItem}>
          <Icon
            name="notifications"
            size={24}
            color={darkMode ? '#FFFFFF' : '#333333'}
          />
          <Text style={[styles.settingText, darkMode && styles.darkText]}>
            Notifications
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Icon
            name="security"
            size={24}
            color={darkMode ? '#FFFFFF' : '#333333'}
          />
          <Text style={[styles.settingText, darkMode && styles.darkText]}>
            Privacy and Security
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={handleSignOut}>
          <Icon name="exit-to-app" size={24} color="#FF6347" />
          <Text style={[styles.settingText, {color: '#FF6347'}]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  darkContainer: {
    backgroundColor: '#333333',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  settingsContainer: {
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingText: {
    fontSize: 18,
    marginLeft: 20,
    flex: 1,
  },
  darkText: {
    color: '#FFFFFF',
  },
});

export default ProfileScreen;
