import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ServiceCard from '../components/ServiceCard';
import MyText from '../components/MyText';
import {LoadingIndicator} from '../components';
import Icon from 'react-native-vector-icons/Ionicons';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';

function CategoryServicesScreen({route, navigation}) {
  const {categoryDocId, updatedCategoryName} = route.params;
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchCategoryName = async () => {
      if (updatedCategoryName) {
        setCategoryName(updatedCategoryName);
      } else {
        const categoryDoc = await firestore()
          .collection('categories')
          .doc(categoryDocId)
          .get();

        if (categoryDoc.exists) {
          setCategoryName(categoryDoc.data().title);
        }
      }
    };

    fetchCategoryName();

    const subscriber = firestore()
      .collection('services')
      .where('categoryId', '==', categoryDocId)
      .onSnapshot(querySnapshot => {
        const servicesData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          key: doc.id,
        }));
        setServices(servicesData);
        setLoading(false);
      });

    return () => subscriber();
  }, [categoryDocId, updatedCategoryName]);

  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  const handleUpdate = () => {
    hideMenu();
    navigation.navigate('UpdateCategory', {categoryDocId, categoryName});
  };

  const handleDelete = () => {
    hideMenu();
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', onPress: deleteCategory, style: 'destructive'},
      ],
    );
  };

  const deleteCategory = async () => {
    try {
      await firestore().collection('categories').doc(categoryDocId).delete();
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting category:', error);
      Alert.alert('Error', 'Failed to delete category');
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <MyText style={styles.title}>{categoryName}</MyText>
        <Menu
          visible={visible}
          anchor={
            <TouchableOpacity onPress={showMenu}>
              <Icon name="ellipsis-vertical" size={24} color="#333" />
            </TouchableOpacity>
          }
          onRequestClose={hideMenu}>
          <MenuItem onPress={handleUpdate}>Update</MenuItem>
          <MenuDivider />
          <MenuItem onPress={handleDelete}>Delete</MenuItem>
        </Menu>
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
        contentContainerStyle={styles.serviceList}
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
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  serviceList: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
});

export default CategoryServicesScreen;
