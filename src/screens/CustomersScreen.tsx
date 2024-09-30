import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Switch,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const CustomersScreen = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const currentUser = auth().currentUser;
        const usersSnapshot = await firestore().collection('users').get();
        const usersData = usersSnapshot.docs
          .map(doc => ({id: doc.id, ...doc.data()}))
          .filter(user => user.id !== currentUser.uid);
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleAdminStatus = async (userId, currentStatus) => {
    try {
      await firestore().collection('users').doc(userId).update({
        isAdmin: !currentStatus,
      });
      setUsers(
        users.map(user =>
          user.id === userId ? {...user, isAdmin: !currentStatus} : user,
        ),
      );
    } catch (error) {
      console.error('Error updating admin status:', error);
    }
  };

  const renderUser = ({item}) => (
    <LinearGradient colors={['#FDF0F3', '#FFFBFC']} style={styles.userItem}>
      <View style={styles.userInfo}>
        <Icon name="person" size={24} color="#FF6347" />
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Admin</Text>
        <Switch
          value={item.isAdmin}
          onValueChange={() => toggleAdminStatus(item.id, item.isAdmin)}
          trackColor={{false: '#767577', true: '#FF6347'}}
          thumbColor={item.isAdmin ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>
    </LinearGradient>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6347" />
      <LinearGradient
        colors={['#FF6347', '#FF7F50']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerButton}>
            <Icon name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Customers</Text>
          <View style={styles.headerPlaceholder} />
        </View>
      </LinearGradient>

      <View style={styles.contentContainer}>
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyList}>No users found</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f6ff',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 1,
    flex: 1,
    textAlign: 'center',
  },
  headerButton: {
    padding: 5,
    width: 32,
  },
  headerPlaceholder: {
    width: 32,
  },
  listContainer: {
    padding: 15,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginRight: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyList: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: 'gray',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
