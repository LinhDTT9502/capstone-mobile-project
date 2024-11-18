import React from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { processCheckout } from "../../services/SaleOrderService";

const COLORS = {
  primary: "#3366FF",
  secondary: "#FF8800",
  white: "#FFFFFF",
};

const CheckoutBtn = ({
  //   selectedOption,
  //   shipment,
  //   selectedBranchId,
  //   discountCode,
  //   note,
  //   userData,
  //   selectedCartItems,
  //   user,

  selectedCartItems,
}) => {
  const navigation = useNavigation();

  //   const handleCheckout = async () => {
  //     // Validate shipment or branch based on selected option
  //     if (selectedOption === "HOME_DELIVERY" && !shipment) {
  //       Alert.alert("Error", "Please select a delivery address.");
  //       return;
  //     }

  //     if (selectedOption === "STORE_PICKUP" && !selectedBranchId) {
  //       Alert.alert("Error", "Please select a branch.");
  //       return;
  //     }

  //     // Validate cart items
  //     if (!selectedCartItems || selectedCartItems.length === 0) {
  //       Alert.alert("Error", "Your cart is empty. Please add items to proceed.");
  //       return;
  //     }

  //     try {
  //       const deliveryDetails = {
  //         userId: user?.UserId,
  //         shipmentId: selectedOption === "HOME_DELIVERY" ? shipment?.id : null,
  //         deliveryMethod: selectedOption,
  //         branchId: selectedOption === "STORE_PICKUP" ? selectedBranchId : null,
  //         discountCode: discountCode || null,
  //         note: note || null,
  //       };

  //       const response = await processCheckout(
  //         selectedCartItems,
  //         userData,
  //         deliveryDetails
  //       );

  //       if (response?.paymentLink) {
  //         navigation.navigate("PaymentWebView", {
  //           url: response.paymentLink,
  //         });
  //       } else {
  //         Alert.alert("Success", "Your order has been placed successfully!");
  //         navigation.navigate("OrderConfirmation", {
  //           orderDetails: {
  //             items: selectedCartItems,
  //             delivery: deliveryDetails,
  //             userData: userData,
  //           },
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Error during checkout:", error);
  //       Alert.alert(
  //         "Error",
  //         "Something went wrong during checkout. Please try again."
  //       );
  //     }
  //   };
  const handleCheckout = () => {
    if (!selectedCartItems || selectedCartItems.length === 0) {
      Alert.alert("Error", "Your cart is empty. Please add items to proceed.");
      return;
    }

    // Proceed with checkout logic...
  };
  return (
    <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
      <Text style={styles.checkoutButtonText}>Complete Order</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkoutButton: {
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 32,
  },
  checkoutButtonText: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: "bold",
  },
});

export default CheckoutBtn;
