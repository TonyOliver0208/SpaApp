import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import {useStripe} from '@stripe/stripe-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const StripePaymentScreen = ({route}) => {
  const navigation = useNavigation();
  const {product, appointmentDateTime} = route.params;
  const appointmentDate = new Date(appointmentDateTime);
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const bookingFee = product.price * 0.5;

  const handlePayment = async () => {
    console.log('clicked');
    try {
      // First, request a PaymentIntent from your server
      const response = await fetch(
        'http://10.0.2.2:3000/create-payment-intent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: bookingFee * 100, // amount in cents (50% of the price)
          }),
        },
      );
      const {clientSecret} = await response.json();

      // Initialize the Payment Sheet with the received client secret
      const {error: initError} = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Spa App', // Add this line
        // You can also add more customization options here
        // such as applePay, googlePay, allowsDelayedPaymentMethods, etc.
      });

      if (initError) {
        console.log('Error initializing payment sheet:', initError);
        return;
      }

      // Present the Payment Sheet
      const {error: paymentError} = await presentPaymentSheet();

      if (paymentError) {
        console.log('Error with payment:', paymentError);
      } else {
        console.log('Payment successful');

        const bookedService = {
          userId: auth().currentUser.uid,
          product,
          appointmentDateTime,
          paymentDateTime: new Date().toISOString(),
          totalPrice: product.price,
          paidPrice: bookingFee,
          status: 'booked',
        };

        // Save the booking to Firestore
        await firestore().collection('bookings').add(bookedService);

        // Navigate to the Booked tab
        navigation.replace('UserMain', {screen: 'Booked'});
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <LinearGradient colors={['#FDF0F3', '#FFFBFC']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.card}>
            <Image
              source={{uri: product.img_url}}
              style={styles.productImage}
            />
            <Text style={styles.title}>Complete Your Booking</Text>
            <Text style={styles.noticeText}>
              Note: You only need to pay 50% of the price as a deposit for
              booking. The remaining 50% will be paid after your spa session.
            </Text>
            <View style={styles.detailsContainer}>
              <DetailItem icon="spa" text={`${product.title}`} />
              <DetailItem
                icon="attach-money"
                text={`Total: $${product.price}`}
              />
              <DetailItem icon="credit-card" text={`Deposit: $${bookingFee}`} />
              <DetailItem
                icon="event"
                text={`${appointmentDate.toLocaleDateString()}`}
              />
              <DetailItem
                icon="access-time"
                text={`${appointmentDate.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}`}
              />
            </View>
            <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
              <LinearGradient
                colors={['#E96E6E', '#FF69B4']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.payButtonGradient}>
                <Text style={styles.payButtonText}>Pay Deposit Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const DetailItem = ({icon, text}) => (
  <View style={styles.detailItem}>
    <Icon name={icon} size={24} color="#E96E6E" style={styles.icon} />
    <Text style={styles.details}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 28,
    color: '#333',
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  detailsContainer: {
    marginBottom: 30,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#FDF0F3',
    padding: 15,
    borderRadius: 10,
  },
  icon: {
    marginRight: 15,
  },
  details: {
    fontSize: 18,
    color: '#333',
    flex: 1,
  },
  payButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  payButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  payButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  noticeText: {
    fontSize: 14,
    color: '#E96E6E',
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic',
  },
});

export default StripePaymentScreen;
