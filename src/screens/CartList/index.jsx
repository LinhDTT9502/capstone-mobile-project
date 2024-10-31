import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import demoProduct from "../../../assets/images/product_demo.jpg";
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from "@react-native-community/datetimepicker";

const COLORS = {
  primary: "#0035FF",
  secondary: "#FA7D0B",
  dark: "#2C323A",
  light: "#CADDED",
  white: "#FFFFFF",
  black: "#000000",
};

export default function Cart() {
  const navigation = useNavigation();
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [rentModalVisible, setRentModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 2)));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Set tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Helper function to format date as dd/mm/yyyy
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const cartItems = [
    { id: 1, name: 'Nike Air Zoom Pegasus 36 Miami', price: '$299.43', image: demoProduct, quantity: 1 },
    { id: 2, name: 'Adidas Ultraboost 20', price: '$199.43', image: demoProduct, quantity: 1 },
    { id: 3, name: 'Converse Chuck Taylor', price: '$99.43', image: demoProduct, quantity: 1 },
    { id: 4, name: 'Reebok Classic', price: '$89.43', image: demoProduct, quantity: 1 },
  ];

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev =>
      prev.some(item => item.id === itemId)
        ? prev.filter(item => item.id !== itemId)
        : [...prev, { id: itemId }]
    );
  };

  const calculateTotal = () => {
    const total = selectedItems
      .map(selected => cartItems.find(item => item.id === selected.id))
      .reduce((sum, item) => sum + (item ? parseFloat(item.price.replace('$', '')) * item.quantity : 0), 0);
    return `$${total.toFixed(2)}`;
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => ({ id: item.id })));
    }
    setSelectAll(!selectAll);
  };

  const handleBuyNow = () => {
    navigation.navigate("Checkout");
  };

  const handleAddRentToCart = () => {
    if (startDate >= endDate) {
      Alert.alert("Lỗi", "Ngày kết thúc phải sau ngày bắt đầu.");
      return;
    }
    setRentModalVisible(false);
    Alert.alert("Thông báo", "Sản phẩm đã được thêm vào giỏ hàng để thuê!");
  };

  const handleDateChange = (event, selectedDate, dateType) => {
    const selected = selectedDate || (dateType === "start" ? startDate : endDate);
    if (dateType === "start") {
      setShowStartDatePicker(false);
      if (selected < tomorrow) {
        Alert.alert("Lỗi", "Ngày bắt đầu phải từ ngày mai trở đi.");
      } else {
        setStartDate(selected);
      }
    } else {
      setShowEndDatePicker(false);
      if (selected <= startDate) {
        Alert.alert("Lỗi", "Ngày kết thúc phải sau ngày bắt đầu.");
      } else {
        setEndDate(selected);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
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

      {/* Select All Checkbox */}
      <View style={styles.selectAllContainer}>
        <TouchableOpacity onPress={handleSelectAll} style={styles.checkboxContainer}>
          <View style={[styles.checkbox, selectAll && styles.checkboxSelected]}>
            {selectAll && <Ionicons name="checkmark" size={16} color="#FFF" />}
          </View>
        </TouchableOpacity>
        <Text style={styles.selectAllText}>Chọn tất cả</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <TouchableOpacity 
              onPress={() => toggleItemSelection(item.id)} 
              style={styles.checkboxContainer}
            >
              <View style={[styles.checkbox, selectedItems.some(selected => selected.id === item.id) && styles.checkboxSelected]}>
                {selectedItems.some(selected => selected.id === item.id) && (
                  <Ionicons name="checkmark" size={16} color="#FFF" />
                )}
              </View>
            </TouchableOpacity>

            <Image source={item.image} style={styles.productImage} />
            
            <View style={styles.itemDetails}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <TouchableOpacity style={styles.deleteButton}>
                  <Ionicons name="trash-outline" size={20} color="#FF4B55" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.itemPrice}>{item.price}</Text>
              
              <View style={styles.itemFooter}>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity style={styles.quantityButton}>
                    <Ionicons name="remove" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity style={styles.quantityButton}>
                    <Ionicons name="add" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer with Rent and Buy buttons */}
      {selectedItems.length > 0 && (
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[styles.actionButton, styles.buyNowButton]}
            onPress={handleBuyNow}
          >
            <FontAwesome name="shopping-bag" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Mua Ngay</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rentButton]}
            onPress={() => setRentModalVisible(true)}
          >
            <FontAwesome name="calendar" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Thuê</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Rent Modal */}
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
              <Text>Ngày bắt đầu: {formatDate(startDate)}</Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                minimumDate={tomorrow}
                onChange={(event, selectedDate) =>
                  handleDateChange(event, selectedDate, "start")
                }
              />
            )}
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text>Ngày kết thúc: {formatDate(endDate)}</Text>
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                minimumDate={tomorrow}
                onChange={(event, selectedDate) =>
                  handleDateChange(event, selectedDate, "end")
                }
              />
            )}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddRentToCart}
            >
              <Text style={styles.submitButtonText}>Thêm vào giỏ hàng để thuê</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
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
    fontWeight: '600',
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
    fontWeight: '600',
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  selectAllText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.dark,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkboxContainer: {
    justifyContent: 'center',
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.secondary,
    marginVertical: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginHorizontal: 12,
  },
  bottomNav: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
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
    color: COLORS.dark,
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
});
