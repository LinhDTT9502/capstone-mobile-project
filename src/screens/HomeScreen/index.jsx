import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';

// Assume these components are properly implemented
import Header from '../../layouts/Header';
import ScrollingLogos from '../../components/ScrollingLogos';
import { fetchCategories } from '../../services/categoryService';

const { width } = Dimensions.get('window');

const categoryIcons = {
  'Âm nhạc': 'musical-notes',
  'Vợt cầu lông': 'badminton',
  'Bóng rổ': 'basketball',
  'Bóng chuyền': 'volleyball',
  'Bóng đá': 'football',
  'Dụng cụ tập gym': 'dumbbell',
};

const bannerImages = [
  'https://sporthouse.vn/upload_images/images/banner%20KM(1).jpg',
  'https://thietkehaithanh.com/wp-content/uploads/2021/11/banner-giay-thietkehaithanh-800x304.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZEJzEPbuVrCyMZzH3925ylhxW_t2DqErYOQ&s',
];

const featuredProducts = [
  {
    id: '1',
    name: 'Adidas Ultraboost 21',
    price: '$180',
    image: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/dfa07f83ea7d4c94bac5622413432f16_9366/Giay_Ultraboost_5_trang_ID8840.jpg',
    description: 'Revolutionary running shoes with responsive cushioning.',
  },
  {
    id: '2',
    name: 'Yonex Astrox 88D Pro',
    price: '$220',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9KZJMYEXdNFzL5-Y2hM0n0zh_x35L_-P8Kg&s',
    description: 'Professional badminton racket for offensive players.',
  },
  {
    id: '3',
    name: 'Nike Phantom GT Elite',
    price: '$250',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2Vq8gZ6XiJD5xZolVrWrxZHNBH-G3tN6gIA&s',
    description: 'High-performance football boots with enhanced ball control.',
  },
];

const flashSaleProducts = [
  // Sample flash sale products
  {
    name: 'Product 1',
    price: '$50',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-Ts7IAS3SJ041ucSeE70bf79UWNnZLs8Pvg&s',
    discount: '20',
  },
  {
    name: 'Product 2',
    price: '$100',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-Ts7IAS3SJ041ucSeE70bf79UWNnZLs8Pvg&s',
    discount: '15',
  },
];

const recentlyViewedProducts = [
  // Sample recently viewed products
  {
    name: 'Product 3',
    price: '$75',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEjUFOspD24fKk_QJRCWd_pNv9DtFFhv0PZA&s',
  },
  {
    name: 'Product 4',
    price: '$120',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEjUFOspD24fKk_QJRCWd_pNv9DtFFhv0PZA&s',
  },
];

const promotionalContent = [
  {
    id: '1',
    title: 'Khám phá ngay',
    subtitle: 'Quẹt để khám phá',
    image: 'https://www.britsoc.co.uk/media/23986/adobestock_4437974.jpg',
    backgroundColor: '#B6D6F2',
    textColor: '#FFFFFF',
  },
  {
    id: '2',
    title: 'Ưu đãi độc quyền',
    subtitle: 'Giảm đến 50%',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaCjmMQYNQMkh-OXsGyKcbOb-Tg216WjI3gA&s',
    backgroundColor: '#FF6B6B',
    textColor: '#FFFFFF',
  },
];

const HomePage = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
  }, []);

  const renderCategory = useCallback(({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={styles.categoryIcon}>
        <MaterialCommunityIcons
          name={categoryIcons[item.categoryName] || 'shape-outline'}
          size={24}
          color="#4A90E2"
        />
      </View>
      <Text style={styles.categoryName}>{item.categoryName}</Text>
    </TouchableOpacity>
  ), []);

  const renderProductCard = (product) => (
    <TouchableOpacity
      key={product.name}
      style={styles.productCard}
      onPress={() => navigation.navigate("ProductDetail")}
    >
      <Image source={{ uri: product.image }} style={styles.productImage} />
      {product.discount && (
        <Text style={styles.discountTag}>{product.discount} OFF</Text>
      )}
      <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
      <Text style={styles.productPrice}>{product.price}</Text>
      <TouchableOpacity style={styles.addToCartButton}>
        <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderPromotionalCard = ({ item }) => (
    <TouchableOpacity 
      style={[styles.promotionalCard, { backgroundColor: item.backgroundColor }]}
      // onPress={() => navigation.navigate('Promotion', { id: item.id })}
    >
      <View style={styles.promotionalContent}>
        <View style={styles.promotionalTextContainer}>
          <Text style={[styles.promotionalTitle, { color: item.textColor }]}>{item.title}</Text>
          <Text style={[styles.promotionalSubtitle, { color: item.textColor }]}>{item.subtitle}</Text>
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

        <Text style={styles.sectionTitle}>Danh mục</Text>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        />

        <ScrollingLogos />

        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Sản phẩm mới</Text>
          <FlatList
            data={featuredProducts.slice(0, 6)}
            renderItem={({item}) => renderProductCard(item)}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.featuredProductsContainer}
          />
        </View>

        {/* New Promotional Section */}
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

        {/* Flash Sale Section */}
        <View style={styles.flashSaleSection}>
          <Text style={styles.sectionTitle}>Flash Saler</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {flashSaleProducts.map((product) => renderProductCard(product))}
          </ScrollView>
        </View>

        {/* Recently Viewed Section */}
        <View style={styles.recentlyViewedSection}>
          <Text style={styles.sectionTitle}>Đã xem gần đây</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentlyViewedProducts.map((product) => renderProductCard(product))}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('ProductList')}
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
    paddingTop:30,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
  },
  wrapper: {
    height: 200,
    marginBottom:30,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pagination: {
    bottom: 10,
  },
  dot: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    // marginBottom: 16,
    marginHorizontal: 16,
    color: '#333',
  },
  categoryContainer: {
    paddingHorizontal: 8,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  featuredSection: {
    marginTop: 16,
  },
  featuredProductsContainer: {
    padding: 8,
  },
  productCard: {
    width: (width - 48) / 2,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
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
  discountTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: "#FF6347",
    color: "#FFF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
  },
  addToCartButton: {
    backgroundColor: "#FF9900",
    borderRadius: 6,
    padding: 8,
    alignItems: "center",
  },
  addToCartText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  flashSaleSection: {
    marginVertical: 20,
    backgroundColor: '#FFF3E0', // Light orange background
    padding: 16,
    borderRadius: 12,
  },
  recommendedSection: {
    marginVertical: 20,
  },
  recentlyViewedSection: {
    marginVertical: 20,
    backgroundColor: '#E3F2FD', // Light blue background
    padding: 16,
    borderRadius: 12,
  },
  viewAllButton: {
    backgroundColor: '#4A90E2',
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewAllText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  promotionalSection: {
    marginTop: 24,
    paddingBottom: 16,
    backgroundColor: '#F5F7FA',
  },
  promotionalContainer: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  promotionalCard: {
    width: width - 48,
    height: 180,
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  promotionalContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
  },
  promotionalTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  promotionalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  promotionalSubtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  promotionalImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  animatedContainer: {
    transform: [{ scale: 1 }],
  },
  enhancedTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  enhancedSubtitle: {
    fontSize: 18,
    letterSpacing: 0.5,
    opacity: 0.9,
  },
});

export default HomePage;