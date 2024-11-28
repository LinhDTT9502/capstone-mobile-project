import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { placedOrder } from "../../services/Checkout/checkoutService";
import { rental } from "../../services/rentServices";
import { addGuestOrder } from "../../redux/slices/guestOrderSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  tranSportFee = 0,
  type
}) => {
  // console.log("selectedCartItems:", selectedCartItems)
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    const actualShipment = shipment?.shipment;
    if (selectedOption === "HOME_DELIVERY") {
      // if (!actualShipment || !actualShipment.id) {
      //   Alert.alert("Lỗi", "Vui lòng chọn địa chỉ giao hàng.");
      //   return;
      // }
      
      // if (!userData?.shipmentDetailID && selectedOption === "HOME_DELIVERY") {
      //   Alert.alert("Lỗi", "Dữ liệu địa chỉ giao hàng không đầy đủ.");
      //   return;
      // }
    }
    const _selectedCartItems = JSON.parse(JSON.stringify(selectedCartItems))
    const token = await AsyncStorage.getItem("token");
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const totalAmount = _selectedCartItems.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);

    const orderData = {
      customerInformation: {
        ...userData,
        userId: token ? userData.userId ? parseInt(userData.userId): 0 : 0,
        contactPhone: userData.phoneNumber,
        gender: "male",
      },
      deliveryMethod: selectedOption,
      branchId: 0,
      dateOfReceipt: '2024-11-29',
      note: note || '',
      productInformations: selectedCartItems ? selectedCartItems?.map((item) => ({
        ...item,
        unitPrice: item.price,
        productId: item?.id || item?.productId
      })) : [],
      ...(type === 'rent' ?
        {
          rentalCosts: {
            subTotal: totalAmount,
            tranSportFee,
            totalAmount: totalAmount + tranSportFee
          }
        } : {
          saleCosts: {
            subTotal: totalAmount,
            tranSportFee,
            totalAmount: totalAmount + tranSportFee
          }
        }
      )
      
    };

    try {
      const response = type === 'rent' ?  await rental(orderData) : await placedOrder(orderData);

      if (response) {
        if (!token) {
          // If the user is a guest, save the order in Redux
          dispatch(addGuestOrder(response.data));
        }
          // console.log(" handleCheckout ~ response:", response)

        // Alert.alert("Thành công", "Đơn hàng của bạn đã được đặt thành công!");
        navigation.reset({
          index: 0,
          routes: [{ name: "OrderSuccess", params: { id: response.data.id, saleOrderCode: response.data.saleOrderCode } }],
        });
      }
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
