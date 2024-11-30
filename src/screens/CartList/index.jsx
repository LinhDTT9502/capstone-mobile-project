import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  addCart,
  removeFromCart,
  decreaseQuantity,
} from "../../redux/slices/cartSlice";
import {
  getUserCart,
  reduceCartItem,
  removeCartItem,
  updateCartItemQuantity,
} from "../../services/cartService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const COLORS = {
  primary: "#3366FF",
  secondary: "#FF8800",
  dark: "#2C3E50",
  light: "#ECF0F1",
  white: "#FFFFFF",
  black: "#000000",
  danger: "#E74C3C",
  success: "#2ECC71",
  gray: "#BDC3C7",
};

export default function Cart() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const guestCartItems = useSelector(selectCartItems);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const [selectAll, setSelectAll] = useState(false);
  const [rentModalVisible, setRentModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 2))
  );
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [token, setToken] = useState(null);

  // Lấy token từ AsyncStorage
  useFocusEffect(
    React.useCallback(() => {
      const fetchCart = async () => {
        try {
          const storedToken = await AsyncStorage.getItem("token");
          setToken(storedToken);
  
          if (storedToken) {
            const customerCart = await getUserCart(storedToken);
            setCartItems(customerCart);
          } else {
            setCartItems(guestCartItems);
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
          Alert.alert("Lỗi", "Không thể tải giỏ hàng. Vui lòng thử lại.");
        }
      };
  
      fetchCart();
    }, [guestCartItems])
  );
  

  // useEffect(() => {
  //   if (token && customerCartItems) {
  //     setCartItems(customerCartItems);
  //   } else if (guestCartItems) {
  //     setCartItems(guestCartItems);
  //   }
  // }, [token, guestCartItems, customerCartItems]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedItems(selectAll ? [] : cartItems.map((item) => item.cartItemId));
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((cartItemId) => cartItemId !== itemId)
        : [...prev, itemId]
    );
  };

  const handleRemoveItem = async (itemId) => {
    try {
      if (token) {
        await removeCartItem(itemId, token);
        setCartItems((prev) => prev.filter((item) => item.cartItemId !== itemId));
      } else {
        dispatch(removeFromCart(itemId));
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
      Alert.alert("Lỗi", "Không thể xóa sản phẩm.");
    }
  };

  const handleIncreaseQuantity = async (item) => {
    try {
      if (token) {
        const updatedItem = await updateCartItemQuantity(
          item.cartItemId, 
          item.quantity + 1, 
          token
        );
        setCartItems((prev) =>
          prev.map((i) =>
            i.cartItemId === item.cartItemId
              ? { ...i, quantity: updatedItem?.quantity || i.quantity + 1 }
              : i
          )
        );
      } else {
        dispatch(addCart({ ...item, quantity: item.quantity + 1 }));
      }
    } catch (error) {
      console.error("Error increasing quantity:", error.message);
      Alert.alert("Lỗi", "Không thể tăng số lượng sản phẩm.");
    }
  };

  const handleDecreaseQuantity = async (item) => {
    try {
      if (item.quantity > 1) {
        if (token) {
          const updatedItem = await updateCartItemQuantity(
            item.cartItemId, 
            item.quantity - 1,
            token
          );
          setCartItems((prev) =>
            prev.map((i) =>
              i.cartItemId === item.cartItemId
                ? { ...i, quantity: updatedItem?.quantity || i.quantity - 1 }
                : i
            )
          );
        } else {
          dispatch(decreaseQuantity(item.cartItemId));
        }
      } else {
        await handleRemoveItem(item.cartItemId);
      }
    } catch (error) {
      console.error("Error decreasing quantity:", error.message);
      Alert.alert("Lỗi", "Không thể giảm số lượng sản phẩm.");
    }
  };

  const calculateTotal = () => {
    return (
      cartItems
        .filter((item) => selectedItems.includes(item.cartItemId))
        // tính sản phẩm được chọn
        .reduce((sum, item) => {
          const itemTotal = parseFloat(item.price) * item.quantity;
          // Tổng x quali

          return sum + itemTotal;
        }, 0)
        .toFixed(0)
    );
    // Định dạng số thập phân (không lấy phần lẻ)
  };

  const calculateItemTotal = (item) => {
    return (parseFloat(item.price) * item.quantity).toFixed(0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  useEffect(() => {
    // console.log("Cart Items:", cartItems);
  }, [cartItems]);

  const handleBuyNow = () => {
    if (selectedItems.length === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn sản phẩm để mua.");
      return;
    }

    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.includes(item.cartItemId)
    );

    navigation.navigate("PlacedOrder", { selectedCartItems, type: 'buy' });
  };

  const handleRent = () => {
    if (selectedItems.length === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn sản phẩm để thuê.");
      return;
    }
    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.includes(item.cartItemId)
    );

    navigation.navigate("PlacedOrder", { selectedCartItems, type: 'rent' });
  };

  const handleDateChange = (event, selectedDate, dateType) => {
    const currentDate =
      selectedDate || (dateType === "start" ? startDate : endDate);
    if (dateType === "start") {
      setShowStartDatePicker(false);
      setStartDate(currentDate);
    } else {
      setShowEndDatePicker(false);
      setEndDate(currentDate);
    }
  };

  const handleAddRentToCart = () => {
    if (startDate >= endDate) {
      Alert.alert("Lỗi", "Ngày kết thúc phải sau ngày bắt đầu.");
      return;
    }
    setRentModalVisible(false);
    Alert.alert("Thành công", "Đã thêm sản phẩm vào giỏ hàng để thuê!");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <Text style={styles.title}>Giỏ hàng của bạn</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartItems.length}</Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {cartItems.map((item) => {
            return (
              <View key={item.cartItemId} style={styles.cartItem}>
                <TouchableOpacity
                  onPress={() => toggleItemSelection(item.cartItemId)}
                  style={styles.checkboxContainer}
                >
                  <View
                    style={[
                      styles.checkbox,
                      selectedItems.includes(item.cartItemId) && styles.checkboxSelected,
                    ]}
                  >
                    {selectedItems.includes(item.cartItemId) && (
                      <Ionicons name="checkmark" size={16} color={COLORS.white} />
                    )}
                  </View>
                </TouchableOpacity>

                <Image
                  source={{ uri: item.imgAvatarPath }}
                  style={styles.productImage}
                />

                <View style={styles.itemDetails}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {item.productName} - {item.color}
                    </Text>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleRemoveItem(item.cartItemId)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color={COLORS.danger}
                      />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.itemPrice}>
                    {formatCurrency((item.price * item.quantity))}
                  </Text>
                  <Text style={styles.itemSize}>Size: {item.size}</Text>

                  <View style={styles.itemFooter}>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleDecreaseQuantity(item)}
                      >
                        <Ionicons
                          name="remove"
                          size={20}
                          color={COLORS.primary}
                        />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleIncreaseQuantity(item)}
                      >
                        <Ionicons name="add" size={20} color={COLORS.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )
          })}
        </ScrollView>

        {cartItems.length > 0 && (
          <View style={styles.bottomNav}>
            <TouchableOpacity
              style={styles.selectAllContainer}
              onPress={handleSelectAll}
            >
              <View
                style={[styles.checkbox, selectAll && styles.checkboxSelected]}
              >
                {selectAll && (
                  <Ionicons name="checkmark" size={16} color={COLORS.white} />
                )}
              </View>
              <Text style={styles.selectAllText}>Chọn tất cả</Text>
            </TouchableOpacity>
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Tổng cộng:</Text>
              <Text style={styles.totalAmount}>
                {formatCurrency(parseFloat(calculateTotal()))}
              </Text>
            </View>
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.buyNowButton]}
                onPress={handleBuyNow}
              >
                <FontAwesome
                  name="shopping-bag"
                  size={20}
                  color={COLORS.white}
                />
                <Text style={styles.actionButtonText}>Mua ngay</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.rentButton]}
                onPress={handleRent}
              >
                <FontAwesome name="calendar" size={20} color={COLORS.white} />
                <Text style={styles.actionButtonText}>Thuê</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={rentModalVisible}
          onRequestClose={() => setRentModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chọn ngày thuê</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text>Ngày bắt đầu: {startDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showStartDatePicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={(event, selectedDate) =>
                    handleDateChange(event, selectedDate, "start")
                  }
                />
              )}
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text>Ngày kết thúc: {endDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showEndDatePicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  minimumDate={new Date(startDate.getTime() + 86400000)}
                  onChange={(event, selectedDate) =>
                    handleDateChange(event, selectedDate, "end")
                  }
                />
              )}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddRentToCart}
              >
                <Text style={styles.submitButtonText}>
                  Thêm vào giỏ hàng để thuê
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setRentModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: COLORS.light,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.dark,
    marginLeft: 8,
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },
  selectAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
  },
  selectAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  selectAllText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.dark,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkboxContainer: {
    justifyContent: "center",
    marginRight: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
    resizeMode: "contain",
  },
  itemDetails: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.dark,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.secondary,
    marginVertical: 8,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.light,
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.dark,
    marginHorizontal: 12,
  },
  bottomNav: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.dark,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.secondary,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  buyNowButton: {
    backgroundColor: COLORS.primary,
    marginRight: 8,
  },
  rentButton: {
    backgroundColor: COLORS.secondary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: COLORS.dark,
  },
  dateInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    borderColor: COLORS.secondary,
    borderWidth: 1,
  },
  cancelButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: "bold",
  },
  itemTotalPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.secondary,
  },
  itemSize: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.gray,
    marginBottom: 4,
  },
});
