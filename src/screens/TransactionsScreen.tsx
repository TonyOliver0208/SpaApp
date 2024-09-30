import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const TransactionsScreen = ({navigation}) => {
  const [transactions, setTransactions] = useState([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('bookings')
      .orderBy('appointmentDateTime', 'desc')
      .onSnapshot(async querySnapshot => {
        const allTransactions = await Promise.all(
          querySnapshot.docs.map(async doc => {
            const bookingData = doc.data();
            const userDoc = await firestore()
              .collection('users')
              .doc(bookingData.userId)
              .get();
            const userEmail = userDoc.data().email;
            return {
              id: doc.id,
              ...bookingData,
              userEmail,
            };
          }),
        );
        setTransactions(allTransactions);
      });

    return () => unsubscribe();
  }, []);

  const handleCompletePayment = async bookingId => {
    Alert.alert(
      'Complete Payment',
      'Are you sure you want to mark this payment as completed?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            await firestore().collection('bookings').doc(bookingId).update({
              status: 'completed',
              fullPaymentDate: new Date().toISOString(),
            });
            Alert.alert('Success', 'Payment marked as completed.');
          },
        },
      ],
    );
  };

  const renderItem = ({item}) => (
    <LinearGradient
      colors={['#FDF0F3', '#FFFBFC']}
      style={styles.transactionItem}>
      <View style={styles.transactionHeader}>
        <Icon name="receipt" size={24} color="#FF6347" />
        <Text style={styles.transactionTitle}>{item.product.title}</Text>
      </View>
      <View style={styles.transactionDetails}>
        <DetailRow icon="email" text={item.userEmail} />
        <DetailRow
          icon="event"
          text={new Date(item.appointmentDateTime).toLocaleDateString()}
        />
        <DetailRow
          icon="access-time"
          text={new Date(item.appointmentDateTime).toLocaleTimeString()}
        />
        <DetailRow icon="attach-money" text={`Total: $${item.totalPrice}`} />
        <DetailRow icon="credit-card" text={`Paid: $${item.paidPrice}`} />
        <DetailRow
          icon="account-balance-wallet"
          text={`Remaining: $${item.totalPrice - item.paidPrice}`}
        />
      </View>
      {item.status !== 'completed' ? (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => handleCompletePayment(item.id)}>
          <Text style={styles.completeButtonText}>Complete Payment</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.completedContainer}>
          <Icon name="check-circle" size={24} color="#4CAF50" />
          <Text style={styles.completedText}>Payment Completed</Text>
          <Text style={styles.completedDateTime}>
            {new Date(item.fullPaymentDate).toLocaleString()}
          </Text>
        </View>
      )}
    </LinearGradient>
  );

  const DetailRow = ({icon, text}) => (
    <View style={styles.detailRow}>
      <Icon name={icon} size={20} color="#666" />
      <Text style={styles.detailText}>{text}</Text>
    </View>
  );

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
          <Text style={styles.headerTitle}>Transactions</Text>
          <View style={styles.headerPlaceholder} />
        </View>
      </LinearGradient>

      <View style={styles.contentContainer}>
        {transactions.length === 0 ? (
          <Text style={styles.noTransactionsText}>No transactions found</Text>
        ) : (
          <FlatList
            data={transactions}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
          />
        )}
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
  listContainer: {
    padding: 15,
  },
  transactionItem: {
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  transactionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  transactionDetails: {
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
  completeButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  completedText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  completedDateTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  noTransactionsText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
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
    width: 32, // Adjust this value to match the icon size plus padding
  },
  headerPlaceholder: {
    width: 32, // Same width as headerButton to balance the layout
  },
});

export default TransactionsScreen;
