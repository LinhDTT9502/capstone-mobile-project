import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faExchangeAlt, faBox, faUserEdit, faKey, faBuilding, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

export default function Account() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faUserEdit} size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Melissa Mayer</Text>
        <Text style={styles.profileId}>Unique ID: 954-810</Text>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('FavoriteItems')}>
          <FontAwesomeIcon icon={faHeart} size={20} color="#FF6B6B" />
          <Text style={styles.settingText}>Favorite items</Text>
          <FontAwesomeIcon icon={faUserEdit} size={16} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('ExchangedItems')}>
          <FontAwesomeIcon icon={faExchangeAlt} size={20} color="#4A90E2" />
          <Text style={styles.settingText}>Exchanged items</Text>
          <FontAwesomeIcon icon={faUserEdit} size={16} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('MyOrders')}>
          <FontAwesomeIcon icon={faBox} size={20} color="#FF9900" />
          <Text style={styles.settingText}>My Orders</Text>
          <FontAwesomeIcon icon={faUserEdit} size={16} color="#999" />
        </TouchableOpacity>

        <View style={styles.separator} />

        <Text style={styles.sectionTitle}>Settings</Text>

        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('EditProfile')}>
          <FontAwesomeIcon icon={faUserEdit} size={20} color="#4A90E2" />
          <Text style={styles.settingText}>Edit Profile</Text>
          <FontAwesomeIcon icon={faUserEdit} size={16} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('ChangePassword')}>
          <FontAwesomeIcon icon={faKey} size={20} color="#4CAF50" />
          <Text style={styles.settingText}>Change Password</Text>
          <FontAwesomeIcon icon={faUserEdit} size={16} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('ChangeToBusiness')}>
          <FontAwesomeIcon icon={faBuilding} size={20} color="#FF5722" />
          <Text style={styles.settingText}>Change to Business account</Text>
          <FontAwesomeIcon icon={faUserEdit} size={16} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutItem} onPress={() => navigation.navigate('Logout')}>
          <FontAwesomeIcon icon={faSignOutAlt} size={20} color="#F44336" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileId: {
    fontSize: 14,
    color: '#666',
  },
  settingsSection: {
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginLeft: 10,
  },
  separator: {
    height: 10,
    backgroundColor: '#F0F0F0',
    marginVertical: 20,
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutText: {
    fontSize: 16,
    color: '#F44336',
    marginLeft: 10,
  },
});
