import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Swiper from "react-native-swiper";

import Header from "../../layouts/Header";
import ScrollingLogos from "../../components/ScrollingLogos";
import { fetchCategories } from "../../services/categoryService";
import { fetchProducts } from "../../services/productService";

const { width } = Dimensions.get("window");

const categoryIcons = {
  "Âm nhạc": "musical-notes",
  "Vợt cầu lông": "badminton",
  "Bóng rổ": "basketball",
  "Bóng chuyền": "volleyball",
  "Bóng đá": "football",
  "Dụng cụ tập gym": "dumbbell",
};

const bannerImages = [
  "https://sporthouse.vn/upload_images/images/banner%20KM(1).jpg",
  "https://thietkehaithanh.com/wp-content/uploads/2021/11/banner-giay-thietkehaithanh-800x304.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZEJzEPbuVrCyMZzH3925ylhxW_t2DqErYOQ&s",
];

const flashSaleProducts = [
  {
    id: 1,
    name: "Giày chạy bộ Nike Air Zoom",
    price: "2.000.000 ₫",
    image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/skwgyqrbfvnt6ux4ssap/air-zoom-pegasus-37-running-shoe-mwrTCc.png",
    discount: "20%",
  },
  {
    id: 2,
    name: "Áo thể thao Adidas Climacool",
    price: "800.000 ₫",
    image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/5ce17825f3bd4bbd90f9ab9600a3f64c_9366/Ao_Thun_3_Soc_DJen_GN3495_01_laydown.jpg",
    discount: "15%",
  },
];

const recentlyViewedProducts = [
  {
    id: 1,
    name: "Bóng đá Nike Strike",
    price: "750.000 ₫",
    image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/17e7e6e4-5795-4c75-80a5-7d3c4ea4d6b3/strike-soccer-ball-GnljN8.png",
  },
  {
    id: 2,
    name: "Túi đựng vợt tennis Wilson",
    price: "1.200.000 ₫",
    image: "https://www.wilson.com/en-us/media/catalog/product/W/R/WR8002001001_0_Tour_2_Comp_Large_RD_BL.jpg",
  },
  {
    id: 3,
    name: "Túi đựng vợt tennis Wilson",
    price: "1.200.000 ₫",
    image: "https://www.wilson.com/en-us/media/catalog/product/W/R/WR8002001001_0_Tour_2_Comp_Large_RD_BL.jpg",
  },
];

const promotionalContent = [
  {
    id: "1",
    title: "Khám phá ngay",
    subtitle: "Quẹt để khám phá",
    image: "https://www.britsoc.co.uk/media/23986/adobestock_4437974.jpg",
    backgroundColor: "#B6D6F2",
    textColor: "#FFFFFF",
  },
  {
    id: "2",
    title: "Ưu đãi độc quyền",
    subtitle: "Giảm đến 50%",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaCjmMQYNQMkh-OXsGyKcbOb-Tg216WjI3gA&s",
    backgroundColor: "#FF6B6B",
    textColor: "#FFFFFF",
  },
];

