import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import MyText from '../components/MyText';

function AddCategoryScreen({navigation}) {
  const [title, setTitle] = useState('');
  const [imageURL, setImageURL] = useState('');
  const insets = useSafeAreaInsets();

  const validateInputs = () => {
    if (title.trim().length === 0) {
      Alert.alert('Invalid Input', 'Category title cannot be empty');
      return false;
    }
    if (
      imageURL.trim().length === 0 ||
      !imageURL.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|avif)$/i)
    ) {
      Alert.alert('Invalid Input', 'Please enter a valid image URL');
      return false;
    }
    return true;
  };

  const handleAddCategory = async () => {
    if (!validateInputs()) return;

    try {
      await firestore().collection('categories').add({
        title: title.trim(),
        imageURL: imageURL.trim(),
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      Alert.alert('Success', 'Category added successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding category:', error);
      Alert.alert('Error', 'Failed to add category');
    }
  };

  return (
    <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f6ff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <MyText style={styles.headerTitle}>Add Category</MyText>
            <View style={{width: 24}} />
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Icon
                name="pricetag-outline"
                size={24}
                color="#FF6347"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Category Title (required)"
                value={title}
                onChangeText={setTitle}
                maxLength={50}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon
                name="image-outline"
                size={24}
                color="#FF6347"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Image URL (required)"
                value={imageURL}
                onChangeText={setImageURL}
              />
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddCategory}>
              <MyText style={styles.addButtonText}>Add Category</MyText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f6ff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
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
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddCategoryScreen;
