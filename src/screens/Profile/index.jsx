import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { selectUser } from "../../redux/slices/authSlice";
import LogoutButton from "../../components/Auth/LogoutButton";
import styles from "./css/AcouuntStyles";

export default function Account() {
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const [noTokenModalVisible, setNoTokenModalVisible] = useState(false);

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const statuses = [
    { label: "Chờ xác nhận", icon: "time-outline", value: "pending" },
    { label: "Chờ lấy hàng", icon: "cube-outline", value: "pickup" },
    { label: "Đang giao", icon: "bicycle-outline", value: "shipping" },
    { label: "Đánh giá", icon: "star-outline", value: "review" },
  ];

  const handleStatusClick = (status) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => navigation.navigate("MyOrder", { status }));
  };

  // const changeLanguage = (language) => {
  //   setLanguageModalVisible(false);
  //   // Implement language change logic here
  // };

  const handleChangePassword = () => {
    navigation.navigate("AccountResetPassword");
  };

  // useEffect(() => {
  //   const checkToken = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem('token');
  //       if (!token) {
  //         navigation.navigate('Login');
  //       }
  //     } catch (error) {
  //       console.error('Error checking token:', error);
  //     }
  //   };

  //   checkToken();
  // }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const checkToken = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          if (!token) {
            setNoTokenModalVisible(true);
          }
        } catch (error) {
          console.error("Error checking token:", error);
        }
      };

      checkToken();
    }, [])
  );

  const handleLogin = () => {
    setNoTokenModalVisible(false);
    navigation.navigate("Login");
  };

  const handleCancel = () => {
    setNoTokenModalVisible(false);
    navigation.navigate("LandingPage");
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Modal
          visible={noTokenModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setNoTokenModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Bạn chưa có tài khoản</Text>
              <Text style={styles.modalText}>
                Vui lòng đăng nhập để tiếp tục.
              </Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                >
                  <Text style={styles.loginButtonText}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, styles.whiteBackground]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Quản lý tài khoản</Text>
        </View>

        <View style={styles.profileSection}>
          <Image
            source={{
              uri: user.profileImage || "https://via.placeholder.com/100",
            }}
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
                <Ionicons
                  name={item.icon}
                  size={28}
                  color="#FF9900"
                  style={styles.statusIcon}
                />
                <Text style={styles.statusText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.viewAllOrders}
            onPress={() => navigation.navigate("MyOrder", { status: "all" })}
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
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Ionicons name="person-outline" size={24} color="#4A90E2" />
            <Text style={styles.settingText}>Chỉnh sửa hồ sơ</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate("UserShipment")}
          >
            <Ionicons name="location-outline" size={24} color="#FF9900" />
            <Text style={styles.settingText}>Địa chỉ của tôi</Text>
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

        <Modal
          visible={noTokenModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setNoTokenModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Bạn chưa có tài khoản</Text>
              <Text style={styles.modalText}>
                Vui lòng đăng nhập để tiếp tục.
              </Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.loginButton]}
                  onPress={handleLogin}
                >
                  <Text style={styles.loginButtonText}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {user && <LogoutButton />}
      </ScrollView>

      {/* change language */}
      {/* <Modal
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
      </Modal> */}
    </SafeAreaView>
  );
}


