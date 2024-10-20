import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from '../../api/apiAuth';

export default function Account() {
  const navigation = useNavigation();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const statuses = [
    { label: 'Chờ xác nhận', icon: 'time-outline', value: 'pending' },
    { label: 'Chờ lấy hàng', icon: 'cube-outline', value: 'pickup' },
    { label: 'Đang giao', icon: 'bicycle-outline', value: 'shipping' },
    { label: 'Đánh giá', icon: 'star-outline', value: 'review' },
  ];

  const handleStatusClick = (status) => {
    navigation.navigate('MyOrder', { status });
  };

  const changeLanguage = (language) => {
    setLanguageModalVisible(false);
    // Implement language change logic here
  };

  const handleChangePassword = () => {
    navigation.navigate('AccountResetPassword');
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const userId = await AsyncStorage.getItem('userId');
      
      if (!token || !refreshToken || !userId) {
        throw new Error('Thiếu thông tin đăng xuất');
      }
  
      const response = await signOut({
        token,
        refreshToken,
        userId: parseInt(userId),
      });
  
      if (response.status === 200) {
        await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'userId']);
        navigation.navigate('Login');
        Alert.alert('Thành công', 'Đăng xuất thành công!');
      } else {
        throw new Error('Đăng xuất thất bại');
      }
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi đăng xuất');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Quản lý tài khoản</Text>
        </View>

        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>Melissa Mayer</Text>
          <Text style={styles.profileId}>Mã tài khoản: 954-810</Text>
        </View>

        <View style={styles.orderSection}>
          <Text style={styles.sectionTitle}>Đơn hàng của tôi</Text>
          <View style={styles.statusMenu}>
            {statuses.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={styles.statusButton}
                onPress={() => handleStatusClick(item.value)}
              >
                <Ionicons name={item.icon} size={24} color="#FF9900" />
                <Text style={styles.statusText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.viewAllOrders}
            onPress={() => navigation.navigate('MyOrder', { status: 'all' })}
          >
            <Text style={styles.viewAllOrdersText}>Xem tất cả đơn hàng</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Cài đặt tài khoản</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('FavoriteItems')}
          >
            <Ionicons name="heart-outline" size={24} color="#FF6B6B" />
            <Text style={styles.settingText}>Danh sách yêu thích</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setLanguageModalVisible(true)}
          >
            <Ionicons name="language-outline" size={24} color="#4A90E2" />
            <Text style={styles.settingText}>Ngôn ngữ</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Ionicons name="person-outline" size={24} color="#4A90E2" />
            <Text style={styles.settingText}>Chỉnh sửa hồ sơ</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleChangePassword}
          >
            <Ionicons name="key-outline" size={24} color="#4CAF50" />
            <Text style={styles.settingText}>Thay đổi mật khẩu</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={languageModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn ngôn ngữ</Text>
            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => changeLanguage('en')}
            >
              <Text style={styles.languageText}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => changeLanguage('vi')}
            >
              <Text style={styles.languageText}>Tiếng Việt</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setLanguageModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:30,
    backgroundColor: '#F5F7FA',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileId: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  orderSection: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statusMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statusButton: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  viewAllOrders: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  viewAllOrdersText: {
    fontSize: 16,
    color: '#333',
  },
  settingsSection: {
    backgroundColor: '#FFF',
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  logoutButton: {
    margin: 16,
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  languageOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: '#FF9900',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});