import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MyText from '../components/MyText';
import Search from '../components/Search';
import Category from '../components/Category';
import firestore from '@react-native-firebase/firestore';
import ServiceCard from '../components/ServiceCard';
import auth from '@react-native-firebase/auth';
import {LoadingIndicator} from '../components';
import LinearGradient from 'react-native-linear-gradient';

function HomeScreen({navigation}) {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const categoriesSubscriber = firestore()
      .collection('categories')
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

  const handleCategoryPress = categoryDocId => {
    navigation.navigate('CategoryServices', {categoryDocId});
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6347" />
      <LinearGradient
        colors={['#FF6347', '#FF7F50']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <View style={styles.headerContent}>
          <MyText style={styles.headerTitle}>KAMI SPA</MyText>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              style={styles.headerButton}>
              <Icon name="person-outline" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.headerButton}>
              <Icon name="log-out-outline" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      <View style={styles.contentContainer}>
        <Search />
        <View style={styles.categoryHeader}>
          <MyText style={styles.sectionTitle}>Categories</MyText>
          <TouchableOpacity onPress={() => navigation.navigate('AddCategory')}>
            <Icon name="add-circle-outline" size={24} color="#FF6347" />
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          renderItem={({item}) => (
            <Category
              title={item.title}
              image={item.imageURL}
              onPress={handleCategoryPress}
              docId={item.key}
            />
          )}
          keyExtractor={item => item.key}
          style={styles.categoryList}
        />
        <View style={styles.mainDishesHeader}>
          <MyText style={styles.sectionTitle}>Main Services</MyText>
          <TouchableOpacity onPress={() => navigation.navigate('AddService')}>
            <Icon name="add-circle-outline" size={24} color="#FF6347" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={services}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ServiceDetail', {service: item})
              }>
              <ServiceCard
                image={item.img_url}
                title={item.title}
                price={item.price}
                itemKey={item.key}
              />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.key}
          style={styles.serviceList}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#f7f6ff',
  // },
  // header: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   paddingHorizontal: 20,
  //   marginBottom: 20,
  // },
  // headerTitle: {
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   color: '#333',
  // },
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
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f6ff',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 1,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 15,
    padding: 5,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 20,
  },
});

export default HomeScreen;
