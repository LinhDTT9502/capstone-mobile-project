import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
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
import OrderCard from "../../components/Profile/OrderCard";
import StatusTabs from "../../components/Profile/StatusTabs";

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
    <OrderCard
      order={item}
      onPress={() => openProductModal(item)}
      renderOrderStatusButton={renderOrderStatusButton}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trạng thái đơn hàng</Text>
      </View>

      <StatusTabs
        statusList={statusList}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9900" />
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item?.id?.toString()}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.orderList}
        />
      )}

      <Modal visible={isProductModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeProductModal} style={styles.closeIcon}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Chi tiết đơn hàng</Text>
            <Text style={styles.productName}>
              {selectedProduct?.productName}
            </Text>
            <TouchableOpacity onPress={() => {
              navigation.navigate("SelectPayment", { order: selectedProduct })
              closeProductModal()
            }} style={styles.closeIcon}>
              Thanh toán
            </TouchableOpacity>
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
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orderList: {
    paddingVertical: 12,
  },
  checkoutButton: {
    backgroundColor: "#FF9900",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  checkoutText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 16,
    textAlign: "center",
  },
  closeIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
  },
  productName: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#FF0000",
    textAlign: "center",
    marginTop: 20,
  },
});

export default MyOrder;

