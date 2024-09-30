import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal, // Import Modal here
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

Icon.loadFont();

const AccountScreen = () => {
  const navigation = useNavigation();
  //   const {t, i18n} = useTranslation();
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);

  const languages = [
    {code: 'en', name: 'English'},
    {code: 'es', name: 'Español'},
    {code: 'fr', name: 'Français'},
    {code: 'hi', name: 'हिंदी'},
    {code: 'vi', name: 'Vietnamese'},
  ];

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
    setLanguageModalVisible(false);
  };

  const renderLanguageItem = ({item}) => (
    <TouchableOpacity
      style={styles.languageItem}
      onPress={() => changeLanguage(item.code)}>
      <Text style={styles.languageText}>{item.name}</Text>
      {i18n.language === item.code && (
        <Icon name="check" size={24} color="#4CAF50" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/girl1.png')}
          style={styles.profileImage}
        />
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>johndoe@example.com</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.option}>
          <Icon name="person" size={24} color="#333" />
          <Text style={styles.optionText}>{t('editProfile')}</Text>
          <Icon name="chevron-right" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => setLanguageModalVisible(true)}>
          <Icon name="language" size={24} color="#333" />
          <Text style={styles.optionText}>{t('changeLanguage')}</Text>
          <Icon name="chevron-right" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Icon name="settings" size={24} color="#333" />
          <Text style={styles.optionText}>{t('settings')}</Text>
          <Icon name="chevron-right" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('CheckoutHistory')}>
          <Icon name="history" size={24} color="#333" />
          <Text style={styles.optionText}>{t('checkoutHistory')}</Text>
          <Icon name="chevron-right" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Icon name="privacy-tip" size={24} color="#333" />
          <Text style={styles.optionText}>{t('privacyPolicy')}</Text>
          <Icon name="chevron-right" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>{t('logout')}</Text>
      </TouchableOpacity>

      <Modal
        visible={isLanguageModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLanguageModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('Language')}</Text>
            <FlatList
              data={languages}
              renderItem={renderLanguageItem}
              keyExtractor={item => item.code}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setLanguageModalVisible(false)}>
              <Text style={styles.closeButtonText}>{t('Close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    paddingVertical: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
  },
  logoutButton: {
    margin: 20,
    backgroundColor: '#ff6347',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  languageText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
