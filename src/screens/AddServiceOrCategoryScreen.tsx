import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useRoute} from '@react-navigation/native';

const AddServiceOrCategory = ({navigation}) => {
  const {params} = useRoute();

  const IS_EDIT = params?.isEdit;

  const [catgName, setCatgName] = useState('');
  const [catgImageURL, setCatgImageURL] = useState('');

  const addCategory = () => {
    firestore().collection('catagories').add({
      title: catgName,
      imageURL: catgImageURL,
    });
    navigation.goBack();
  };

  const [serviceTitle, setServiceTitle] = useState(IS_EDIT ? params.title : '');
  const [serviceImageURL, setServiceImageURL] = useState(
    IS_EDIT ? params.image : '',
  );
  const [servicePrice, setServicePrice] = useState(
    IS_EDIT ? params.price.toString() : '',
  );

  const addservice = () => {
    firestore()
      .collection('services')
      .add({
        imageURL: serviceImageURL,
        tittle: serviceTitle,
        price: servicePrice,
      })
      .then(res => {
        Alert.alert('service Added');
        navigation.goBack();
      })
      .catch(err => {
        console.log(err);
        Alert.alert('Error Happen');
      });
  };

  const editservice = () => {
    firestore()
      .collection('services')
      .doc(params?.itemKey)
      .update({
        imageURL: serviceImageURL,
        tittle: serviceTitle,
        price: servicePrice,
      })
      .then(res => {
        Alert.alert('service Updated');
        navigation.goBack();
      })
      .catch(err => {
        console.log(err);
        Alert.alert('Error Happen');
      });
  };

  return (
    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <TextInput
        placeholder="Category Name"
        value={catgName}
        onChangeText={text => setCatgName(text)}
      />
      <TextInput
        placeholder="Category Image URL"
        value={catgImageURL}
        onChangeText={text => setCatgImageURL(text)}
      />
      <Button title="Add Category" onPress={addCategory} />

      <TextInput
        style={{marginTop: 50}}
        placeholder="service Title"
        value={serviceTitle}
        onChangeText={text => setServiceTitle(text)}
      />

      <TextInput
        placeholder="service Image URL"
        value={serviceImageURL}
        onChangeText={text => setServiceImageURL(text)}
      />

      <TextInput
        placeholder="service Price"
        value={servicePrice}
        onChangeText={text => setServicePrice(text)}
      />

      {IS_EDIT ? (
        <Button title="Edit service" onPress={editservice} />
      ) : (
        <Button title="Add service" onPress={addservice} />
      )}
    </View>
  );
};

export default AddServiceOrCategory;

const styles = StyleSheet.create({});
