import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MyText from '../components/MyText';
import Search from '../components/Search';
import Category from '../components/Catagory';
import firestore from '@react-native-firebase/firestore';
import ServiceCard from '../components/ServiceCard';
import auth from '@react-native-firebase/auth';

function HomeScreen({navigation}) {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const categoriesSubscriber = firestore()
      .collection('catagories')
      .onSnapshot(querySnapshot => {
        const categoriesData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          key: doc.id,
        }));
        setCategories(categoriesData);
        setLoading(false);
      });

    const servicesSubscriber = firestore()
      .collection('services')
      .onSnapshot(querySnapshot => {
        const servicesData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          key: doc.id,
        }));
        setServices(servicesData);
      });

    return () => {
      categoriesSubscriber();
      servicesSubscriber();
    };
  }, []);

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        navigation.navigate('Login');
      })
      .catch(error => console.log('Error logging out: ', error));
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#FF6347" />;
  }

  return (
    <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f6ff" />
      <View style={styles.header}>
        <MyText style={styles.headerTitle}>Services</MyText>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="log-out-outline" size={24} color="#FF6347" />
        </TouchableOpacity>
      </View>
      <Search />
      <MyText style={styles.sectionTitle}>Categories</MyText>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        renderItem={({item}) => (
          <Category
            title={item.title}
            itemKey={item.key}
            image={{uri: item.imageURL}}
          />
        )}
        keyExtractor={item => item.key}
        style={styles.categoryList}
      />
      <View style={styles.mainDishesHeader}>
        <MyText style={styles.sectionTitle}>Main Services</MyText>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddFoodOrCategory')}>
          <Icon name="add-circle-outline" size={24} color="#FF6347" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={services}
        renderItem={({item}) => (
          <ServiceCard
            image={item.img_url}
            title={item.tittle}
            price={item.price}
            itemKey={item.key}
          />
        )}
        keyExtractor={item => item.key}
        style={styles.serviceList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f6ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    padding: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 10,
    color: '#333',
  },
  categoryList: {
    marginBottom: 10,
  },
  mainDishesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
    marginBottom: 10,
  },
  serviceList: {
    paddingHorizontal: 10,
  },
});

export default HomeScreen;
