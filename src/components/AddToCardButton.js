import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { addCusCart } from '../redux/slices/customerCartSlice';
import { addCart } from '../redux/slices/cartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddToCartButton = ({ product, quantity, color, size, condition }) => {
  const dispatch = useDispatch();

  const handleAddToCart = async () => {
    if (!product || !color || !size || !condition) {
      Alert.alert(
        "Lỗi",
        "Vui lòng chọn đầy đủ thông tin màu sắc, kích thước và tình trạng trước khi thêm vào giỏ hàng."
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const payload = {
        ...product,
        quantity,
        color: color, // Use the color prop
        size: size,    // Use the size prop
        condition: condition, // Use the condition prop
      };

      const message = `${product.productName} - ${color} - Size: ${size} - Tình trạng: ${condition} với số lượng ${quantity} đã được thêm vào giỏ hàng!`;

      if (!token) {
        dispatch(addCart(payload));
        Alert.alert("Thông báo", message);
      } else {
        dispatch(addCusCart(payload));
        Alert.alert("Thông báo", message);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert("Lỗi", "Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
      <FontAwesome name="shopping-cart" size={20} color="#FFF" />
      <Text style={styles.text}>Thêm vào giỏ hàng</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FA7D0B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
  },
  text: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default AddToCartButton;
