import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const MyOrder = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [selectedStatus, setSelectedStatus] = useState(route.params?.status || 'all');

  const statuses = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Chờ xác nhận', value: 'pending' },
    { label: 'Chờ lấy hàng', value: 'pickup' },
    { label: 'Đang giao', value: 'shipping' },
    { label: 'Đã giao', value: 'delivered' },
    { label: 'Đã hủy', value: 'canceled' },
    { label: 'Đánh giá', value: 'review' },
  ];

  const orders = [
    {
      id: '1',
      orderNumber: '#ORD-2023-001',
      type: 'Thể thao',
      date: '15/05/2023',
      status: 'pending',
      itemsCount: 2,
      price: '1.500.000 ₫',
      imageUrl: 'https://via.placeholder.com/100',
    },
    {
      id: '2',
      orderNumber: '#ORD-2023-002',
      type: 'Giày',
      date: '20/05/2023',
      status: 'shipping',
      itemsCount: 1,
      price: '800.000 ₫',
      imageUrl: 'https://via.placeholder.com/100',
    },
    // Add more sample orders as needed
  ];

  const filteredOrders =
    selectedStatus === 'all' ? orders : orders.filter((order) => order.status === selectedStatus);

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      <View style={styles.orderInfo}>
        <Text style={styles.orderNumber}>{item.orderNumber}</Text>
        <Text style={styles.orderType}>{item.type}</Text>
        <Text style={styles.orderDate}>{item.date}</Text>
        <View style={styles.orderFooter}>
          <Text style={styles.orderItems}>{item.itemsCount} sản phẩm</Text>
          <Text style={styles.orderPrice}>{item.price}</Text>
        </View>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
      </View>
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'pickup': return '#3498db';
      case 'shipping': return '#2ecc71';
      case 'delivered': return '#27ae60';
      case 'canceled': return '#e74c3c';
      case 'review': return '#9b59b6';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'pickup': return 'Chờ lấy hàng';
      case 'shipping': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'canceled': return 'Đã hủy';
      case 'review': return 'Đánh giá';
      default: return 'Không xác định';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Đơn đã mua</Text>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput style={styles.searchInput} placeholder="Tìm kiếm đơn hàng" />
        <TouchableOpacity>
          <Ionicons name="filter" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={statuses}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.value}
        renderItem={({ item: status }) => (
          <TouchableOpacity
            style={[styles.statusTab, selectedStatus === status.value && styles.activeTab]}
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
        )}
        contentContainerStyle={styles.statusTabs}
      />

      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.orderList}
        />
      ) : (
        <View style={styles.noOrdersView}>
          <Ionicons name="cart-outline" size={64} color="#ccc" />
          <Text style={styles.noOrdersText}>Không có đơn hàng nào</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:30,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    margin: 16,
    height: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  statusTabs: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  statusTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  activeTab: {
    backgroundColor: '#524FF5',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  orderList: {
    padding: 16,
  },
  orderCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  orderType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItems: {
    fontSize: 14,
    color: '#666',
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#524FF5',
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: 'bold',
  },
  noOrdersView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noOrdersText: {
    fontSize: 18,
    color: '#888',
    marginTop: 16,
  },
});

export default MyOrder; 