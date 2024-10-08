import React from 'react';
import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import MyText from './MyText';

const Category = ({image, title, onPress, docId}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(docId)}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{uri: image}} />
      </View>
      <MyText style={styles.title}>{title}</MyText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 180,
    marginRight: 15,
    alignItems: 'center',
    // marginBottom: 30,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 50,
    height: 50,
  },
  title: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default Category;
