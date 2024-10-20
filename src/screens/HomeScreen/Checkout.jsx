import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import BottomNavigation from "../../components/BottomNavigation";

export default function Checkout({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.orderSummary}>
          <Text style={styles.summaryLabel}>Order</Text>
          <Text style={styles.summaryValue}>7,000</Text>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>30</Text>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>7,030</Text>
        </View>

        <View style={styles.addressSection}>
          <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
          <Text style={styles.addressText}>abc | 0325488480</Text>
          <Text style={styles.addressText}>
            123 Làng Tăng Phú, Tăng Nhơn Phú A, Thủ Đức, Thành Phố Hồ Chí Minh,
            Việt Nam
          </Text>
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <TouchableOpacity style={styles.paymentOption}>
            <Text style={styles.paymentText}>VISA ********2109</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentOption}>
            <Text style={styles.paymentText}>PayPal ********2109</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentOption}>
            <Text style={styles.paymentText}>Cash</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate("PaymentDetail")}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>

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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  orderSummary: {
    marginBottom: 24,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  addressSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: "#333",
  },
  paymentSection: {
    marginBottom: 24,
  },
  paymentOption: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  paymentText: {
    fontSize: 14,
    color: "#333",
  },
  continueButton: {
    backgroundColor: "#FF9900",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
