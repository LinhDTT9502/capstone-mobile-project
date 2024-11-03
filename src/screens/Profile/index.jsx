import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { selectUser } from '../../redux/slices/authSlice';
import LogoutButton from '../../components/LogoutButton';

export default function Account() {
  const navigation = useNavigation();
  const user = useSelector(selectUser);

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const statuses = [
    { label: 'Chờ xác nhận', icon: 'time-outline', value: 'pending' },
    { label: 'Chờ lấy hàng', icon: 'cube-outline', value: 'pickup' },
    { label: 'Đang giao', icon: 'bicycle-outline', value: 'shipping' },
    { label: 'Đánh giá', icon: 'star-outline', value: 'review' },
  ];

  const handleStatusClick = (status) => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => navigation.navigate('MyOrder', { status }));
  };

  // const changeLanguage = (language) => {
  //   setLanguageModalVisible(false);
  //   // Implement language change logic here
  // };

  const handleChangePassword = () => {
    navigation.navigate('AccountResetPassword');
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.navigate('Login'); 
        }
      } catch (error) {
        console.error('Error checking token:', error);
      }
    };

    checkToken();
  }, [navigation]);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Quản lý tài khoản</Text>
        </View>

        <View style={styles.profileSection}>

      <Image
        source={{ uri: user.profileImage || 'https://via.placeholder.com/100' }}
        style={styles.profileImage}
      />
      <Text style={styles.profileName}>{user.FullName}</Text>
      <Text style={styles.profileId}>Mã tài khoản: {user.UserId}</Text>
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
                <Ionicons name={item.icon} size={28} color="#FF9900" style={styles.statusIcon} />
                <Text style={styles.statusText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.viewAllOrders}
            onPress={() => navigation.navigate('MyOrder', { status: 'all' })}
          >
            <Text style={styles.viewAllOrdersText}>Xem tất cả đơn hàng</Text>
            <Ionicons name="chevron-forward" size={20} color="#FF9900" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Cài đặt tài khoản</Text>
          {/* <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setLanguageModalVisible(true)}
          >
            <Ionicons name="language-outline" size={24} color="#4A90E2" />
            <Text style={styles.settingText}>Ngôn ngữ</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity> */}
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

        {user && (
          <LogoutButton />
        )}
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
    paddingTop: 30,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
    marginHorizontal: 10,
    marginTop: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#FF9900',
  },
  profileName: {
    fontSize: 22,
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
    padding: 20,
    marginBottom: 15,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#FF9900',
    paddingBottom: 10,
  },
  statusMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statusButton: {
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 12,
    width: 80,
  },
  iconContainer: {
    backgroundColor: '#FF9900',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
  viewAllOrders: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 10,
  },
  viewAllOrdersText: {
    fontSize: 16,
    color: '#FF9900',
    fontWeight: 'bold',
  },
  settingsSection: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 10,
    elevation: 3,
    marginHorizontal: 10,
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
    elevation: 3,
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
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  languageOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  languageText: {
    fontSize: 18,
    color: '#333',
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: '#FF9900',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  notLoggedInText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  authButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  authButton: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  authButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusIcon: {
    marginBottom: 8,
  },
});