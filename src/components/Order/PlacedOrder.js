import { useState } from "react";
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { placedOrder } from "../../services/Checkout/checkoutService";
import { addGuestOrder } from "../../redux/slices/guestOrderSlice";

const PlacedOrder = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const selectedProducts = [] // You'll need to get this data from route.params or Redux store
  const [branchId, setBranchId] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "",
    gender: "",
    email: "",
    phoneNumber: "",
    address: "",
    shipmentDetailID: 0,
  });

  // New state for discountCode and note
  const [discountCode, setDiscountCode] = useState("");
  const [note, setNote] = useState("");

  const totalPrice = selectedProducts.reduce(
    (acc, item) => acc + item.price * item.quantity, 
    0
  );

  const handleOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = {
        fullName: userData.fullName,
        email: userData.email,
        contactPhone: userData.phoneNumber,
        address: userData.address,
        userID: token ? user.UserId : 0,
        shipmentDetailID: userData.shipmentDetailID, 
        deliveryMethod: selectedOption,
        gender: userData.gender,
        branchId: selectedOption === "STORE_PICKUP" ? branchId : null,
        dateOfReceipt: null,
        discountCode: discountCode || null,
        note: note || null,
        saleOrderDetailCMs: selectedProducts.map((item) => ({
          productId: item.id,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
      };

      const response = await placedOrder(data);

      if (response) {
        // Check if user is a guest (no token)
        const token = localStorage.getItem("token");
        if (!token) {
          dispatch(addGuestOrder(response.data));
        }
        setOrderSuccess(true);
        navigation.navigate("OrderSuccess", {
          orderID: response.data.saleOrderId,
          orderCode: response.data.orderCode,
        });
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      Alert.alert("Error", "Something went wrong during checkout. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.header}>Phương thức nhận hàng</Text>
        {/* Render order form here */}
        <View style={styles.section}>
          <Text style={styles.label}>Mã ưu đãi</Text>
          <TextInput
            style={styles.input}
            value={discountCode}
            onChangeText={setDiscountCode}
            placeholder="Nhập mã ưu đãi"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Ghi chú</Text>
          <TextInput
            style={styles.input}
            value={note}
            onChangeText={setNote}
            placeholder="Ghi chú"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Tổng cộng</Text>
          <Text style={styles.price}>{totalPrice.toLocaleString()} VND</Text>
        </View>

        <Button title="Hoàn tất đơn hàng" onPress={handleOrder} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  form: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6600",
  },
});

export default PlacedOrder;
