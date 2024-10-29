import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../layouts/Header";
import Swiper from "react-native-swiper";
import demoProduct from "../../../assets/images/product_demo.jpg";
import ScrollingLogos from "../../components/ScrollingLogos";
import ProductDetail from "../ProductDetail";
import Footer from "../../components/Footer";

export default function HomePage() {
  const navigation = useNavigation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const menuOptions = [
    { name: "Trang chủ" },
    { name: "Sản phẩm", dropdown: true },
    { name: "Giới thiệu", screen: "Introduction" },
    { name: "Liên hệ" },
  ];

  const categories = [
    { icon: 'musical-notes', name: "Âm nhạc" },
    { icon: 'basketball', name: "Bóng rổ" },
    { icon: 'mic', name: "Microphone" },
    // { icon: 'volleyball', name: "Bóng chuyền" },
  ];

  const moreCategories = [
    { icon: 'football', name: "Bóng đá" },
    { icon: 'person', name: "Bóng chuyền" },
    { icon: 'barbell', name: "Dụng cụ tập gym" },
  ];

  const brands = ["adidas", "nike", "new-balance", "bmx", "yonex"];
  const products = Array(4).fill({
    name: "Nike Air Max 270 React ENG",
    price: "$19.5",
    image: demoProduct,
  });

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Danh mục</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
          {categories.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <Ionicons name={category.icon} size={24} color="#4A90E2" />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.seeMoreButton} onPress={() => setShowModal(true)}>
            <Text style={styles.seeMoreText}>Xem thêm</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal visible={showModal} transparent={true} animationType="slide" onRequestClose={() => setShowModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Nhiều danh mục khác</Text>
              <FlatList
                data={moreCategories}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.modalItem}>
                    <Ionicons name={item.icon} size={24} color="#4A90E2" />
                    <Text style={styles.modalItemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          autoplay={true}
          autoplayTimeout={3}
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}
          loop={true}
        >
          <View style={styles.slide}>
            <Image
              source={{ uri: "https://sporthouse.vn/upload_images/images/banner%20KM(1).jpg" }}
              style={styles.sliderImage}
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={{ uri: "https://thietkehaithanh.com/wp-content/uploads/2021/11/banner-giay-thietkehaithanh-800x304.jpg" }}
              style={styles.sliderImage}
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZEJzEPbuVrCyMZzH3925ylhxW_t2DqErYOQ&s" }}
              style={styles.sliderImage}
            />
          </View>
        </Swiper>

        <ScrollingLogos />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.brandContainer}>
          {brands.map((brand, index) => (
            <Image
              key={index}
              source={{
                uri: `https://placeholder.svg?height=50&width=50&text=${brand}`,
              }}
              style={styles.brandLogo}
            />
          ))}
        </ScrollView>

        <View style={styles.bestSellerHeader}>
          <Text style={styles.sectionTitle}>Sản phẩm mới</Text>
          <TouchableOpacity onPress={() => navigation.navigate("ProductList")}>
            <Text style={styles.seeMore}>Xem thêm</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productGrid}>
          {products.map((product, index) => (
            <TouchableOpacity
              key={index}
              style={styles.productCard}
              onPress={() => navigation.navigate("ProductDetail")}
            >
              <Image source={product.image} style={styles.productImage} />
              <Ionicons name="heart" size={16} color="#FF6B6B" style={styles.wishlistIcon} />
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productCategory}>Giày</Text>
              <Text style={styles.productPrice}>{product.price}</Text>
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={(e) => {
                  e.stopPropagation();
                  navigation.navigate("Cart");
                }}
              >
                <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
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
  seeMoreButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  seeMoreText: {
    color: "#4A90E2",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  modalItemText: {
    marginLeft: 10,
    fontSize: 16,
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#4A90E2",
    borderRadius: 8,
  },
  modalCloseButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  wrapper: {
    height: 200,
    marginTop: 10,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6F0FF",
  },
  sliderImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  dot: {
    backgroundColor: "#999",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: "#4A90E2",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  logoContainer: {
    height: 60,
    overflow: 'hidden',
    marginVertical: 20,
  },
  logoWrapper: {
    flexDirection: 'row',
  },
  logo: {
    width: 100,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandLogo: {
    width: 80,
    height: 40,
  },
  brandContainer: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  bestSellerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 16,
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
});