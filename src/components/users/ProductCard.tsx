import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext} from 'react';
import {fonts} from '../../utils/fonts';
import {FavoriteContext} from '../../context/users/FavoriteContext';

const ProductCard = ({item, handleProductClick}) => {
  const {favorites, toggleFavorite} = useContext(FavoriteContext);

  const isFavorite = favorites.some(fav => fav.id === item.id);

  const handleToggleFavorite = () => {
    toggleFavorite(item);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => handleProductClick(item)}>
      <Image source={{uri: item.img_url}} style={styles.coverImage} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
      <View style={styles.likeContainer}>
        <TouchableOpacity onPress={handleToggleFavorite}>
          <Image
            source={
              isFavorite
                ? require('../../assets/favoriteFilled.png')
                : require('../../assets/favorite.png')
            }
            style={styles.faviorate}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  coverImage: {
    height: 256,
    width: '100%',
    borderRadius: 20,
    position: 'relative',
  },
  contentContainer: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.regular,
    fontWeight: '700',
    color: '#444444',
  },
  price: {
    fontSize: 18,
    fontFamily: fonts.medium,
  },
  likeContainer: {
    position: 'absolute',
    padding: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    right: 10,
    top: 10,
  },
  faviorate: {
    height: 20,
    width: 20,
  },
});
