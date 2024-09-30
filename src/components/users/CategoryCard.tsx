import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {fonts} from '../../utils/fonts';

const CategoryCard = ({category, onPress}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(category)}>
      <View style={styles.card}>
        <Image source={{uri: category.imageURL}} style={styles.image} />
        <Text style={styles.title}>{category.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  card: {
    borderRadius: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  title: {
    fontFamily: fonts.regular,
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 15,
    paddingHorizontal: 10,
    textAlign: 'center',
    color: '#333',
  },
});
