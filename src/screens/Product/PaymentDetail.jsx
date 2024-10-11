import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import BottomNavigation from "../../components/BottomNavigation";

export default function PaymentDetail({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Payment Details</Text>
      </View>

      <View style={styles.content}>
        <FontAwesomeIcon
          icon={faCheckCircle}
          size={80}
          color="#FF9900"
          style={styles.icon}
        />
        <Text style={styles.successMessage}>Payment done successfully.</Text>
        <Text style={styles.paymentTotal}>2.000.000 VND</Text>

        <View style={styles.detailsSection}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>24 April 2024</Text>
          <Text style={styles.detailLabel}>Order</Text>
          <Text style={styles.detailValue}>1.500.000 VND</Text>
          <Text style={styles.detailLabel}>Shipping</Text>
          <Text style={styles.detailValue}>500.000 VND</Text>
          <Text style={styles.detailLabel}>Total</Text>
          <Text style={styles.detailValue}>2.000.000 VND</Text>
        </View>
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
    alignItems: "center",
  },
  icon: {
    marginVertical: 20,
  },
  successMessage: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  paymentTotal: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF9900",
    marginBottom: 24,
  },
  detailsSection: {
    width: "100%",
    paddingHorizontal: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
});
