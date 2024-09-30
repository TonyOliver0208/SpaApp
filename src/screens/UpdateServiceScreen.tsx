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

function UpdateServiceScreen({route, navigation}) {
  const {
    itemKey,
    title: initialTitle,
    price: initialPrice,
    image: initialImage,
  } = route.params;

  const [title, setTitle] = useState(initialTitle);
  const [price, setPrice] = useState(initialPrice.toString());
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(initialImage);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchServiceDetails = async () => {
      const serviceDoc = await firestore()
        .collection('services')
        .doc(itemKey)
        .get();
      if (serviceDoc.exists) {
        const data = serviceDoc.data();
        setDescription(data.description || '');
        setCategoryId(data.categoryId || '');
      }
    };

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

    fetchServiceDetails();
    fetchCategories();
  }, [itemKey]);

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

  const handleUpdateService = async () => {
    if (!validateInputs()) return;

    try {
      await firestore()
        .collection('services')
        .doc(itemKey)
        .update({
          title: title.trim(),
          price: parseFloat(price),
          description: description.trim(),
          img_url: imageUrl.trim(),
          categoryId,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      Alert.alert('Success', 'Service updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating service:', error);
      Alert.alert('Error', 'Failed to update service');
    }
  };

  return (
    <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f6ff" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <MyText style={styles.headerTitle}>Update Service</MyText>
          <View style={{width: 24}} />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <MyText style={styles.inputLabel}>Title</MyText>
            <TextInput
              style={styles.input}
              placeholder="Enter title (required)"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          <View style={styles.inputContainer}>
            <MyText style={styles.inputLabel}>Price</MyText>
            <TextInput
              style={styles.input}
              placeholder="Enter price (required)"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <MyText style={styles.inputLabel}>Description</MyText>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter description (required)"
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

          <TouchableOpacity style={styles.button} onPress={handleUpdateService}>
            <MyText style={styles.buttonText}>Update Service</MyText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f6ff',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default UpdateServiceScreen;
