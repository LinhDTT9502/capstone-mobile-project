import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHeart,
  faBox,
  faUserEdit,
  faKey,
  faSignOutAlt,
  faGlobe,
  faArrowRight,
  faTruck,
  faTimesCircle,
  faUndo,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "../../api/apiAuth";

export default function Account() {
  const navigation = useNavigation();
  const [passwordRequested, setPasswordRequested] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const statuses = [
    { label: "Chờ xác nhận", icon: faTruck, value: "pending" },
    { label: "Chờ lấy hàng", icon: faTruck, value: "pickup" },
    { label: "Đang giao hàng", icon: faTruck, value: "shipping" },
    { label: "Đánh giá", icon: faTruck, value: "review" },
  ];

  const handleStatusClick = (status) => {
    navigation.navigate("MyOrder", { status });
  };

  const changeLanguage = (language) => {
    setLanguageModalVisible(false);
  };

  const handleChangePassword = () => {
    Alert.alert("Thành công", "Thay đổi mật khẩu thành công!", [
      { text: "OK", onPress: () => setPasswordRequested(true) },
    ]);
  };

  if (passwordRequested) {
    navigation.navigate("AccountResetPassword");
  }

  const handleLogout = async () => {
    try {
      const response = await signOut({});
      if (response.status === 200) {
        Alert.alert("Đăng xuất", "Đăng xuất thành công!");
        navigation.navigate("Login");
      } else {
        Alert.alert("Đăng xuất", "Đăng xuất thất bại");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi đăng xuất.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faUserEdit} size={20} color="#333" />
        </TouchableOpacity> */}
        <Text style={styles.title}>Quản lý tài khoản</Text>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{ uri: "https://via.placeholder.com/100" }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Melissa Mayer</Text>
        <Text style={styles.profileId}>Mã tài khoản: 954-810</Text>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Quản lý tài khoản của tôi</Text>

        {/* My Orders */}
        <TouchableOpacity
  style={styles.settingItem}
  onPress={() => navigation.navigate("MyOrder", { status: "all" })} 
>
  <FontAwesomeIcon icon={faBox} size={20} color="#FF9900" />
  <Text style={styles.settingText}>Đơn hàng của tôi</Text>
</TouchableOpacity>

        {/* Status menu styled like Shopee */}
        <View style={styles.statusMenu}>
          {statuses.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={styles.statusButton}
              onPress={() => handleStatusClick(item.value)}
            >
              <FontAwesomeIcon icon={item.icon} size={20} color="#FF9900" />
              <Text style={styles.statusText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* View Sales History */}
        <TouchableOpacity
          style={styles.salesHistory}
          onPress={() => navigation.navigate("MyOrder")}
        >
          <Text style={styles.salesHistoryText}>Xem lịch sử đơn hàng</Text>
          <FontAwesomeIcon icon={faArrowRight} size={20} color="#888" />
        </TouchableOpacity>

        {/* Favorite Items */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate("FavoriteItems")}
        >
          <FontAwesomeIcon icon={faHeart} size={20} color="#FF6B6B" />
          <Text style={styles.settingText}>Danh sách yêu thích</Text>
        </TouchableOpacity>

        {/* Language Setting */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => setLanguageModalVisible(true)}
        >
          <FontAwesomeIcon icon={faGlobe} size={20} color="#4A90E2" />
          <Text style={styles.settingText}>Ngôn ngữ</Text>
        </TouchableOpacity>

        {/* Edit Profile */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <FontAwesomeIcon icon={faUserEdit} size={20} color="#4A90E2" />
          <Text style={styles.settingText}>Chỉnh sửa hồ sơ</Text>
        </TouchableOpacity>

        {/* Change Password */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleChangePassword}
        >
          <FontAwesomeIcon icon={faKey} size={20} color="#4CAF50" />
          <Text style={styles.settingText}>Thay đổi mật khẩu</Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} size={20} color="#F44336" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* Language Modal */}
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
              onPress={() => changeLanguage("en")}
            >
              <Text style={styles.languageText}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => changeLanguage("vi")}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  profileSection: {
    alignItems: "center",
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
    fontWeight: "bold",
    color: "#333",
  },
  profileId: {
    fontSize: 14,
    color: "#666",
  },
  settingsSection: {
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  settingText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginLeft: 10,
  },
  separator: {
    height: 10,
    backgroundColor: "#F0F0F0",
    marginVertical: 20,
  },
  logoutItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  logoutText: {
    fontSize: 16,
    color: "#F44336",
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  languageOption: {
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  languageText: {
    fontSize: 16,
    color: "#333",
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: "#FFA500",
    padding: 10,
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  statusMenu: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-around',
  },
  statusButton: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  statusText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  salesHistory: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  salesHistoryText: {
    fontSize: 16,
    color: '#333',
  },
});
