import React, {useState, useEffect} from 'react';
import {FlatList, StyleSheet, View, TextInput} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/users/Header';
import ProductCard from '../../components/users/ProductCard';
import firestore from '@react-native-firebase/firestore';
import {LoadingIndicator} from '../../components/LoadingIndicator';

const ProductListScreen = ({route, navigation}) => {
  const {categoryDocId} = route.params;
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsSnapshot = await firestore()
          .collection('services') // Change this to 'products' if you have a separate collection for user products
          .where('categoryId', '==', categoryDocId)
          .get();

        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryDocId]);

  const handleProductPress = product => {
    navigation.navigate('ProductDetails', {product});
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <LinearGradient colors={['#FDF0F3', '#FFFBFC']} style={styles.container}>
      <View style={styles.header}>
        <Header />
        <View style={styles.inputContainer}>
          <TextInput placeholder="Search" style={styles.textInput} />
        </View>
      </View>
      <FlatList
        data={products}
        renderItem={({item}) => (
          <ProductCard item={item} handleProductClick={handleProductPress} />
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />
    </LinearGradient>
  );
};

export default ProductListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 20,
  },
  textInput: {
    fontSize: 18,
    width: '100%',
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 15,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  productList: {
    paddingHorizontal: 10,
  },
});
