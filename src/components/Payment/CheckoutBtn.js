import React from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { placedOrder } from "../../services/Checkout/checkoutService";

const COLORS = {
  primary: "#3366FF",
  secondary: "#FF8800",
  white: "#FFFFFF",
};

const CheckoutBtn = ({
  selectedOption,
  shipment,
  selectedBranchId,
  selectedCartItems,
  userData,
}) => {
  const navigation = useNavigation();

  const handleCheckout = async () => {
    if (selectedOption === "HOME_DELIVERY" && !shipment) {
      Alert.alert("Lỗi", "Vui lòng chọn địa chỉ giao hàng.");
      return;
    }

    if (selectedOption === "STORE_PICKUP" && !selectedBranchId) {
      Alert.alert("Lỗi", "Vui lòng chọn chi nhánh nhận hàng.");
      return;
    }

    const orderData = {
      ...userData,
      deliveryMethod: selectedOption,
      saleOrderDetailCMs: selectedCartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
    };

    try {
      const response = await placedOrder(orderData);
      Alert.alert("Thành công", "Đơn hàng của bạn đã được đặt thành công!");
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Không thể hoàn tất đơn hàng.");
    }
  };

  return (
    <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
      <Text style={styles.checkoutButtonText}>Hoàn tất đơn hàng</Text>
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
