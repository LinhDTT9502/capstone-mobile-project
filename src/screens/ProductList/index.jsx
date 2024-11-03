import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AddToCartButton from '../../components/AddToCardButton';

import { fetchProducts, fetchProductsFiltered } from "../../services/productService";

const logoImage = require("../Logo/2sport_logo.png");

const COLORS = {
  primary: "#4A90E2",
  secondary: "#FF9900",
  background: "#F5F7FA",
  text: "#333333",
  border: "#E0E0E0",
};

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
  const [sortBy, setSortBy] = useState("");
  const [isAscending, setIsAscending] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000000);

  useEffect(() => {
    loadProducts();
  }, [currentPage]);

  useEffect(() => {
    applySearchFilter();
  }, [searchQuery, products]);

  const applySearchFilter = () => {
    const query = removeVietnameseAccents(searchQuery.toLowerCase());
    setFilteredProducts(
      products.filter(product =>
        removeVietnameseAccents(product.productName.toLowerCase()).includes(query)
      )
    );
  };

  const removeVietnameseAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { total, products: fetchedProducts } = selectedFilters.length > 0
        ? await fetchProductsFiltered(sortBy, isAscending, selectedBrands, selectedCategories, minPrice, maxPrice)
        : await fetchProducts(currentPage);

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
    setSelectedFilters(prevFilters =>
      prevFilters.includes(filter.value)
        ? prevFilters.filter(f => f !== filter.value)
        : [...prevFilters, filter.value]
    );
    setSortBy(filter.sortBy);
    setIsAscending(filter.ascending);
  };

  const applyFilters = () => {
    setCurrentPage(1);
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
        defaultSource={require("../../../assets/images/product_demo.jpg")}      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.productName}</Text>
        <Text style={styles.productCategory} numberOfLines={1}>{item.categoryName}</Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString()} ₫</Text>
        <AddToCartButton onAddToCart={() => {}} />
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
          <Ionicons name="options-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {selectedFilters.length > 0 && (
        <FlatList
          horizontal
          data={selectedFilters}
          renderItem={({ item }) => {
            const filter = filters.find(f => f.value === item);
            return (
              <TouchableOpacity
                style={styles.filterChip}
                onPress={() => toggleFilter(filter)}
              >
                <Text style={styles.filterChipText}>{filter.label}</Text>
                <Ionicons name="close-circle" size={18} color={COLORS.primary} />
              </TouchableOpacity>
            );
          }}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          style={styles.filterChips}
        />
      )}

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
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                style={[
                  styles.filterOption,
                  selectedFilters.includes(filter.value) && styles.filterOptionSelected,
                ]}
                onPress={() => toggleFilter(filter)}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedFilters.includes(filter.value) && styles.filterOptionTextSelected,
                ]}>
                  {filter.label}
                </Text>
                {selectedFilters.includes(filter.value) && (
                  <Ionicons name="checkmark" size={20} color="#FFF" />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
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
    paddingTop:30,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
    backgroundColor: COLORS.background,
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
    color: COLORS.primary,
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
    backgroundColor: COLORS.background,
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
    color: COLORS.text,
  },
  productCategory: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.background,
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
    color: COLORS.text,
  },
  filterOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterOptionSelected: {
    backgroundColor: COLORS.primary,
  },
  filterOptionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  filterOptionTextSelected: {
    color: COLORS.background,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  applyButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
});