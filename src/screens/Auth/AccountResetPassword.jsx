import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { performPasswordReset } from '../../services/authService';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ResetPasswordProfile = ({ route }) => {
  const { token, email } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp!');
      return;
    }

    try {
      await performPasswordReset({ token, email, newPassword });
      setModalVisible(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra trong quá trình đặt lại mật khẩu.');
    }
  };

  const closeModal = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      navigation.navigate('Login');
    });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "android" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Feather name="lock" size={64} color="#FFA500" style={styles.icon} />
        <Text style={styles.title}>Đặt lại mật khẩu mới</Text>
        <Text style={styles.subtitle}>Vui lòng nhập mật khẩu mới của bạn</Text>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu mới"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Xác nhận mật khẩu"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <Animated.View 
          style={[
            styles.modalOverlay,
            {
              opacity: animation,
              transform: [
                {
                  scale: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1.1, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.modalContainer}>
            <Feather name="check-circle" size={64} color="#4CAF50" style={styles.modalIcon} />
            <Text style={styles.modalText}>Mật khẩu đã được thay đổi thành công!</Text>
            <Pressable style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Đăng nhập</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    width: width * 0.9,
    maxWidth: 400,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  button: {
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: width * 0.9,
    maxWidth: 400,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    width: width * 0.9,
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalIcon: {
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#FFA500',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResetPasswordProfile;