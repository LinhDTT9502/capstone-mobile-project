import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput, ScrollView  } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';

const MyOrdersScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [selectedStatus, setSelectedStatus] = useState(route.params?.status || 'all'); // Default to 'pending' if no status is passed

  const statuses = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Chờ xác nhận', value: 'pending' },
    { label: 'Chờ lấy hàng', value: 'pickup' },
    { label: 'Đang giao hàng', value: 'shipping' },
    { label: 'Đã giao', value: 'delivered' },
    { label: 'Đã hủy', value: 'canceled' },
    { label: 'Đánh giá', value: 'review' },
  ];

  // Sample order data with various statuses
  const orders = [
    {
      id: '1',
      orderNumber: 'LQNSU346JK',
      type: 'Purchase',
      date: '01/08/2023',
      status: 'pending',
      itemsCount: 2,
      price: '200,000 VND',
      imageUrl: 'https://via.placeholder.com/50',
    },
    {
      id: '2',
      orderNumber: 'SDG1345KJD',
      type: 'Purchase',
      date: '02/08/2023',
      status: 'pickup',
      itemsCount: 1,
      price: '220,000 VND',
      imageUrl: 'https://via.placeholder.com/50',
    },
    {
      id: '3',
      orderNumber: 'KLS1234567',
      type: 'Exchange',
      date: '03/08/2023',
      status: 'shipping',
      itemsCount: 3,
      price: '180,000 VND',
      imageUrl: 'https://via.placeholder.com/50',
    },
    {
      id: '4',
      orderNumber: 'JKT567890Q',
      type: 'Exchange',
      date: '04/08/2023',
      status: 'review',
      itemsCount: 2,
      price: '150,000 VND',
      imageUrl: 'https://via.placeholder.com/50',
    },
  ];

  const filteredOrders = selectedStatus === 'all' ? orders : orders.filter(order => order.status === selectedStatus);

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderInfo}>
        <Text style={styles.orderNumber}>{item.orderNumber}</Text>
        <View style={styles.orderType}>
          <Text style={styles.orderTypeText}>{item.type}</Text>
        </View>
        <Text style={styles.orderDate}>Ngày đặt hàng: {item.date}</Text>
        <Text style={styles.orderStatus}>
          Trạng thái đơn hàng: <Text style={styles.statusText}>{item.status}</Text>
        </Text>
        <Text style={styles.orderItems}>{item.itemsCount} sản phẩm đã mua</Text>
        <Text style={styles.orderPrice}>{item.price}</Text>
      </View>
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Đơn đã mua</Text>
      </View>

 {/* Scrollable Status Tabs */}
 <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusTabs}>
        {statuses.map(status => (
          <TouchableOpacity
            key={status.value}
            style={[styles.statusTab, selectedStatus === status.value && styles.activeTab]}
            onPress={() => setSelectedStatus(status.value)}
          >
            <Text style={[styles.tabText, selectedStatus === status.value && styles.activeTabText]}>
              {status.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <FontAwesomeIcon icon={faSearch} size={20} color="#888" />
        <TextInput style={styles.searchInput} placeholder="Tìm kiếm" />
        <TouchableOpacity>
          <FontAwesomeIcon icon={faFilter} size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
  },
  statusTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FF5722',
  },
  tabText: {
    fontSize: 14,
    color: '#888',
  },
  activeTabText: {
    color: '#FF5722',
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingHorizontal: 15,
    margin: 16,
    height: 40,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
  },
  orderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderType: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    backgroundColor: '#FF9900',
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  orderTypeText: {
    fontSize: 12,
    color: '#FFF',
  },
  orderDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  orderStatus: {
    fontSize: 14,
  },
  statusText: {
    color: '#4CAF50',
  },
  orderItems: {
    fontSize: 12,
    color: '#888',
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5722',
    marginTop: 5,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});

export default MyOrdersScreen;
