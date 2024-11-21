import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { updatePassword } from "../../services/authService";
import { selectUser } from "../../redux/slices/authSlice";

const { width } = Dimensions.get("window");

const ResetPasswordProfile = () => {
  const user = useSelector(selectUser);
  const userId = user?.UserId || ""; // Lấy ID người dùng từ Redux
  const navigation = useNavigation();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Hàm xử lý đổi mật khẩu
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      await updatePassword(userId, newPassword); // Gửi request đổi mật khẩu
      Alert.alert("Thành công", "Mật khẩu của bạn đã được thay đổi!");
      navigation.goBack(); // Quay lại màn hình trước
    } catch (error) {
      console.error("Error resetting password:", error);
      Alert.alert(
        "Lỗi",
        error?.response?.data?.title || "Không thể đặt lại mật khẩu."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Thay đổi mật khẩu</Text>
        <Text style={styles.subtitle}>
          Nhập mật khẩu mới của bạn để cập nhật.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu mới"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Xác nhận mật khẩu mới"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Đổi mật khẩu</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    height: 50,
    width: width * 0.9,
    maxWidth: 400,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#FFF",
  },
  button: {
    backgroundColor: "#FFA500",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    width: width * 0.9,
    maxWidth: 400,
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ResetPasswordProfile;
