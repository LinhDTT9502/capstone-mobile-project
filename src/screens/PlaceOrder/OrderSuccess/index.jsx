import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

const OrderSuccessScreen = ({ route }) => {
  const navigation = useNavigation();
  const { orderID, orderCode } = route.params || {};

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.iconContainer}>
          <FontAwesome5 name="check-circle" size={80} color="#fff" />
        </View>
        <Text style={styles.title}>Đặt hàng thành công!</Text>
        <Text style={styles.message}>Cảm ơn bạn đã đặt hàng.</Text>
        {orderID && orderCode ? (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsText}>
              <Text style={styles.boldText}>Mã đơn hàng:</Text> {orderCode}
            </Text>
            <Text style={styles.detailsText}>
              <Text style={styles.boldText}>ID đơn hàng:</Text> {orderID}
            </Text>
          </View>
        ) : (
          <Text style={styles.errorText}>Lỗi: Thiếu thông tin đơn hàng.</Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("LandingPage")}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Quay về trang chủ</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#4CAF50',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    width: width * 0.9,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  detailsContainer: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    marginBottom: 24,
  },
  detailsText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 4,
  },
  boldText: {
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 16,
    color: "#ff3b30",
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OrderSuccessScreen;

