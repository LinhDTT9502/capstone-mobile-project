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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// api
import { fetchProducts, fetchProductsFiltered } from "../../services/productService";

const logoImage = require("../Logo/2sport_logo.png");

export default function ProductListing() {
  const navigation = useNavigation();
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Add filter states
  const [sortBy, setSortBy] = useState("");
  const [isAscending, setIsAscending] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000000);

  useEffect(() => {
    loadProducts();
  }, [currentPage]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      if (selectedFilters.length > 0) {
        // Apply filters
        const { total, products: fetchedProducts } = await fetchProductsFiltered(
          sortBy,
          isAscending,
          selectedBrands,
          selectedCategories,
          minPrice,
          maxPrice
        );
        setProducts(prevProducts => 
          currentPage === 1 ? fetchedProducts : [...prevProducts, ...fetchedProducts]
        );
        setTotalProducts(total);
      } else {
        // Load without filters
        const { total, products: fetchedProducts } = await fetchProducts(currentPage);
        setProducts(prevProducts => 
          currentPage === 1 ? fetchedProducts : [...prevProducts, ...fetchedProducts]
        );
        setTotalProducts(total);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreProducts = () => {
    if (!loading && products.length < totalProducts) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const toggleFilterModal = () => setFilterModalVisible(!isFilterModalVisible);

  const filters = [
    { label: "Mới nhất", value: "newest", sortBy: "createdDate", ascending: false },
    { label: "Cũ nhất", value: "oldest", sortBy: "createdDate", ascending: true },
    { label: "Giá thấp đến cao", value: "priceAsc", sortBy: "price", ascending: true },
    { label: "Giá cao đến thấp", value: "priceDesc", sortBy: "price", ascending: false },
  ];

  const toggleFilter = (filter) => {
    // Update selected filters
    setSelectedFilters(prevFilters =>
      prevFilters.includes(filter.value)
        ? prevFilters.filter(f => f !== filter.value)
        : [...prevFilters, filter.value]
    );

    // Update sort parameters
    setSortBy(filter.sortBy);
    setIsAscending(filter.ascending);
  };

  const applyFilters = () => {
    setCurrentPage(1); // Reset to first page
    loadProducts();
    toggleFilterModal();
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate("ProductDetail", { productId: item.id })}
    >
      <Image
        source={{ uri: item.imgAvatarPath || "https://via.placeholder.com/150" }}
        style={styles.productImage}
        defaultSource={require("../../../assets/images/product_demo.jpg")}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.productName} {/* Displaying the product name */}
        </Text>
        <Text style={styles.productCategory} numberOfLines={1}>
          {item.categoryName} {/* Displaying the category name below the product name */}
        </Text>
        <Text style={styles.productPrice}>{item.price} ₫</Text>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>
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
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity onPress={toggleFilterModal}>
          <Ionicons name="options-outline" size={24} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      {selectedFilters.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterChips}
        >
          {selectedFilters.map((filterValue) => {
            const filter = filters.find(f => f.value === filterValue);
            return (
              <TouchableOpacity
                key={filterValue}
                style={styles.filterChip}
                onPress={() => toggleFilter(filter)}
              >
                <Text style={styles.filterChipText}>{filter.label}</Text>
                <Ionicons name="close-circle" size={18} color="#4A90E2" />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <FlatList
        data={products}
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
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                style={[
                  styles.filterOption,
                  selectedFilters.includes(filter.value) &&
                    styles.filterOptionSelected,
                ]}
                onPress={() => toggleFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    selectedFilters.includes(filter.value) &&
                      styles.filterOptionTextSelected,
                  ]}
                >
                  {filter.label}
                </Text>
                {selectedFilters.includes(filter.value) && (
                  <Ionicons name="checkmark" size={20} color="#FFF" />
                )}
              </TouchableOpacity>
            ))}
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
    marginLeft: 8,
    fontSize: 16,
  },
  filterChips: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F0FF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  filterChipText: {
    color: "#4A90E2",
    marginRight: 4,
  },
  productList: {
    padding: 8,
  },
  productRow: {
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
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
  addToCartButton: {
    backgroundColor: "#FF9900",
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
  },
  addToCartText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  wishlistButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 6,
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
  filterOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  filterOptionSelected: {
    backgroundColor: "#4A90E2",
  },
  filterOptionText: {
    fontSize: 16,
    color: "#333",
  },
  filterOptionTextSelected: {
    color: "#FFF",
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
  productCategory: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  
});
