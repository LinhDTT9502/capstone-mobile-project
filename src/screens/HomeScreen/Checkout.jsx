import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchBranchs } from '../../services/branchService';
import DeliveryAddress from '../../components/Payment/DeliveryAddress';
import { checkout } from '../../services/paymentServices';
import { selectUser } from '../../redux/slices/authSlice';
import { selectedShipment } from '../../redux/slices/shipmentSlice';
import { loadCartState, selectCartItems } from '../../redux/slices/cartSlice';

const COLORS = {
  primary: '#3366FF',
  secondary: '#FF8800',
  dark: '#2C3E50',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#BDC3C7',
  lightGray: '#F0F0F0',
};

export default function Checkout() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const user = useSelector(selectUser);
  const shipment = useSelector(selectedShipment);
  const cartItems = useSelector(selectCartItems);

  const { selectedCartItems = [] } = route.params || {};

  const [branches, setBranches] = useState([]);
  const [selectedOption, setSelectedOption] = useState('HOME_DELIVERY');
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [discountCode, setDiscountCode] = useState('');
  const [note, setNote] = useState('');
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
  });

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const branchData = await fetchBranchs();
        setBranches(branchData);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };
    loadBranches();
    dispatch(loadCartState());
  }, [dispatch]);

  const calculateTotal = () => {
    return selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleCheckout = async () => {
    if (!shipment && selectedOption === 'HOME_DELIVERY') {
      Alert.alert('Error', 'Please select a delivery address.');
      return;
    }

    if (!selectedBranchId && selectedOption === 'STORE_PICKUP') {
      Alert.alert('Error', 'Please select a branch.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const data = {
        orderDetailCMs: selectedCartItems.map((item) => ({
          warehouseId: item.warehouseId,
          quantity: item.quantity,
          price: item.price,
        })),
        branchId: selectedBranchId || null,
        userID: user?.UserId,
        shipmentDetailID: shipment?.id || null,
        paymentMethodID: selectedOption,
        orderType: 1,
        discountCode: discountCode || 'nothing',
        note: note || 'nothing',
      };

      const response = await checkout(token, data);

      if (response?.data?.paymentLink) {
        navigation.navigate('PaymentWebView', {
          url: response.data.paymentLink,
        });
      } else {
        Alert.alert('Success', 'Your order has been placed.');
        navigation.navigate('OrderConfirmation', { orderDetails: data });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      Alert.alert('Error', 'Something went wrong during checkout.');
    }
  };

  const renderDeliveryOption = (option, title) => (
    <TouchableOpacity
      style={[
        styles.radioOption,
        selectedOption === option && styles.selectedOption,
      ]}
      onPress={() => handleOptionChange(option)}
    >
      <View style={styles.radioButton}>
        {selectedOption === option && <View style={styles.radioButtonInner} />}
      </View>
      <Text style={[styles.radioText, selectedOption === option && styles.selectedRadioText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <Text style={styles.title}>Checkout</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
          {renderDeliveryOption('HOME_DELIVERY', 'Home Delivery')}
          {selectedOption === 'HOME_DELIVERY' && (
            <DeliveryAddress userData={userData} setUserData={setUserData} />
          )}
          {renderDeliveryOption('STORE_PICKUP', 'Store Pickup')}
          {selectedOption === 'STORE_PICKUP' && (
            <View style={styles.branchList}>
              {branches.map((branch) => (
                <TouchableOpacity
                  key={branch.id}
                  style={[
                    styles.branchOption,
                    selectedBranchId === branch.id && styles.selectedBranch,
                  ]}
                  onPress={() => setSelectedBranchId(branch.id)}
                >
                  <Text style={styles.branchText}>{branch.branchName}</Text>
                  <Text style={styles.branchDetails}>{branch.location}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>



        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>
          {selectedCartItems.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Image source={{ uri: item.imgAvatarPath }} style={styles.productImage} />
              <View style={styles.orderItemDetails}>
                <Text style={styles.productName}>{item.productName} - {item.size}</Text>
                <Text style={styles.quantityText}>Số lượng: {item.quantity}</Text>
                <Text style={styles.priceText}>Giá: {formatCurrency(item.price)}</Text>
                <Text style={styles.totalText}>Tổng cộng: {formatCurrency(item.price * item.quantity)}</Text>
              </View>
            </View>
          ))}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalAmount}>{formatCurrency(calculateTotal())}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mã giảm giá</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter discount code"
            value={discountCode}
            onChangeText={setDiscountCode}
            placeholderTextColor={COLORS.gray}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú</Text>
          <TextInput
            style={[styles.input, styles.noteInput]}
            placeholder="Add a note"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            placeholderTextColor={COLORS.gray}
          />
        </View>

        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Tiến hành thanh toán</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:30,
    backgroundColor: COLORS.white,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginLeft: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.primary,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  radioText: {
    fontSize: 16,
    color: COLORS.dark,
  },
  selectedRadioText: {
    fontWeight: 'bold',
  },
  branchList: {
    marginTop: 8,
  },
  branchOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedBranch: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.lightGray,
  },
  branchText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  branchDetails: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.dark,
  },
  noteInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  orderItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    marginBottom: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  orderItemDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 4,
  },
  quantityText: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 2,
  },
  priceText: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 2,
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    marginTop: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  checkoutButton: {
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  checkoutButtonText: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});