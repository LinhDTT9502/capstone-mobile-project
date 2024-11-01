import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // To store and check token
import { authenticateUser } from '@/src/services/authService';
import { useSelector, useDispatch } from "react-redux";
import { login, selectUser } from '@/src/redux/slices/authSlice';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const user = useSelector(selectUser)
  const dispatch = useDispatch();

  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          navigation.navigate('HomeController');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoggedIn();
  }, [navigation]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // if (username && password) {
       
      
      // } else {
      //   Alert.alert('Đăng nhập thất bại', 'Vui lòng nhập tên đăng nhập và mật khẩu.');
      // }
      const decoded = await authenticateUser(username, password);
      dispatch(login(decoded));
      navigation.navigate('HomeController');
    } catch (error) {
      Alert.alert('Lỗi', 'Thông tin đăng nhập không hợp lệ. Vui lòng thử lại.');
      console.log(error);
      
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={styles.container}>
      {/* Background shapes */}
      <View style={styles.shape1} />
      <View style={styles.shape2} />

      {/* Login form */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Đăng nhập vào Goods Exchange</Text>
        <Text style={styles.subtitle}>
          Chào mừng bạn trở lại! Đăng nhập bằng tài khoản xã hội hoặc email để tiếp tục
        </Text>

        {/* Username input */}
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại, email hoặc tên người dùng"
          value={username}
          onChangeText={setUsername}
        />

        {/* Password input */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Mật khẩu"
            secureTextEntry={secureTextEntry}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
            <FontAwesomeIcon icon={secureTextEntry ? faEyeSlash : faEye} size={20} style={styles.eyeIcon} />
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        {/* Login button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          )}
        </TouchableOpacity>

        {/* Register */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Bạn chưa có tài khoản?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.registerLink}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.guestButton}
          onPress={() => navigation.navigate('HomeController')}
        >
          <Text style={styles.guestButtonText}>Tiếp tục với vai trò là Khách</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Add your styles here
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: "#333",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  eyeIconContainer: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  eyeIcon: {
    color: '#888',
  },
  forgotPassword: {
    color: "#FFA500",
    textAlign: "right",
    marginBottom: 20,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#FFA500",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  registerText: {
    color: "#888",
    fontSize: 14,
  },
  registerLink: {
    color: "#FFA500",
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
  guestButton: {
    backgroundColor: "#4A90E2",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginTop: 10,
  },
  guestButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
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
});

export default LoginScreen;
  