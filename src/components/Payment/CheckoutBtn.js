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
  discountCode,
  note,
  selectedCartItems,
  user,
}) => {
  const navigation = useNavigation();

  const handleCheckout = async () => {
    // Validate shipment or branch based on selected option
    if (selectedOption === "HOME_DELIVERY" && !shipment) {
      Alert.alert("Lỗi", "Vui lòng chọn địa chỉ giao hàng.");
      return;
    }

    if (selectedOption === "STORE_PICKUP" && !selectedBranchId) {
      Alert.alert("Lỗi", "Vui lòng chọn chi nhánh nhận hàng.");
      return;
    }

    // Validate cart items
    if (!selectedCartItems || selectedCartItems.length === 0) {
      Alert.alert("Lỗi", "Giỏ hàng trống. Vui lòng thêm sản phẩm để tiếp tục.");
      return;
    }

    try {
      const deliveryDetails = {
        userId: user?.UserId,
        shipmentId: selectedOption === "HOME_DELIVERY" ? shipment?.id : null,
        deliveryMethod: selectedOption,
        branchId: selectedOption === "STORE_PICKUP" ? selectedBranchId : null,
        discountCode: discountCode || null,
        note: note || null,
      };

      // Gọi API đặt hàng
      const response = await placedOrder(
        selectedCartItems,
        user,
        deliveryDetails
      );

      if (response?.paymentLink) {
        // Điều hướng tới trang thanh toán qua VNPay
        navigation.navigate("PaymentWebView", {
          url: response.paymentLink,
        });
      } else {
        Alert.alert("Thành công", "Đơn hàng của bạn đã được đặt thành công!");
        navigation.navigate("OrderConfirmation", {
          orderDetails: {
            items: selectedCartItems,
            delivery: deliveryDetails,
            user,
          },
        });
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      Alert.alert(
        "Lỗi",
        "Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau."
      );
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
