import React, { useState } from "react";
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
  discountCode,
  note,
}) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    const actualShipment = shipment?.shipment; // Trích xuất đúng dữ liệu cần thiết

    if (
      selectedOption === "HOME_DELIVERY" &&
      (!actualShipment || !actualShipment.id)
    ) {
      Alert.alert("Lỗi", "Vui lòng chọn địa chỉ giao hàng.");
      return;
    }

    if (!userData?.shipmentDetailID && selectedOption === "HOME_DELIVERY") {
      Alert.alert("Lỗi", "Dữ liệu địa chỉ giao hàng không đầy đủ.");
      return;
    }

    const orderData = {
      fullName: userData?.fullName || "",
      email: userData?.email || "",
      contactPhone: userData?.phoneNumber || "",
      address: userData?.address || "",
      userID: userData.userId || 0,
      shipmentDetailID: actualShipment?.id || 0,
      deliveryMethod: selectedOption,
      gender: userData?.gender || "Unknown",
      branchId: selectedOption === "STORE_PICKUP" ? selectedBranchId : null,
      dateOfReceipt: null,
      discountCode: discountCode || null,
      note: note || null,
      saleOrderDetailCMs: selectedCartItems.map((item) => ({
        productId: item.id,
        productName: item.productName,
        productCode: item.productCode,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
    };

    try {
      // console.log("Placing order with data:", orderData);
      const response = await placedOrder(orderData);
      Alert.alert("Thành công", "Đơn hàng của bạn đã được đặt thành công!");
      navigation.navigate("OrderSuccess", {
        orderID: response.data.saleOrderId,
        orderCode: response.data.orderCode,
      });
    } catch (error) {
      console.error("Checkout error:", error);
      Alert.alert("Lỗi", error.message || "Không thể hoàn tất đơn hàng.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.checkoutButton}
      onPress={handleCheckout}
      disabled={isLoading}
    >
      <Text style={styles.checkoutButtonText}>
        {isLoading ? "Đang xử lý..." : "Hoàn tất đơn hàng"}
      </Text>
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
