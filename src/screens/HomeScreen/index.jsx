import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Swiper from "react-native-swiper";

import Header from "../../layouts/Header";
import ScrollingLogos from "../../components/HomeScreen/ScrollingLogos";
import { fetchCategories } from "../../services/categoryService";
import { fetchProducts } from "../../services/productService";
import styles from "./css/HomeStyles";

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
    image:
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/skwgyqrbfvnt6ux4ssap/air-zoom-pegasus-37-running-shoe-mwrTCc.png",
    discount: "20%",
  },
  {
    id: 2,
    name: "Áo thể thao Adidas Climacool",
    price: "800.000 ₫",
    image:
      "https://assets.adidas.com/images/w_600,f_auto,q_auto/5ce17825f3bd4bbd90f9ab9600a3f64c_9366/Ao_Thun_3_Soc_DJen_GN3495_01_laydown.jpg",
    discount: "15%",
  },
];

const recentlyViewedProducts = [
  {
    id: 1,
    name: "Bóng đá Nike Strike",
    price: "750.000 ₫",
    image:
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/17e7e6e4-5795-4c75-80a5-7d3c4ea4d6b3/strike-soccer-ball-GnljN8.png",
  },
  {
    id: 2,
    name: "Túi đựng vợt tennis Wilson",
    price: "1.200.000 ₫",
    image:
      "https://www.wilson.com/en-us/media/catalog/product/W/R/WR8002001001_0_Tour_2_Comp_Large_RD_BL.jpg",
  },
  {
    id: 3,
    name: "Túi đựng vợt tennis Wilson",
    price: "1.200.000 ₫",
    image:
      "https://www.wilson.com/en-us/media/catalog/product/W/R/WR8002001001_0_Tour_2_Comp_Large_RD_BL.jpg",
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
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaCjmMQYNQMkh-OXsGyKcbOb-Tg216WjI3gA&s",
    backgroundColor: "#FF6B6B",
    textColor: "#FFFFFF",
  },
];

const HomePage = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
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
      <TouchableOpacity
        style={styles.categoryItem}
        onPress={() => {
          navigation.navigate("CategoryProduct", {
            categoryName: item.categoryName,
          });
          setIsModalVisible(false);
        }}
      >
        <View style={styles.categoryIcon}>
          {item.categoryImgPath ? (
            <Image
              source={{ uri: item.categoryImgPath }}
              style={styles.categoryImage}
            />
          ) : (
            <View style={styles.placeholderIcon} />
          )}
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
        {typeof product.price === "number"
          ? product.price.toLocaleString()
          : product.price}{" "}
        ₫
      </Text>
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Danh mục</Text>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories.slice(0, 6)}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          />
        </View>
        <View>
          <Text style={styles.sectionTitle}>Thương hiệu</Text>
          <ScrollingLogos />
        </View>

        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sản phẩm mới</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("ProductList")}
            >
              <Text style={styles.viewAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

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
            {flashSaleProducts.map((product) =>
              renderProductCard(product, true)
            )}
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

        {/* <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => navigation.navigate("ProductList")}
        >
          <Text style={styles.viewAllText}>Xem tất cả sản phẩm</Text>
        </TouchableOpacity> */}
      </ScrollView>

      {/* Modal for Viewing All Categories */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tất cả danh mục</Text>
            <FlatList
              data={categories}
              renderItem={renderCategory}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              contentContainerStyle={styles.allCategoriesContainer}
            />
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomePage;
