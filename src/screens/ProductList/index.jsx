import React, { useState, useEffect } from "react";
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
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { fetchProducts, fetchProductsFiltered, searchProducts } from "../../services/productService";

const { width } = Dimensions.get('window');
const logoImage = require("../Logo/2sport_logo.png");

export default function ProductListing() {
  const navigation = useNavigation();
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [sortOrder, setSortOrder] = useState('default');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000000);

  useEffect(() => {
    loadProducts();
  }, [currentPage]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, sortOrder, minPrice, maxPrice]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { total, products: fetchedProducts } = await fetchProducts(currentPage);
      setProducts(prevProducts => 
        currentPage === 1 ? fetchedProducts : [...prevProducts, ...fetchedProducts]
      );
      setTotalProducts(total);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = products.filter(product => 
      product.price >= minPrice &&
      product.price <= maxPrice
    );

    switch (sortOrder) {
      case 'highToLow':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'lowToHigh':
        filtered.sort((a, b) => a.price - b.price);
        break;
      default:
        // Keep original order
        break;
    }

    setFilteredProducts(filtered);
  };

  const loadMoreProducts = () => {
    if (!loading && products.length < totalProducts) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const toggleFilterModal = () => setFilterModalVisible(!isFilterModalVisible);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => {
      if (prevOrder === 'default') return 'highToLow';
      if (prevOrder === 'highToLow') return 'lowToHigh';
      return 'default';
    });
  };

  const applyFilters = () => {
    filterAndSortProducts();
    toggleFilterModal();
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      loadProducts();
      return;
    }
  
    setLoading(true);
    try {
      const response = await searchProducts(searchQuery);
      // console.log("API Response:", response); // Add this line
      const searchResults = response.data?.$values || [];
      const uniqueResults = [...new Map(searchResults.map(item => [item.id, item])).values()];
      setProducts(uniqueResults);
      setTotalProducts(uniqueResults.length);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate("ProductDetail", { productId: item.id })}
    >
      <Image
        source={{ uri: item.imgAvatarPath}}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.productName} 
        </Text>
        <Text style={styles.productCategory} numberOfLines={1}>
          {item.categoryName} 
        </Text>
        <Text style={styles.productPrice}>{item.price} ₫</Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImage} style={styles.logoImage} />
        <View style={styles.searchContainer}>
        <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={handleSearch}>
            <Ionicons name="search" size={20} color="#999" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={toggleFilterModal}>
          <Ionicons name="options-outline" size={24} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      <View style={styles.sortContainer}>
        <TouchableOpacity onPress={toggleSortOrder} style={styles.sortButton}>
          <Ionicons
            name={sortOrder === 'lowToHigh' ? 'arrow-up' : 'arrow-down'}
            size={20}
            color="#333"
          />
          <Text style={styles.sortButtonText}>
            {sortOrder === 'default'
              ? 'Mặc định'
              : sortOrder === 'highToLow'
              ? 'Giá cao → thấp'
              : 'Giá thấp → cao'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productList}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? (
          <View style={styles.loadingContainer}>
            <Text>Đang tải...</Text>
          </View>
        ) : null}
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
            <View style={styles.priceFilterContainer}>
              <Text style={styles.priceFilterTitle}>Khoảng giá</Text>
              <View style={styles.priceInputContainer}>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Giá thấp nhất"
                  keyboardType="numeric"
                  value={minPrice.toString()}
                  onChangeText={(text) => setMinPrice(parseInt(text) || 0)}
                />
                <Text style={styles.priceSeparator}>-</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Giá cao nhất"
                  keyboardType="numeric"
                  value={maxPrice.toString()}
                  onChangeText={(text) => setMaxPrice(parseInt(text) || 1000000000)}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={applyFilters}
            >
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
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  logoImage: {
    width: 80,
    height: 32,
    resizeMode: "contain",
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    backgroundColor: '#FFF',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 4,
  },
  sortButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#333',
  },
  productList: {
    padding: 8,
  },
  productRow: {
    justifyContent: "space-between",
  },
  productCard: {
    width: (width - 48) / 2,
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 8,
  },
  productCategory: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  priceFilterContainer: {
    marginTop: 20,
  },
  priceFilterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  priceSeparator: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
  applyButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  applyButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center'
  }
});