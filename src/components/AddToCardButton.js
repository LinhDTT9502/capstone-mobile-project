import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { addCusCart } from '../redux/slices/customerCartSlice';
import { addCart } from '../redux/slices/cartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddToCartButton = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = async () => {
    if (!product) {
      console.error('Product is undefined');
      Alert.alert('Lỗi', 'Không thể thêm vào giỏ hàng vì thông tin sản phẩm bị thiếu.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        dispatch(addCart(product));
        Alert.alert('Thông báo', 'Sản phẩm đã được thêm vào giỏ hàng!');
      } else {
        dispatch(addCusCart(product));
        Alert.alert('Thông báo', `${product.productName} đã được thêm vào giỏ hàng!`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Lỗi', 'Không thể thêm vào giỏ hàng. Vui lòng thử lại.');
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
