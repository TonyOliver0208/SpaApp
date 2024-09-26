import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MyText from './MyText';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

function ServiceCard({image, title, price, itemKey}) {
  const navigation = useNavigation();

  const editFood = () => {
    navigation.navigate('AddServiceOrCategory', {
      isEdit: true,
      title,
      price,
      image,
      itemKey,
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={editFood}>
      <Image style={styles.image} source={{uri: image}} />
      <View style={styles.infoContainer}>
        <MyText style={styles.title} numberOfLines={1}>
          {title}
        </MyText>
        <MyText style={styles.price}>{price} VND</MyText>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Icon name="add" size={24} color="#FFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 10,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6347',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#FF6347',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ServiceCard;
