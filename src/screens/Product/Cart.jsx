import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faHeart, faTrashAlt, faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons'; // Import icons
import demoProduct from "../../../assets/images/product_demo.jpg";
import { useNavigation } from '@react-navigation/native';

export default function Cart() {
  const navigation = useNavigation();

  // Sample cart items with shop grouping
  const cartItems = [
    {
      shopName: 'Shop A',
      items: [
        { id: 1, name: 'Nike Air Zoom Pegasus 36 Miami', price: '$299.43', image: demoProduct, quantity: 1 },
        { id: 2, name: 'Adidas Ultraboost 20', price: '$199.43', image: demoProduct, quantity: 1 },
      ],
    },
    {
      shopName: 'Shop B',
      items: [
        { id: 3, name: 'Converse Chuck Taylor', price: '$99.43', image: demoProduct, quantity: 1 },
      ],
    },
  ];

  // State to track selected items for checkout
  const [selectedItems, setSelectedItems] = useState([]);

  // Handle product selection
  const toggleItemSelection = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  // Calculate total price of selected items
  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach(shop => {
      shop.items.forEach(item => {
        if (selectedItems.includes(item.id)) {
          total += parseFloat(item.price.replace('$', ''));
        }
      });
    });
    return `$${total.toFixed(2)}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Giỏ hàng của bạn</Text>
      </View>

      <View style={styles.content}>
        {cartItems.map((shop, shopIndex) => (
          <View key={shopIndex} style={styles.shopContainer}>
            <Text style={styles.shopName}>{shop.shopName}</Text>
            {shop.items.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                {/* Custom checkbox using FontAwesome */}
                <TouchableOpacity onPress={() => toggleItemSelection(item.id)} style={styles.checkbox}>
                  <FontAwesomeIcon 
                    icon={selectedItems.includes(item.id) ? faCheckSquare : faSquare} 
                    size={24} 
                    color={selectedItems.includes(item.id) ? "#4CAF50" : "#333"} 
                  />
                </TouchableOpacity>

                <Image source={item.image} style={styles.productImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity style={styles.quantityButton}>
                      <Text style={styles.quantityText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.quantityButton}>
                      <Text style={styles.quantityText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity>
                  <FontAwesomeIcon icon={faTrashAlt} size={20} color="#FF6B6B" style={styles.icon} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}

        {/* Footer for total and checkout button */}
        {selectedItems.length > 0 && (
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Tổng cộng:</Text>
              <Text style={styles.totalValue}>{calculateTotal()}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton} onPress={() => navigation.navigate('Checkout')}>
              <Text style={styles.checkoutButtonText}>Thanh toán</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  shopContainer: {
    marginBottom: 24,
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#4A90E2',
    marginVertical: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#E6F0FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  quantityText: {
    fontSize: 14,
    color: '#333',
  },
  checkbox: {
    marginRight: 12,
  },
  icon: {
    marginLeft: 12,
  },
  footer: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  checkoutButton: {
    backgroundColor: '#FF9900',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
