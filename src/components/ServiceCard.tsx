// ServiceCard.js
import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MyText from './MyText';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const {width} = Dimensions.get('window');

function ServiceCard({image, title, price, itemKey}) {
  const navigation = useNavigation();

  const handleEdit = () => {
    navigation.navigate('UpdateService', {
      isEdit: true,
      title,
      price,
      image,
      itemKey,
    });
  };

  const formatPrice = price => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', onPress: () => deleteService(), style: 'destructive'},
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
      })
      .catch(error => {
        console.error('Error removing service: ', error);
      });
  };

  const viewDetails = () => {
    navigation.navigate('ServiceDetail', {
      image,
      title,
      price,
      itemKey,
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={viewDetails}>
      <Image style={styles.image} source={{uri: image}} />
      <View style={styles.infoContainer}>
        <MyText style={styles.title} numberOfLines={1}>
          {title}
        </MyText>
        <MyText style={styles.price}>${formatPrice(price)}</MyText>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={handleEdit}>
          <Icon name="create-outline" size={20} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleDelete}>
          <Icon name="trash-outline" size={20} color="#FF6347" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 20,
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 15,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6347',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginLeft: 10,
  },
});

export default ServiceCard;
