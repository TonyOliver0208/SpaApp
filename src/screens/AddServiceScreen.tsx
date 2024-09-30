import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import MyText from '../components/MyText';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

function AddServiceScreen({navigation}) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesSnapshot = await firestore()
        .collection('categories')
        .get();
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        ...doc.data(),
        key: doc.id,
      }));
      setCategories(categoriesData);
    };

    fetchCategories();
  }, []);

  const validateInputs = () => {
    if (title.trim().length === 0) {
      Alert.alert('Invalid Input', 'Title cannot be empty');
      return false;
    }
    if (
      price.trim().length === 0 ||
      isNaN(parseFloat(price)) ||
      parseFloat(price) <= 0
    ) {
      Alert.alert('Invalid Input', 'Price must be a positive number');
      return false;
    }
    if (description.trim().length === 0) {
      Alert.alert('Invalid Input', 'Description cannot be empty');
      return false;
    }
    if (
      imageUrl.trim().length === 0 ||
      !imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|avif)$/i)
    ) {
      Alert.alert('Invalid Input', 'Please enter a valid image URL');
      return false;
    }
    if (categoryId.trim().length === 0) {
      Alert.alert('Invalid Input', 'Please select a category');
      return false;
    }
    return true;
  };

  const handleAddService = async () => {
    if (!validateInputs()) return;

    try {
      await firestore()
        .collection('services')
        .add({
          title: title.trim(),
          price: parseFloat(price),
          description: description.trim(),
          img_url: imageUrl.trim(),
          categoryId,
          rating: 0,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      Alert.alert('Success', 'Service added successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding service:', error);
      Alert.alert('Error', 'Failed to add service');
    }
  };

  return (
    <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6347" />
      <LinearGradient
        colors={['#FF6347', '#FF7F50']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <MyText style={styles.headerTitle}>Add New Service</MyText>
        <View style={{width: 24}} />
      </LinearGradient>
      <ScrollView style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <MyText style={styles.inputLabel}>Title</MyText>
          <TextInput
            style={styles.input}
            placeholder="Enter title"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>
        <View style={styles.inputContainer}>
          <MyText style={styles.inputLabel}>Price</MyText>
          <TextInput
            style={styles.input}
            placeholder="Enter price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <MyText style={styles.inputLabel}>Description</MyText>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={500}
          />
        </View>
        <View style={styles.inputContainer}>
          <MyText style={styles.inputLabel}>Image URL</MyText>
          <TextInput
            style={styles.input}
            placeholder="Enter image URL"
            value={imageUrl}
            onChangeText={setImageUrl}
          />
        </View>
        <View style={styles.inputContainer}>
          <MyText style={styles.inputLabel}>Category</MyText>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={categoryId}
              style={styles.picker}
              onValueChange={itemValue => setCategoryId(itemValue)}>
              <Picker.Item label="Select a category" value="" />
              {categories.map(category => (
                <Picker.Item
                  key={category.key}
                  label={category.title}
                  value={category.key}
                />
              ))}
            </Picker>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleAddService}>
          <MyText style={styles.buttonText}>Add Service</MyText>
        </TouchableOpacity>
      </ScrollView>
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
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default AddServiceScreen;
