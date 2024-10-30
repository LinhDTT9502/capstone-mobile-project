import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import demoProduct from "../../../assets/images/product_demo.jpg";
import { useNavigation } from '@react-navigation/native';

export default function Cart() {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);

  // Sample cart items with type (buy/rent)
  const cartItems = [
    { id: 1, name: 'Nike Air Zoom Pegasus 36 Miami', price: '$299.43', image: demoProduct, quantity: 1, type: 'buy' },
    { id: 2, name: 'Adidas Ultraboost 20', price: '$199.43', image: demoProduct, quantity: 1, type: 'rent' },
    { id: 3, name: 'Converse Chuck Taylor', price: '$99.43', image: demoProduct, quantity: 1, type: 'buy' },
    { id: 4, name: 'Reebok Classic', price: '$89.43', image: demoProduct, quantity: 1, type: 'rent' },
  ];

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const calculateTotal = () => {
    const total = cartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')) * item.quantity, 0);
    return `$${total.toFixed(2)}`;
  };

  const filterCartItems = () => {
    if (selectedCategory === 0) return cartItems;
    return cartItems.filter(item => 
      item.type === (selectedCategory === 1 ? 'buy' : 'rent')
    );
  };

  return (
    <View style={styles.container}>
      {/* Enhanced Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Giỏ hàng của bạn</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cartItems.length}</Text>
        </View>
      </View>

      {/* Enhanced Category Tabs */}
      <View style={styles.categoryContainer}>
        {['Tất cả', 'Mua', 'Thuê'].map((category, index) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === index && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(index)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === index && styles.categoryTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Enhanced Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filterCartItems().map((item) => (
          <Animated.View key={item.id} style={styles.cartItem}>
            <TouchableOpacity 
              onPress={() => toggleItemSelection(item.id)} 
              style={styles.checkboxContainer}
            >
              <View style={[
                styles.checkbox,
                selectedItems.includes(item.id) && styles.checkboxSelected
              ]}>
                {selectedItems.includes(item.id) && (
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
                    <Ionicons name="remove" size={20} color="#4A90E2" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity style={styles.quantityButton}>
                    <Ionicons name="add" size={20} color="#4A90E2" />
                  </TouchableOpacity>
                </View>
                <View style={styles.typeTag}>
                  <Text style={styles.typeText}>
                    {item.type === 'buy' ? 'Mua' : 'Thuê'}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Enhanced Footer */}
      {selectedItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalValue}>{calculateTotal()}</Text>
          </View>
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={() => navigation.navigate('Checkout')}
          >
            <Text style={styles.checkoutButtonText}>
              Thanh toán ({selectedItems.length})
            </Text>
            <Ionicons name="arrow-forward" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}
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
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginLeft: 8,
  },
  badge: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  categoryButtonActive: {
    backgroundColor: '#4A90E2',
  },
  categoryText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#495057',
  },
  categoryTextActive: {
    color: '#FFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    borderColor: '#CED4DA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
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
    color: '#212529',
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A90E2',
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
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginHorizontal: 12,
  },
  typeTag: {
    backgroundColor: '#E9ECEF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
  },
  footer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4A90E2',
  },
  checkoutButton: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});