const HomePage = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    const loadInitialProducts = async () => {
      try {
        const { products: initialProducts } = await fetchProducts(1);
        setProducts(initialProducts.slice(0, 4));
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };

    loadCategories();
    loadInitialProducts();
  }, []);

  const renderCategory = useCallback(
    ({ item }) => (
      <TouchableOpacity style={styles.categoryItem}>
        <View style={styles.categoryIcon}>
          <MaterialCommunityIcons
            name={categoryIcons[item.categoryName] || "shape-outline"}
            size={28}
            color="#4A90E2"
          />
        </View>
        <Text style={styles.categoryName}>{item.categoryName}</Text>
      </TouchableOpacity>
    ),
    []
  );

  const renderProductCard = (product, isFlashSale = false) => (
    <TouchableOpacity
      key={product.id}
      style={styles.productCard}
      onPress={() =>
        navigation.navigate("ProductDetail", { productId: product.id })
      }
    >
      <Image
        source={{ uri: product.image || product.imgAvatarPath }}
        style={styles.productImage}
      />
      {isFlashSale && (
        <View style={styles.discountTag}>
          <Text style={styles.discountText}>{product.discount} OFF</Text>
        </View>
      )}
      <Text style={styles.productName} numberOfLines={2}>
        {product.name || product.productName}
      </Text>
      <Text style={styles.productPrice}>
        {typeof product.price === 'number' ? product.price.toLocaleString() : product.price} ₫
      </Text>
      {/* <TouchableOpacity style={styles.addToCartButton}>
        <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
      </TouchableOpacity> */}
    </TouchableOpacity>
  );

  const renderPromotionalCard = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.promotionalCard,
        { backgroundColor: item.backgroundColor },
      ]}
    >
      <View style={styles.promotionalContent}>
        <View style={styles.promotionalTextContainer}>
          <Text style={[styles.promotionalTitle, { color: item.textColor }]}>
            {item.title}
          </Text>
          <Text style={[styles.promotionalSubtitle, { color: item.textColor }]}>
            {item.subtitle}
          </Text>
        </View>
        <Image source={{ uri: item.image }} style={styles.promotionalImage} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          autoplay
          autoplayTimeout={5}
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}
          paginationStyle={styles.pagination}
        >
          {bannerImages.map((image, index) => (
            <View key={index} style={styles.slide}>
              <Image source={{ uri: image }} style={styles.bannerImage} />
            </View>
          ))}
        </Swiper>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Danh mục</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          />
        </View>

        <ScrollingLogos />

        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Sản phẩm mới</Text>
          <View style={styles.featuredProductsContainer}>
            {products.map((product) => renderProductCard(product))}
          </View>
        </View>

        <View style={styles.promotionalSection}>
          <Text style={styles.sectionTitle}>Khám phá thêm</Text>
          <FlatList
            data={promotionalContent}
            renderItem={renderPromotionalCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promotionalContainer}
          />
        </View>

        <View style={styles.flashSaleSection}>
          <Text style={styles.sectionTitle}>Flash Sale</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {flashSaleProducts.map((product) => renderProductCard(product, true))}
          </ScrollView>
        </View>

        <View style={styles.recentlyViewedSection}>
          <Text style={styles.sectionTitle}>Đã xem gần đây</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentlyViewedProducts.map((product) =>
              renderProductCard(product)
            )}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => navigation.navigate("ProductList")}
        >
          <Text style={styles.viewAllText}>Xem tất cả sản phẩm</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#F5F7FA",
  },
  content: {
    flex: 1,
  },
  wrapper: {
    height: 200,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  pagination: {
    bottom: 10,
  },
  dot: {
    backgroundColor: "rgba(255,255,255,0.4)",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: "#FFFFFF",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  sectionContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    marginHorizontal: 16,
    color: "#333",
  },
  categoryContainer: {
    paddingHorizontal: 8,
  },
  categoryItem: {
    alignItems: "center",
    marginHorizontal: 12,
  },
  categoryIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E6F0FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryName: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
    fontWeight: "600",
  },
  featuredSection: {
    marginTop: 24,
  },
  featuredProductsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  productCard: {
    width: (width - 48) / 2,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 10,
  },
  discountTag: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF6347",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  addToCartButton: {
    backgroundColor: "#FF9900",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  addToCartText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  flashSaleSection: {
    marginVertical: 24,
    backgroundColor: "#FFF3E0",
    padding: 16,
    borderRadius: 16,
  },
  recentlyViewedSection: {
    marginVertical: 24,
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 16,
  },
  viewAllButton: {
    backgroundColor: "#4A90E2",
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  viewAllText: {
    
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  promotionalSection: {
    marginTop: 24,
    paddingBottom: 16,
    backgroundColor: "#F5F7FA",
  },
  promotionalContainer: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  promotionalCard: {
    width: width - 48,
    height: 180,
    marginHorizontal: 8,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  promotionalContent: {
    flex: 1,
    flexDirection: "row",
    padding: 16,
  },
  promotionalTextContainer: {
    flex: 1,
    justifyContent: "center",
    
  },
  promotionalTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  promotionalSubtitle: {
    fontSize: 18,
    opacity: 0.8,
  },
  promotionalImage: {
    width: 140,
    height: 140,
    borderRadius: 16,
  },
});

export default HomePage;