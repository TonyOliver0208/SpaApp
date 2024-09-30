import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import MyText from '../components/MyText';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {LoadingIndicator} from '../components';
import Icon from 'react-native-vector-icons/Ionicons';

export const ProfileScreen = ({navigation}) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarURL, setAvatarURL] = useState('');
  const [tempAvatarURL, setTempAvatarURL] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const user = auth().currentUser;
    if (user) {
      try {
        const documentSnapshot = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();
        if (documentSnapshot.exists) {
          const data = documentSnapshot.data();
          setUserData(data);
          setEmail(data.email);
          setAvatarURL(data.photoURL || '');
          setTempAvatarURL(data.photoURL || '');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Logout',
          onPress: () => {
            auth()
              .signOut()
              .then(() => {
                navigation.navigate('Login');
              })
              .catch(error => console.log('Error logging out: ', error));
          },
        },
      ],
      {cancelable: false},
    );
  };

  const handleUpdateProfile = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const user = auth().currentUser;
      if (user) {
        // Update Firestore document
        await firestore().collection('users').doc(user.uid).update({
          photoURL: tempAvatarURL,
          // Add other fields you want to update
        });

        if (password) {
          await user.updatePassword(password);
        }

        // Update local state
        setAvatarURL(tempAvatarURL);

        Alert.alert('Success', 'Profile updated successfully');
        setModalVisible(false);

        // Fetch updated user data
        await fetchUserData();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile: ' + error.message);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: tempAvatarURL || 'https://via.placeholder.com/150',
          }}
          style={styles.profileImage}
        />
        <MyText style={styles.name}>{userData?.displayName || 'Admin'}</MyText>
        <MyText style={styles.email}>{userData?.email}</MyText>
      </View>
      <View style={styles.infoContainer}>
        <InfoItem
          icon="call-outline"
          label="Phone"
          value={userData?.phone || 'Not set'}
        />
        <InfoItem
          icon="location-outline"
          label="Address"
          value={userData?.address || 'Not set'}
        />
        <InfoItem
          icon="calendar-outline"
          label="Member Since"
          value={userData?.createdAt || 'Unknown'}
        />
      </View>
      <TouchableOpacity
        style={styles.updateButton}
        onPress={() => setModalVisible(true)}>
        <Icon name="create-outline" size={24} color="#FFF" />
        <MyText style={styles.buttonText}>Update Profile</MyText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out-outline" size={24} color="#FFF" />
        <MyText style={styles.buttonText}>Logout</MyText>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <MyText style={styles.modalTitle}>Update Profile</MyText>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Avatar URL"
              value={tempAvatarURL}
              onChangeText={setTempAvatarURL}
            />

            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdateProfile}>
              <MyText style={styles.buttonText}>Update</MyText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}>
              <MyText style={styles.buttonText}>Cancel</MyText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const InfoItem = ({icon, label, value}) => (
  <View style={styles.infoItem}>
    <Icon name={icon} size={24} color="#FF6347" style={styles.infoIcon} />
    <View>
      <MyText style={styles.infoLabel}>{label}</MyText>
      <MyText style={styles.infoValue}>{value}</MyText>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f6ff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FF6347',
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
    color: '#FFF',
  },
  email: {
    fontSize: 16,
    color: '#FFF',
  },
  infoContainer: {
    padding: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoIcon: {
    marginRight: 15,
  },
  infoLabel: {
    fontSize: 16,
    color: '#333',
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6347',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 18,
    marginLeft: 10,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
});
