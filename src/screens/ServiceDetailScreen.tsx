import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import MyText from '../components/MyText';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';

const ServiceDetailScreen = ({route}) => {
  const {itemKey} = route.params;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [serviceData, setServiceData] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    const fetchServiceDetails = async () => {
      try {
        const serviceDoc = await firestore()
          .collection('services')
          .doc(itemKey)
          .get();

        if (serviceDoc.exists) {
          setServiceData(serviceDoc.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching service details:', error);
      }
    };

    fetchServiceDetails();
  }, [navigation, itemKey]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteService(),
          style: 'destructive',
        },
      ],
    );
  };

  const deleteService = () => {
    firestore()
      .collection('services')
      .doc(itemKey)
      .delete()
      .then(() => {
        console.log('Service deleted!');
        navigation.goBack();
      })
      .catch(error => {
        console.error('Error deleting service: ', error);
      });
  };

  const handleUpdate = () => {
    navigation.navigate('UpdateService', {
      itemKey,
      ...serviceData,
    });
  };

  if (!serviceData) {
    return (
      <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
        <MyText>Loading...</MyText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Image source={{uri: serviceData.img_url}} style={styles.image} />
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <MyText style={styles.headerTitle}>Service Details</MyText>
            <View style={{width: 24}} />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <MyText style={styles.title}>{serviceData.title}</MyText>
          <MyText style={styles.price}>{serviceData.price} VND</MyText>
          <MyText style={styles.description}>
            {serviceData.description || 'No description available.'}
          </MyText>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.updateButton]}
              onPress={handleUpdate}>
              <Icon name="create-outline" size={20} color="#FFF" />
              <MyText style={styles.buttonText}>Update</MyText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}>
              <Icon name="trash-outline" size={20} color="#FFF" />
              <MyText style={styles.buttonText}>Delete</MyText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f6ff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent', // Transparent header
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  infoContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6347',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default ServiceDetailScreen;
