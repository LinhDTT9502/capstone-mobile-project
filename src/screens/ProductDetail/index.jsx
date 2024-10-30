import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchProductById } from "../../services/productService";


const COLORS = {
  primary: "#0035FF",
  secondary: "#FA7D0B",
  dark: "#2C323A",
  light: "#CADDED",
  white: "#FFFFFF",
  black: "#000000"
};

export default function ProductDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params;

  const [product, setProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState("Blue");
  const [userComment, setUserComment] = useState("");

  useEffect(() => {
    loadProductDetails();
  }, [productId]);

  const loadProductDetails = async () => {
    try {
      const productData = await fetchProductById(productId);
      setProduct(productData);
    } catch (error) {
      Alert.alert("Error", "Failed to load product details.");
      console.error(error);
    }
  };

  const handleAddToCart = (type) => {
    Alert.alert("Thông báo", `Sản phẩm đã được thêm vào giỏ hàng! (${type})`);
  };

  const handleBuyNow = () => {
    handleAddToCart("buy");
    navigation.navigate("Cart");
  };

  const handleAddRentToCart = () => {
    if (!startDate || !endDate) {
      Alert.alert("Lỗi", "Vui lòng chọn ngày thuê.");
      return;
    }
    if (!isAgreed) {
      Alert.alert("Lỗi", "Bạn phải đồng ý với điều khoản thuê trước khi thêm vào giỏ.");
      return;
    }
    handleAddToCart("rent");
    setModalVisible(false);
  };

  if (!product) return <Text>Loading...</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.title}>Chi tiết sản phẩm</Text>
        <TouchableOpacity style={styles.heartButton}>
          <FontAwesome name="heart-o" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Image source={{ uri: product.imgAvatarPath || demoProduct }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.productName}</Text>
          <Text style={styles.productTag}>For exchange</Text>
          <Text style={styles.productPrice}>{product.price} ₫</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông số kỹ thuật</Text>
          <Text style={styles.specificationText}>Tình trạng: {product.condition}%</Text>
          <Text style={styles.specificationText}>{product.description || "No description available"}</Text>
          <Text style={styles.specificationText}>Vị trí: {product.location || "Unknown"}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.rowContainer}>
            <View style={styles.leftColumn}>
              <Text style={styles.sectionTitle}>Số lượng</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={[styles.quantityButton, { backgroundColor: COLORS.light }]}
                  onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                >
                  <FontAwesome name="minus" size={16} color={COLORS.dark} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={[styles.quantityButton, { backgroundColor: COLORS.light }]}
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <FontAwesome name="plus" size={16} color={COLORS.dark} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Màu sắc</Text>
              <View style={styles.colorSelector}>
                <TouchableOpacity
                  onPress={() => setColor("Blue")}
                  style={[styles.colorButton, color === "Blue" && styles.activeColor, { backgroundColor: COLORS.primary }]}
                />
                <TouchableOpacity
                  onPress={() => setColor("Orange")}
                  style={[styles.colorButton, color === "Orange" && styles.activeColor, { backgroundColor: COLORS.secondary }]}
                />
                <TouchableOpacity
                  onPress={() => setColor("Black")}
                  style={[styles.colorButton, color === "Black" && styles.activeColor, { backgroundColor: COLORS.black }]}
                />
              </View>
            </View>
            <View style={styles.rightColumn}>
              <TouchableOpacity 
                style={[styles.addToCartButton, { backgroundColor: COLORS.secondary }]} 
                onPress={() => handleAddToCart("buy")}
              >
                <FontAwesome name="shopping-cart" size={20} color={COLORS.white} />
                <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.addToCartButton, { backgroundColor: COLORS.primary, marginTop: 10 }]} 
                onPress={() => setModalVisible(true)}
              >
                <FontAwesome name="shopping-cart" size={20} color={COLORS.white} />
                <Text style={styles.addToCartText}>Thuê vào giỏ hàng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đánh giá & Nhận xét</Text>
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Nhập bình luận của bạn..."
              value={userComment}
              onChangeText={setUserComment}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity 
              style={styles.commentSubmitButton}
              onPress={() => Alert.alert("Thành công", "Bình luận của bạn đã được gửi")}
            >
              <Text style={styles.commentSubmitText}>Gửi bình luận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.buyNowButton]} 
          onPress={handleBuyNow}
        >
          <FontAwesome name="shopping-bag" size={20} color={COLORS.white} />
          <Text style={styles.actionButtonText}>Mua Ngay</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.rentButton]} 
          onPress={() => setModalVisible(true)}
        >
          <FontAwesome name="calendar" size={20} color={COLORS.white} />
          <Text style={styles.actionButtonText}>Thuê</Text>
        </TouchableOpacity>
      </View>

      {/* Rental Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thuê sản phẩm này</Text>
            <TextInput
              style={styles.dateInput}
              placeholder="Ngày bắt đầu (DD/MM/YYYY)"
              value={startDate}
              onChangeText={setStartDate}
            />
            <TextInput
              style={styles.dateInput}
              placeholder="Ngày kết thúc (DD/MM/YYYY)"
              value={endDate}
              onChangeText={setEndDate}
            />
            <View style={styles.checkboxContainer}>
              <TouchableOpacity onPress={() => setIsAgreed(!isAgreed)} style={styles.checkbox}>
                <FontAwesome 
                  name={isAgreed ? "check-square" : "square-o"} 
                  size={24} 
                  color={isAgreed ? COLORS.primary : COLORS.dark} 
                />
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Tôi đồng ý với các điều khoản thuê sản phẩm.</Text>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleAddRentToCart}>
              <Text style={styles.submitButtonText}>Thuê vào giỏ hàng</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
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
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  heartButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  productInfo: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 8,
  },
  productTag: {
    backgroundColor: COLORS.light,
    color: COLORS.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.secondary,
  },
  section: {
    padding: 16,
    backgroundColor: COLORS.white,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: COLORS.dark,
  },
  specificationText: {
    fontSize: 14,
    color: COLORS.dark,
    marginBottom: 8,
    lineHeight: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  leftColumn: {
    flex: 1.5,
  },
  rightColumn: {
    flex: 1,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: 8,
    overflow: "hidden",
  },
  quantityButton: {
    padding: 12,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 20,
    color: COLORS.dark,
  },
  colorSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  activeColor: {
    borderColor: COLORS.dark,
  },
  addToCartButton: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
  commentInputContainer: {
    marginBottom: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    minHeight: 80,
    textAlignVertical: 'top',
    color: COLORS.dark,
  },
  commentSubmitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  commentSubmitText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  
  commentContainer: {
    padding: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  commentText: {
    fontSize: 14,
    color: COLORS.dark,
  },
  commentDate: {
    fontSize: 12,
    color: "#999",
  },
  commentNotice: {
    fontSize: 12,
    color: "#999",
    marginBottom: 12,
  },
  bottomNav: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  buyNowButton: {
    backgroundColor: COLORS.primary,
  },
  rentButton: {
    backgroundColor: COLORS.secondary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: COLORS.dark,
  },
  dateInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: COLORS.dark,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 14,
    flex: 1,
    color: COLORS.dark,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    borderColor: COLORS.secondary,
    borderWidth: 1,
  },
  cancelButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: "bold",
  },
});