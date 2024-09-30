import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/users/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {CartContext} from '../../context/users/CartContext';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ProductDetailsScreen = ({route, navigation}) => {
  const {product} = route.params;
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const {addToCart} = useContext(CartContext);

  useEffect(() => {
    // Set initial date and time to the next available slot
    const now = new Date();
    if (now.getHours() >= 18) {
      // If it's past 6 PM, set to next day at 8 AM
      now.setDate(now.getDate() + 1);
      now.setHours(8, 0, 0, 0);
    } else if (now.getHours() < 8) {
      // If it's before 8 AM, set to 8 AM today
      now.setHours(8, 0, 0, 0);
    } else {
      // Set to the next hour
      now.setHours(now.getHours() + 1, 0, 0, 0);
    }
    setDate(now);
    setTime(now);
  }, []);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');

    if (currentDate >= new Date()) {
      setDate(currentDate);
      // If the selected date is today, ensure the time is also valid
      if (currentDate.toDateString() === new Date().toDateString()) {
        const newTime = new Date(time);
        const now = new Date();
        if (
          newTime < now ||
          newTime.getHours() < 8 ||
          newTime.getHours() >= 18
        ) {
          newTime.setHours(Math.max(8, now.getHours() + 1), 0, 0, 0);
          if (newTime.getHours() >= 18) {
            newTime.setHours(8, 0, 0, 0);
            newTime.setDate(newTime.getDate() + 1);
          }
          setTime(newTime);
        }
      } else {
        // For future dates, always set time to 8 AM
        const newTime = new Date(currentDate);
        newTime.setHours(8, 0, 0, 0);
        setTime(newTime);
      }
    } else {
      Alert.alert('Invalid Date', 'Please select a date from today onwards.');
    }
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');

    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(
      currentTime.getHours(),
      currentTime.getMinutes(),
      0,
      0,
    );

    const now = new Date();
    const isToday = selectedDateTime.toDateString() === now.toDateString();

    if (
      selectedDateTime > now &&
      currentTime.getHours() >= 8 &&
      currentTime.getHours() < 18 &&
      (!isToday || (isToday && selectedDateTime > now))
    ) {
      setTime(currentTime);
    } else {
      Alert.alert(
        'Invalid Time',
        "Please select a time between 8 AM and 6 PM, and ensure it's a future time.",
      );
    }
  };

  const handleBook = () => {
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);

    if (selectedDateTime <= new Date()) {
      Alert.alert('Invalid Booking', 'Please select a future date.');
    } else if (time.getHours() < 8 || time.getHours() >= 18) {
      Alert.alert(
        'Invalid Time',
        'Booking is only available between 8 AM and 6 PM.',
      );
    } else {
      setModalVisible(true);
    }
  };

  const confirmBooking = () => {
    setModalVisible(false);
    navigation.navigate('StripePayment', {
      product,
      appointmentDateTime: new Date(
        date.setHours(time.getHours(), time.getMinutes()),
      ).toISOString(), // Convert to ISO string
    });
  };

  return (
    <LinearGradient colors={['#FDF0F3', '#FFFBFC']} style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Header />
        </View>
        <Image source={{uri: product.img_url}} style={styles.productImage} />
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>${product.price}</Text>
          <Text style={styles.bookingFeeNote}>
            Note: Only 50% (${product.price * 0.5}) is required as a deposit
            fee.
          </Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}>
              <Icon name="event" size={24} color="#E96E6E" />
              <Text style={styles.dateTimeButtonText}>
                {date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}>
              <Icon name="access-time" size={24} color="#E96E6E" />
              <Text style={styles.dateTimeButtonText}>
                {time.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onTimeChange}
            />
          )}

          <TouchableOpacity onPress={handleBook} style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book Appointment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Confirm your booking</Text>
            <Text>{product.title}</Text>
            <Text>Date: {date.toLocaleDateString()}</Text>
            <Text>
              Time:{' '}
              {time.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={confirmBooking}>
                <Text style={styles.textStyle}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  price: {
    fontSize: 24,
    color: '#E96E6E',
    marginBottom: 15,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateTimeButton: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dateTimeButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  bookButton: {
    backgroundColor: '#E96E6E',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalDetails: {
    marginBottom: 10,
    fontSize: 16,
  },
  modalButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '45%',
  },
  cancelButton: {
    backgroundColor: '#F194FF',
  },
  confirmButton: {
    backgroundColor: '#2196F3',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal: 10,
  },
  buttonCancel: {
    backgroundColor: '#FF6347',
  },
  buttonConfirm: {
    backgroundColor: '#4CAF50',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bookingFeeNote: {
    fontSize: 14,
    color: '#E96E6E',
    marginBottom: 15,
    fontStyle: 'italic',
  },
});

export default ProductDetailsScreen;
