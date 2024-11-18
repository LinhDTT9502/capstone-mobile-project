import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  primary: "#3366FF",
  secondary: "#FF8800",
  white: "#FFFFFF",
  gray: "#BDC3C7",
  lightGray: "#F0F0F0",
  dark: "#2C3E50",
};

const PaymentMethod = ({ selectedOption, handleOptionChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phương thức thanh toán</Text>
      <View style={styles.options}>
        {/* Cash on Delivery Option */}
        <TouchableOpacity
          style={[
            styles.optionContainer,
            selectedOption === "1" && styles.selectedOption,
          ]}
          onPress={() => handleOptionChange("1")}
        >
          <Ionicons
            name="cash-outline"
            size={24}
            color={selectedOption === "1" ? COLORS.primary : COLORS.dark}
            style={styles.icon}
          />
          <Text
            style={[
              styles.optionText,
              selectedOption === "1" && styles.selectedOptionText,
            ]}
          >
            Thanh toán khi nhận hàng
          </Text>
        </TouchableOpacity>
        {selectedOption === "1" && (
          <Text style={styles.description}>
            Bạn sẽ thanh toán khi nhận hàng.
          </Text>
        )}

        {/* Bank Transfer Option */}
        <TouchableOpacity
          style={[
            styles.optionContainer,
            selectedOption === "2" && styles.selectedOption,
          ]}
          onPress={() => handleOptionChange("2")}
        >
          <Ionicons
            name="card-outline"
            size={24}
            color={selectedOption === "2" ? COLORS.primary : COLORS.dark}
            style={styles.icon}
          />
          <Text
            style={[
              styles.optionText,
              selectedOption === "2" && styles.selectedOptionText,
            ]}
          >
            Chuyển khoản ngân hàng
          </Text>
        </TouchableOpacity>
        {selectedOption === "2" && (
          <Text style={styles.description}>
            Thanh toán qua tài khoản ngân hàng.
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginVertical: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 12,
  },
  options: {
    flexDirection: "column",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
    marginBottom: 8,
    backgroundColor: COLORS.white,
  },
  selectedOption: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.lightGray,
  },
  icon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.dark,
  },
  selectedOptionText: {
    fontWeight: "bold",
    color: COLORS.primary,
  },
  description: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
    marginBottom: 12,
    backgroundColor: COLORS.lightGray,
    padding: 8,
    borderRadius: 8,
  },
});

export default PaymentMethod;
