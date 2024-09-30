import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import MyText from '../components/MyText';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

function UpdateCategoryScreen({route, navigation}) {
  const {categoryDocId, categoryName} = route.params;
  const [title, setTitle] = useState(categoryName);
  const [imageURL, setImageURL] = useState('');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoryDoc = await firestore()
          .collection('categories')
          .doc(categoryDocId)
          .get();
        if (categoryDoc.exists) {
          const data = categoryDoc.data();
          setTitle(data.title);
          setImageURL(data.imageURL);
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        Alert.alert('Error', 'Failed to fetch category details');
      }
    };

    fetchCategory();
  }, [categoryDocId]);

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

  const handleUpdate = async () => {
    if (!validateInputs()) return;

    try {
      await firestore().collection('categories').doc(categoryDocId).update({
        title: title.trim(),
        imageURL: imageURL.trim(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      Alert.alert('Success', 'Category updated successfully');
      navigation.navigate('CategoryServices', {
        categoryDocId,
        updatedCategoryName: title.trim(),
      });
    } catch (error) {
      console.error('Error updating category:', error);
      Alert.alert('Error', 'Failed to update category');
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
          <MyText style={styles.headerTitle}>Update Category</MyText>
          <View style={{width: 24}} />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <MyText style={styles.inputLabel}>Title</MyText>
            <TextInput
              style={styles.input}
              placeholder="Category Title (required)"
              value={title}
              onChangeText={setTitle}
              maxLength={50}
            />
          </View>

          <View style={styles.inputContainer}>
            <MyText style={styles.inputLabel}>Image URL</MyText>
            <TextInput
              style={styles.input}
              placeholder="Image URL (required)"
              value={imageURL}
              onChangeText={setImageURL}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <MyText style={styles.buttonText}>Update Category</MyText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f6ff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UpdateCategoryScreen;
