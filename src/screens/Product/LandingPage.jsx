import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faSearch,
  faShoppingCart,
  faBell,
  faHeart,
  faUser,
  faMusic,
  faBasketballBall,
  faMicrophone,
  faVolleyballBall,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import BottomNavigation from "../../components/BottomNavigation";
import NotificationComponent from "../../components/NotificationsComponent"; 
import logoImage from "../../screens/Logo/2sport_logo.png";
import demoProduct from "../../../assets/images/product_demo.jpg";

export default function LandingPage() {
  const navigation = useNavigation();
  const [showNotifications, setShowNotifications] = useState(false);

  const categories = [
    { icon: faMusic, name: "Vũ" },
    { icon: faBasketballBall, name: "Quả bóng rổ" },
    { icon: faMicrophone, name: "Vật chất lỏng" },
    { icon: faVolleyballBall, name: "Quả bóng" },
  ];

  const brands = ["adidas", "nike", "new-balance", "bmx", "yonex"];

  const products = Array(4).fill({
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
            placeholder="Find something..."
          />
        </View>

        {/* Notification Icon */}
        <TouchableOpacity onPress={() => setShowNotifications(!showNotifications)}>
          <FontAwesomeIcon icon={faBell} size={20} color="#333" />
        </TouchableOpacity>

        {/* Cart Icon */}
        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          <FontAwesomeIcon icon={faShoppingCart} size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {showNotifications && (
        <NotificationComponent onClose={() => setShowNotifications(false)} />
      )}

      {/* Rest of the content */}
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Category</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {categories.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <FontAwesomeIcon
                  icon={category.icon}
                  size={24}
                  color="#4A90E2"
                />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>PLAY MORE,</Text>
          <Text style={styles.bannerTitle}>PAY LESS</Text>
          <Text style={styles.bannerSubtitle}>
            Welcome to our Ultimate Destination for Gently Used Sporting
            Excellence - Where the Game Never Ends, and the Savings Are Endless!
          </Text>
        </View>

        {/* Brands */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.brandContainer}
        >
          {brands.map((brand, index) => (
            <Image
              key={index}
              source={{
                uri: `/placeholder.svg?height=50&width=50&text=${brand}`,
              }}
              style={styles.brandLogo}
            />
          ))}
        </ScrollView>

        {/* Best Seller Section */}
        <View style={styles.bestSellerHeader}>
          <Text style={styles.sectionTitle}>Best seller</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("SearchingPage")}
          >
            <Text style={styles.seeMore}>See More</Text>
          </TouchableOpacity>
        </View>

        {/* Product Grid */}
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
              <Text style={styles.productCategory}>Shoes</Text>
              <Text style={styles.productPrice}>{product.price}</Text>
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={(e) => {
                  e.stopPropagation();
                  navigation.navigate("Cart");
                }}
              >
                <Text style={styles.addToCartText}>ADD TO CART</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      {/* <BottomNavigation /> */}
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginRight: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 8,
    marginRight: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
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
});
