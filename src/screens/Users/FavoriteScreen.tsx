import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import {FavoriteContext} from '../../context/users/FavoriteContext';
import ProductCard from '../../components/users/ProductCard';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/users/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FavoriteScreen = ({navigation}) => {
  const {favorites, toggleFavorite} = useContext(FavoriteContext);
  const [refreshing, setRefreshing] = useState(false);

  const handleProductPress = product => {
    navigation.navigate('ProductDetails', {product});
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="favorite-border" size={80} color="#E96E6E" />
      <Text style={styles.emptyStateText}>No favorites yet</Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.exploreButtonText}>Explore Products</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={['#FDF0F3', '#FFFBFC']} style={styles.container}>
      <View style={styles.header}>
        <Header />
        <Text style={styles.title}>Favorites</Text>
      </View>
      <FlatList
        data={favorites}
        renderItem={({item}) => (
          <ProductCard
            item={item}
            handleProductClick={handleProductPress}
            isFavorite={true}
            toggleFavorite={() => toggleFavorite(item)}
          />
        )}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productList}
        ListEmptyComponent={renderEmptyState}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 20,
    fontFamily: 'Poppins-Regular',
  },
  productList: {
    paddingHorizontal: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
    fontFamily: 'Poppins-Regular',
  },
  exploreButton: {
    backgroundColor: '#E96E6E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
  },
});

export default FavoriteScreen;
