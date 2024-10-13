import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faFilter, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

const MyOrdersScreen = () => {
  const navigation = useNavigation(); // Hook for navigation

  const orders = [
    {
      id: '1',
      orderNumber: 'LQNSU346JK',
      type: 'Exchange',
      date: 'August 1, 2017',
      status: 'Shipped',
      itemsCount: 2,
      price: '200,000 VND',
      imageUrl: 'https://via.placeholder.com/50',
    },
    {
      id: '2',
      orderNumber: 'SDG1345KJD',
      type: 'Purchase',
      date: 'August 1, 2017',
      status: 'Shipped',
      itemsCount: 1,
      price: '220,000 VND',
      imageUrl: 'https://via.placeholder.com/50',
    },
    {
      id: '3',
      orderNumber: 'LQNSU346JK',
      type: 'Exchange',
      date: 'August 1, 2017',
      status: 'Shipped',
      itemsCount: 2,
      price: '200,000 VND',
      imageUrl: 'https://via.placeholder.com/50',
    },
    {
      id: '4',
      orderNumber: 'SDG1345KJD',
      type: 'Purchase',
      date: 'August 1, 2017',
      status: 'Cancelled',
      itemsCount: 1,
      price: '220,000 VND',
      imageUrl: 'https://via.placeholder.com/50',
    },
  ];

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderInfo}>
        <Text style={styles.orderNumber}>{item.orderNumber}</Text>
        <View style={styles.orderType}>
          <Text style={styles.orderTypeText}>{item.type}</Text>
        </View>
        <Text style={styles.orderDate}>Order at: {item.date}</Text>
        <Text style={styles.orderStatus}>Order Status: <Text style={styles.statusText}>{item.status}</Text></Text>
        <Text style={styles.orderItems}>{item.itemsCount} items purchased</Text>
        <Text style={styles.orderPrice}>{item.price}</Text>
      </View>
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My orders</Text>
      </View>

      <View style={styles.searchBar}>
        <FontAwesomeIcon icon={faSearch} size={20} color="#888" />
        <TextInput style={styles.searchInput} placeholder="Find something" />
        <TouchableOpacity>
          <FontAwesomeIcon icon={faFilter} size={20} color="#888" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.orderList}
      />

      {/* Pagination */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity style={styles.paginationButton} onPress={() => navigation.navigate('Page1')}>
          <Text style={styles.paginationText}>{'<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paginationButton} onPress={() => navigation.navigate('Page1')}>
          <Text style={styles.paginationText}>1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paginationButton} onPress={() => navigation.navigate('Page2')}>
          <Text style={styles.paginationText}>2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paginationButton} onPress={() => navigation.navigate('Page3')}>
          <Text style={styles.paginationText}>3</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paginationButton} onPress={() => navigation.navigate('Page3')}>
          <Text style={styles.paginationText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    paddingTop: 30
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 40,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
  },
  orderList: {
    paddingBottom: 20,
  },
  orderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  orderInfo: {
    flex: 1,
    paddingRight: 10,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderType: {
    backgroundColor: '#FF9900',
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 5,
    marginBottom: 5,
  },
  orderTypeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderDate: {
    color: '#888',
    fontSize: 12,
    marginBottom: 5,
  },
  orderStatus: {
    fontSize: 14,
    marginBottom: 5,
  },
  statusText: {
    color: '#4CAF50',
  },
  orderItems: {
    color: '#888',
    fontSize: 12,
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  paginationButton: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  paginationText: {
    color: '#333',
  },
});

export default MyOrdersScreen;
