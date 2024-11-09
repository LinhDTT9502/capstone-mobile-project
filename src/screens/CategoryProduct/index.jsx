import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { fetchProductsFiltered } from "../../services/productService";

const CategoryProduct = () => {
  const route = useRoute();
  const { categoryId, categoryName } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategoryProducts = async () => {
      try {
        const { products } = await fetchProductsFiltered(
          null,
          true,
          [],
          [categoryId],
          0,
          0
        );
        setProducts(products);
      } catch (error) {
        console.error("Error loading products by category:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCategoryProducts();
  }, [categoryId]);

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image
        source={{ uri: item.imgAvatarPath || item.image }}
        style={styles.productImage}
      />
      <Text style={styles.productName}>{item.productName || item.name}</Text>
      <Text style={styles.productPrice}>{item.price.toLocaleString()} ₫</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{categoryName}</Text>
      {loading ? (
        <Text>Loading products...</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.productsContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  productsContainer: { paddingBottom: 16 },
  productCard: {
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
  },
  productImage: { width: "100%", height: 150, borderRadius: 8 },
  productName: { fontSize: 16, fontWeight: "bold", marginTop: 8 },
  productPrice: { fontSize: 14, color: "#4A90E2", marginTop: 4 },
});

export default CategoryProduct;
