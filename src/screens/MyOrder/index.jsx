import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUserOrders } from "../../services/userOrderService";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { selectUser } from "@/src/redux/slices/authSlice";

const MyOrder = () => {
  const user = useSelector(selectUser);
  const navigation = useNavigation();
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const statusList = [
    { label: "Tất cả", value: "Tất cả" },
    { label: "Đang chờ", value: "PENDING" },
    { label: "Đã xác nhận", value: "CONFIRMED" },
    { label: "Đã thanh toán", value: "PAID" },
    { label: "Đang đóng gói", value: "PACKING" },
    { label: "Đang vận chuyển", value: "SHIPPING" },
    { label: "Thành công", value: "SUCCESS" },
    { label: "Tạm hoãn", value: "ON_HOLD" },
  ];

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  const closeProductModal = () => setProductModalOpen(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Lỗi", "Vui lòng đăng nhập để xem đơn hàng.");
        navigation.navigate("Login");
        return;
      }

      let userId = user?.UserId;
      if (!userId) {
        userId = await AsyncStorage.getItem("userId");
      }

      if (!userId) {
        throw new Error("Không tìm thấy userId. Vui lòng đăng nhập lại.");
      }

      const ordersData = await fetchUserOrders(userId, token);

      setOrders(ordersData);
    } catch (err) {
      console.error("Error loading orders:", err);
      setError(err.message || "Không thể tải đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders =
    selectedStatus === "Tất cả"
      ? orders
      : orders.filter((order) => order.orderStatus === selectedStatus);

  const renderOrderStatusButton = (order) => {
    if (order.paymentStatus === "IsWating" && order.deliveryMethod !== "HOME_DELIVERY") {
      return (
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate("PlacedOrder", { selectedOrder: order })}
        >
          <Text style={styles.checkoutText}>Thanh Toán</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => openProductModal(item)}
    >
      <View style={styles.orderInfo}>
        <Image
          source={{
            uri: item.saleOrderDetailVMs?.$values[0]?.imgAvatarPath || "https://via.placeholder.com/100",
          }}
          style={styles.orderImage}
        />
        <View style={styles.orderDetails}>
          <Text style={styles.orderCode}>Mã đơn hàng: {item.orderCode}</Text>
          <Text style={styles.orderStatus}>Trạng thái: {item.orderStatus}</Text>
          <Text style={styles.orderTotal}>
            Tổng tiền: {item.totalAmount.toLocaleString("vi-VN")} ₫
          </Text>
        </View>
      </View>
      <View>{renderOrderStatusButton(item)}</View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Trạng thái đơn hàng</Text>
      </View>

      <View style={styles.statusTabs}>
        {statusList.map((status) => (
          <TouchableOpacity
            key={status.value}
            style={[
              styles.statusTab,
              selectedStatus === status.value && styles.activeTab,
            ]}
            onPress={() => setSelectedStatus(status.value)}
          >
            <Text
              style={[
                styles.tabText,
                selectedStatus === status.value && styles.activeTabText,
              ]}
            >
              {status.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#FF9900" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.saleOrderId.toString()}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.orderList}
        />
      )}

      <Modal visible={isProductModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons
              name="close"
              size={24}
              color="black"
              onPress={closeProductModal}
              style={styles.closeIcon}
            />
            <Text style={styles.modalTitle}>Chi tiết sản phẩm</Text>
            <Text>{selectedProduct?.saleOrderDetailVMs?.$values[0]?.productName}</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop:30,
    backgroundColor: "#FFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: { marginLeft: 8, fontSize: 18, fontWeight: "bold" },
  statusTabs: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#F7F7F7",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  statusTab: {
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
  },
  activeTab: { backgroundColor: "#FF9900" },
  tabText: { color: "#333" },
  activeTabText: { color: "#FFF" },
  orderList: { padding: 16 },
  orderCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#FFF",
    borderRadius: 8,
    elevation: 2,
  },
  orderInfo: { flexDirection: "row", alignItems: "center" },
  orderImage: { width: 80, height: 80, borderRadius: 8, marginRight: 16 },
  orderDetails: { flex: 1 },
  orderCode: { fontSize: 14, fontWeight: "bold" },
  orderStatus: { fontSize: 14, color: "#555" },
  orderTotal: { fontSize: 14, color: "#333", fontWeight: "bold" },
  checkoutButton: {
    backgroundColor: "#FFA500",
    padding: 8,
    borderRadius: 8,
  },
  checkoutText: { color: "#FFF", fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 8,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  closeIcon: { position: "absolute", top: 16, right: 16 },
});

export default MyOrder;
