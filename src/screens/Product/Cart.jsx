import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faHeart, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import BottomNavigation from '../../components/BottomNavigation';
import demoProduct from "../../../assets/images/product_demo.jpg";
import { useNavigation } from '@react-navigation/native';

export default function Cart() {
    const navigation = useNavigation(); 
  
    const cartItems = [
      {
        id: 1,
        name: 'Nike Air Zoom Pegasus 36 Miami',
        price: '$299.43',
        image: demoProduct,
        quantity: 1,
      },
      {
        id: 2,
        name: 'Nike Air Zoom Pegasus 36 Miami',
        price: '$299.43',
        image: demoProduct,
        quantity: 1,
      },
    ];
  
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon icon={faArrowLeft} size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Your Cart</Text>
        </View>
  
        <View style={styles.content}>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
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
                <FontAwesomeIcon icon={faHeart} size={20} color="#FF6B6B" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity>
                <FontAwesomeIcon icon={faTrashAlt} size={20} color="#FF6B6B" style={styles.icon} />
              </TouchableOpacity>
            </View>
          ))}
  
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items (3)</Text>
              <Text style={styles.summaryValue}>$598.86</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>$40.00</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Import charges</Text>
              <Text style={styles.summaryValue}>$128.00</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total Price</Text>
              <Text style={styles.totalValue}>$766.86</Text>
            </View>
          </View>
  
          <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('Checkout')}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
  
        {/* <BottomNavigation /> */}
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
  icon: {
    marginLeft: 12,
  },
  summary: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
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
  nextButton: {
    backgroundColor: '#FF9900',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
