import React from "react";
import { TouchableOpacity, Text, Alert, StyleSheet, } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const LogoutButton = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // const token = await AsyncStorage.getItem('token');
      // if (!token) {
      //   throw new Error('Thiếu thông tin đăng xuất');
      // }
      navigation.navigate('LandingPage', { initialScreen: 'HomeController' });
      // const response = await signOut({
      //   token,
      //   refreshToken,
      //   userId: parseInt(userId),
      // });
      await AsyncStorage.removeItem("token");
      Alert.alert("Thành công", "Đăng xuất thành công!");
      // if (response.status === 200) {
      //   await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'userId']);
      //   navigation.navigate('Login');
      //   Alert.alert('Thành công', 'Đăng xuất thành công!');
      // } else {
      //   throw new Error('Đăng xuất thất bại');
      // }
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi đăng xuất");
    }
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
      <Text style={styles.logoutText}>Đăng xuất</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    margin: 16,
    backgroundColor: "#F44336",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    elevation: 3,
  },
  logoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LogoutButton;
