import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signUpUser } from "../../services/authService";

const SignUpScreen = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Email validation regex
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSignUp = async () => {
    if (!fullName || !username || !email || !password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Lỗi", "Email không hợp lệ!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu không khớp!");
      return;
    }

    setLoading(true);

    try {
      const userData = { fullName, username, email, password };
      const response = await signUpUser(userData);
      Alert.alert("Thành công", "Tài khoản đã được tạo thành công!");
      navigation.navigate("Login");
    } catch (error) {
      if (error.response) {
        Alert.alert(
          "Lỗi",
          `Lỗi từ máy chủ: ${
            error.response.data.message || "Vui lòng thử lại sau."
          }`
        );
      } else if (error.request) {
        Alert.alert("Lỗi", "Không thể kết nối đến máy chủ.");
      } else {
        Alert.alert("Lỗi", `Có lỗi xảy ra: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.shape1} />
      <View style={styles.shape2} />

      <Text style={styles.title}>Đăng ký</Text>
      <Text style={styles.subtitle}>Tạo tài khoản mới</Text>

      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Mật khẩu"
          secureTextEntry={secureTextEntry}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setSecureTextEntry(!secureTextEntry)}
          style={styles.eyeIconContainer}
        >
          <Text style={styles.eyeIcon}>👁️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Xác nhận mật khẩu"
          secureTextEntry={confirmSecureTextEntry}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setConfirmSecureTextEntry(!confirmSecureTextEntry)}
          style={styles.eyeIconContainer}
        >
          <Text style={styles.eyeIcon}>👁️</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.signupButton}
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.signupButtonText}>Tạo tài khoản</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.signInLink}>Đã có tài khoản? Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  shape1: {
    position: "absolute",
    width: 250,
    height: 250,
    backgroundColor: "#FFA500",
    borderRadius: 125,
    top: -100,
    right: -50,
    opacity: 0.5,
  },
  shape2: {
    position: "absolute",
    width: 300,
    height: 300,
    backgroundColor: "#FFA500",
    borderRadius: 150,
    bottom: -150,
    left: -50,
    opacity: 0.7,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "left",
    color: "#888",
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
  },
  passwordInput: {
    flex: 1,
    // paddingLeft: 10,
    fontSize: 16,
    height: 50,
  },
  eyeIconContainer: {
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  eyeIcon: {
    fontSize: 20,
    color: "#888",
  },
  signupButton: {
    backgroundColor: "#FFA500",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginBottom: 15,
  },
  signupButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  signInLink: {
    color: "#FFA500",
    textAlign: "center",
    fontSize: 14,
  },
});

export default SignUpScreen;
