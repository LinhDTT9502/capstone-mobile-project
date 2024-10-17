import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faSearch,
  faShoppingCart,
  faFilter,
  faSortAmountDown,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import BottomNavigation from "../../components/BottomNavigation";
import logoImage from "../../screens/Logo/2sport_logo.png";
import demoProduct from "../../../assets/images/product_demo.jpg";

export default function Component() {
  const navigation = useNavigation();
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [isInlineFilterVisible, setInlineFilterVisible] = useState(false);

  const toggleFilterModal = () => setFilterModalVisible(!isFilterModalVisible);
  const toggleInlineFilter = () =>
    setInlineFilterVisible(!isInlineFilterVisible);

  const filters = ["Mới", "Ho Chi Minh"];
  const products = Array(6).fill({
    name: "Nike Air Max 270 React ENG",
    price: "$19.5",
    image: demoProduct,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImage} style={styles.logoImage} />
        <View style={styles.searchContainer}>
          <FontAwesomeIcon icon={faSearch} size={16} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm..."
          />
        </View>
        <TouchableOpacity onPress={toggleFilterModal}>
          <FontAwesomeIcon
            icon={faFilter}
            size={20}
            color="#4A90E2"
            style={styles.filterIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleInlineFilter}>
          <FontAwesomeIcon
            icon={faSortAmountDown}
            size={20}
            color="#4A90E2"
            style={styles.sortIcon}
          />
        </TouchableOpacity>
      </View>

      {isInlineFilterVisible && (
        <View style={styles.inlineFilterContainer}>
          {filters.map((filter, index) => (
            <TouchableOpacity key={index} style={styles.inlineFilterButton}>
              <Text style={styles.inlineFilterText}>Loại lọc: {filter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView style={styles.content}>
        <View style={styles.productGrid}>
          {products.map((product, index) => (
            <TouchableOpacity
              key={index}
              style={styles.productCard}
              onPress={() => navigation.navigate("ProductDetail")}
            >
              <Image source={product.image} style={styles.productImage} />
              <FontAwesomeIcon
                icon={faHeart}
                size={16}
                color="#FF6B6B"
                style={styles.wishlistIcon}
              />
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productCategory}>Giày</Text>
              <Text style={styles.productPrice}>{product.price}</Text>
              <TouchableOpacity 
                style={styles.addToCartButton} 
                onPress={(e) => {
                  e.stopPropagation();
                  navigation.navigate("Cart"); 
                }}>
                <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleFilterModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={toggleFilterModal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Lọc tìm kiếm</Text>

            <Text style={styles.filterSectionTitle}>Điều kiện</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity style={styles.filterOption}>
                <Text style={styles.filterOptionText}>Mới</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterOption}>
                <Text style={styles.filterOptionText}>Cũ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterOption}>
                <Text style={styles.filterOptionText}>Không xác định</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  // Existing styles
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
  },
  logoImage: {
    width: 100,
    height: 40,
    resizeMode: "contain",
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
    marginLeft: 16,
  },
  categoryContainer: {
    paddingLeft: 16,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 24,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E6F0FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    textAlign: "center",
  },
  banner: {
    backgroundColor: "#E6F0FF",
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  bannerSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  brandContainer: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  brandLogo: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  bestSellerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 16,
  },
  seeMore: {
    color: "#4A90E2",
    fontSize: 14,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  productCard: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  wishlistIcon: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  productCategory: {
    fontSize: 12,
    color: "#999",
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
    borderRadius: 4,
    padding: 8,
    alignItems: "center",
  },
  addToCartText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  cartIconContainer: {
    backgroundColor: "#4A90E2",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
  },
  filterIcon: {
    marginHorizontal: 8,
  },
  sortIcon: {
    marginHorizontal: 8,
  },
  inlineFilterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  inlineFilterButton: {
    backgroundColor: "#E6F0FF",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  inlineFilterText: {
    color: "#4A90E2",
    fontSize: 12,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    margin: 16,
    borderRadius: 8,
    padding: 16,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#4A90E2",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  filterSectionTitle: {
    fontSize: 16,
    marginVertical: 8,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterOption: {
    backgroundColor: "#E6F0FF",
    padding: 8,
    borderRadius: 8,
    margin: 4,
  },
  filterOptionText: {
    color: "#4A90E2",
  },
  applyButton: {
    backgroundColor: "#FF9900",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  applyButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
