import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/users/Header';
import CategoryCard from '../../components/users/CategoryCard';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {LoadingIndicator} from '../../components/LoadingIndicator';

const HomeScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const categoriesSubscriber = firestore()
      .collection('categories')
      .onSnapshot(querySnapshot => {
        const categoriesData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCategories(categoriesData);
        setLoading(false);
      });

    return () => categoriesSubscriber();
  }, []);

  const handleCategoryPress = category => {
    navigation.navigate('ProductList', {categoryDocId: category.id});
  };

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        navigation.navigate('Login'); // Adjust this to your login screen name
      })
      .catch(error => console.log('Error logging out: ', error));
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <LinearGradient colors={['#FDF0F3', '#FFFBFC']} style={styles.container}>
      <View style={styles.header}>
        <Header />
      </View>
      <FlatList
        data={categories}
        renderItem={({item}) => (
          <CategoryCard
            category={item}
            onPress={() => handleCategoryPress(item)}
          />
        )}
        keyExtractor={item => item.id}
        numColumns={2}
      />
      {/* <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity> */}
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: '100%',
  },
  headingText: {
    fontSize: 28,
    color: '#000000',
    marginVertical: 20,
    fontFamily: 'Poppins-Regular',
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchIcon: {
    height: 26,
    width: 26,
    marginHorizontal: 12,
  },
  textInput: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
  logoutButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});
