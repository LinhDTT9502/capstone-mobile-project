import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const logoImage = require('../Logo/2sport_logo.png');
const demoProduct = require('../../../assets/images/product_demo.jpg');

export default function ProductListing() {
  const navigation = useNavigation();
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const toggleFilterModal = () => setFilterModalVisible(!isFilterModalVisible);

  const filters = ['Mới', 'Cũ', 'Giá thấp đến cao', 'Giá cao đến thấp', 'Đánh giá cao nhất'];
  const products = Array(10).fill({
    name: 'Nike Air Max 270 React ENG',
    price: '2.500.000 ₫',
    image: demoProduct,
  });

  const toggleFilter = (filter) => {
    setSelectedFilters(prevFilters =>
      prevFilters.includes(filter)
        ? prevFilters.filter(f => f !== filter)
        : [...prevFilters, filter]
    );
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail')}
    >
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.wishlistButton}>
        <Ionicons name="heart-outline" size={24} color="#FF6B6B" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImage} style={styles.logoImage} />
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity onPress={toggleFilterModal}>
          <Ionicons name="options-outline" size={24} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      {selectedFilters.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChips}>
          {selectedFilters.map((filter) => (
            <TouchableOpacity key={filter} style={styles.filterChip} onPress={() => toggleFilter(filter)}>
              <Text style={styles.filterChipText}>{filter}</Text>
              <Ionicons name="close-circle" size={18} color="#4A90E2" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productList}
      />

      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleFilterModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Lọc sản phẩm</Text>
              <TouchableOpacity onPress={toggleFilterModal}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterOption,
                  selectedFilters.includes(filter) && styles.filterOptionSelected
                ]}
                onPress={() => toggleFilter(filter)}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedFilters.includes(filter) && styles.filterOptionTextSelected
                ]}>{filter}</Text>
                {selectedFilters.includes(filter) && (
                  <Ionicons name="checkmark" size={20} color="#FFF" />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.applyButton} onPress={toggleFilterModal}>
              <Text style={styles.applyButtonText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
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
  logoImage: {
    width: 80,
    height: 32,
    resizeMode: 'contain',
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    marginLeft: 8,
    fontSize: 16,
  },
  filterChips: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F0FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  filterChipText: {
    color: '#4A90E2',
    marginRight: 4,
  },
  productList: {
    padding: 8,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 8,
  },
  addToCartButton: {
    backgroundColor: '#FF9900',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 6,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterOptionSelected: {
    backgroundColor: '#4A90E2',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#333',
  },
  filterOptionTextSelected: {
    color: '#FFF',
  },
  applyButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
