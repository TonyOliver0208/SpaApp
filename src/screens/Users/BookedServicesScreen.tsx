import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const BookedServicesScreen = () => {
  const [bookedServices, setBookedServices] = useState([]);

  const fetchBookedServices = useCallback(async () => {
    try {
      const storedServices = await AsyncStorage.getItem('bookedServices');
      if (storedServices) {
        const parsedServices = JSON.parse(storedServices);
        // Sort services by date, newest first
        const sortedServices = parsedServices.sort(
          (a, b) =>
            new Date(b.appointmentDateTime) - new Date(a.appointmentDateTime),
        );
        // Reverse the order of the sorted array
        setBookedServices(sortedServices.reverse());
      }
    } catch (error) {
      console.error('Error fetching booked services:', error);
    }
  }, []);

  useEffect(() => {
    const user = auth().currentUser;
    if (!user) {
      console.log('No user is signed in');
      return;
    }

    const unsubscribe = firestore()
      .collection('bookings')
      .where('userId', '==', user.uid)
      .orderBy('appointmentDateTime', 'desc')
      .onSnapshot(
        querySnapshot => {
          if (querySnapshot) {
            const services = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setBookedServices(services); // Remove the reverse() call here
          } else {
            console.log('No data available');
            setBookedServices([]);
          }
        },
        error => {
          console.error('Error fetching booked services:', error);
          setBookedServices([]);
        },
      );

    return () => unsubscribe();
  }, []);

  const renderItem = ({item}) => (
    <LinearGradient colors={['#FDF0F3', '#FFFBFC']} style={styles.serviceItem}>
      <View style={styles.serviceHeader}>
        <Icon name="spa" size={24} color="#E96E6E" />
        <Text style={styles.serviceTitle}>{item.product.title}</Text>
      </View>
      <View style={styles.serviceDetails}>
        <View style={styles.detailRow}>
          <Icon name="event" size={20} color="#666" />
          <Text style={styles.detailText}>
            {new Date(item.appointmentDateTime).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="access-time" size={20} color="#666" />
          <Text style={styles.detailText}>
            {new Date(item.appointmentDateTime).toLocaleTimeString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="attach-money" size={20} color="#666" />
          <Text style={styles.detailText}>Total: ${item.totalPrice}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="credit-card" size={20} color="#666" />
          <Text style={styles.detailText}>Paid: ${item.paidPrice}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="account-balance-wallet" size={20} color="#666" />
          <Text style={styles.detailText}>
            Remaining: ${item.totalPrice - item.paidPrice}
          </Text>
        </View>
      </View>
      <View style={styles.paymentInfo}>
        <Icon name="payment" size={20} color="#4CAF50" />
        <Text style={styles.paymentText}>
          Deposit paid on {new Date(item.paymentDateTime).toLocaleString()}
        </Text>
      </View>
    </LinearGradient>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#FDF0F3', '#FFFBFC']} style={styles.gradient}>
        <Text style={styles.header}>Booked Services</Text>
        <FlatList
          data={bookedServices}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          inverted={true} // This will invert the order of the list
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  listContainer: {
    padding: 15,
    flexGrow: 1,
  },
  serviceItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    marginTop: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  serviceDetails: {
    marginLeft: 34,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  paymentText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 5,
  },
});

export default BookedServicesScreen;
