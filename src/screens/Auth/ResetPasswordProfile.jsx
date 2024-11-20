import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  resendOtpRequest,
  performPasswordReset,
} from "../../services/authService";
import { selectUser } from "../../redux/slices/authSlice";

const { width } = Dimensions.get("window");

const ResetPasswordProfile = () => {
  const user = useSelector(selectUser);
  const email = user?.email || "";
  const userName = user?.userName || "";
  const navigation = useNavigation();

  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const otpInputs = useRef([]);

  // Hàm gửi OTP
  const handleSendOtp = async () => {
    try {
      if (!email || !userName) {
        Alert.alert(
          "Lỗi",
          "Không tìm thấy thông tin tài khoản hoặc email. Vui lòng đăng nhập lại."
        );
        console.error("Missing userName or email:", { userName, email });
        return;
      }

      await resendOtpRequest({ userName, email }); // Gửi OTP qua API
      setIsOtpSent(true);
      Alert.alert("Thành công", "Mã OTP đã được gửi tới email của bạn!");
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert(
        "Lỗi",
        error?.response?.data?.title || "Không thể gửi OTP. Vui lòng thử lại."
      );
    }
  };

  // Hàm reset mật khẩu
  const handleResetPassword = async () => {
    const otpString = otpCode.join("");
    if (!otpString || !newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      await performPasswordReset({ otpCode: otpString, email, newPassword }); // Gửi request đổi mật khẩu
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

  // Hàm xử lý nhập OTP từng ô
  const handleOtpChange = (value, index) => {
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Chuyển focus sang ô tiếp theo
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
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
          {isOtpSent
            ? "Nhập mã OTP và mật khẩu mới của bạn"
            : "Chúng tôi sẽ gửi mã OTP tới email của bạn."}
        </Text>

        {/* Nếu OTP chưa gửi, hiển thị nút Gửi OTP */}
        {!isOtpSent ? (
          <>
            <Text style={styles.emailText}>Email: {email}</Text>
            <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
              <Text style={styles.buttonText}>Gửi OTP</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.otpContainer}>
              {otpCode.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  ref={(input) => (otpInputs.current[index] = input)}
                />
              ))}
            </View>
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
            <TouchableOpacity
              style={styles.button}
              onPress={handleResetPassword}
            >
              <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
            </TouchableOpacity>
          </>
        )}
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
  emailText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "80%",
  },
  otpInput: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    fontSize: 24,
    textAlign: "center",
    backgroundColor: "#FFF",
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
});

export default ResetPasswordProfile;
