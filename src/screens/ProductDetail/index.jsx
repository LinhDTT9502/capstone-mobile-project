import React, { useState } from "react";
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
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import demoProduct from "../../../assets/images/product_demo.jpg";
import { useNavigation } from "@react-navigation/native";

export default function ProductDetail() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState("Red");

  const handleAddToCart = () => {
    Alert.alert("Sản phẩm đã được thêm vào giỏ hàng!");
  };

  const handleBuyNow = () => {
    Alert.alert("Đang chuyển đến trang thanh toán...");
    navigation.navigate("Cart", { 
      item: {
        productName: "Nike Air Max 270 React ENG",
        startDate,
        endDate,
        quantity,
        color,
        type: "buy",
      },
    });
  };

  const handleRent = () => {
    if (!startDate || !endDate) {
      Alert.alert("Vui lòng chọn ngày thuê.");
      return;
    }
    if (!isAgreed) {
      Alert.alert("Bạn phải đồng ý với điều khoản trước khi tiếp tục.");
      return;
    }

    Alert.alert("Thuê sản phẩm đã được thêm vào giỏ hàng!");
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Chi tiết sản phẩm</Text>
        <FontAwesome name="heart" size={20} color="#FF6B6B" />
      </View>

      <ScrollView style={styles.content}>
        <Image source={demoProduct} style={styles.productImage} />
        <Text style={styles.productName}>Nike Air Max 270 React ENG</Text>
        <Text style={styles.productTag}>For exchange</Text>

        <Text style={styles.sectionTitle}>Thông số kỹ thuật</Text>
        <Text style={styles.specificationText}>Tình trạng: Mới</Text>
        <Text style={styles.specificationText}>
          Mô tả: The Nike Air Max 270 React ENG combines a full-length React foam
        </Text>
        <Text style={styles.specificationText}>Vị trí: 123 ABC Street</Text>

        {/* Quantity and Color Selector */}
        <Text style={styles.selectorLabel}>Số lượng:</Text>
        <View style={styles.selectorContainer}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
            >
              <FontAwesome name="minus" size={16} color="#333" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <FontAwesome name="plus" size={16} color="#333" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
        </View>

        {/* Color Selector */}
        <Text style={styles.selectorLabel}>Chọn màu:</Text>
        <View style={styles.colorSelector}>
          <TouchableOpacity
            onPress={() => setColor("Red")}
            style={[styles.colorButton, color === "Red" && styles.activeColor]}
          >
            <Text style={styles.colorText}>Đỏ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setColor("Blue")}
            style={[styles.colorButton, color === "Blue" && styles.activeColor]}
          >
            <Text style={styles.colorText}>Xanh</Text>
          </TouchableOpacity>
        </View>

        {/* Comments Section */}
        <Text style={styles.sectionTitle}>Đánh giá & Nhận xét</Text>
        <Text style={styles.commentNotice}>
          Bạn có thể bình luận. Nếu bạn đã mua sản phẩm này, bạn có thể đánh giá sản phẩm.
        </Text>
        <View style={styles.commentContainer}>
          <Text style={styles.commentUser}>Trần Văn A:</Text>
          <Text style={styles.commentText}>
            Giày rất đẹp và thoải mái. Dịch vụ nhanh chóng.
          </Text>
          <Text style={styles.commentDate}>24/02/2024</Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation for Buy Now and Rent */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.rentButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.rentButtonText}>Thuê sản phẩm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
          <Text style={styles.buyNowButtonText}>Mua Ngay</Text>
        </TouchableOpacity>
      </View>

      {/* Rent Modal */}
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
                <FontAwesome name={isAgreed ? "check-square" : "square-o"} size={24} color={isAgreed ? "#4CAF50" : "#333"} />
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Tôi đồng ý với các điều khoản thuê sản phẩm.</Text>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleRent}>
              <Text style={styles.submitButtonText}>Xác nhận thuê</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  productImage: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    marginBottom: 16,
    resizeMode: "contain",
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  productTag: {
    backgroundColor: "#E6F0FF",
    color: "#4A90E2",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#333",
  },
  specificationText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    lineHeight: 20,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  selectorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#E6F0FF",
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 12,
  },
  addToCartButton: {
    backgroundColor: "#FF9900",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addToCartText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  colorSelector: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  colorButton: {
    backgroundColor: "#E6F0FF",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  activeColor: {
    backgroundColor: "#4CAF50",
  },
  commentContainer: {
    padding: 10,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    marginBottom: 12,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  commentDate: {
    fontSize: 12,
    color: "#999",
  },
  commentNotice: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  bottomNav: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#FFF",
  },
  rentButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  rentButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: "#FF9900",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  buyNowButtonText: {
    color: "#FFF",
    fontSize: 16,
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
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  dateInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
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
  },
  submitButton: {
    backgroundColor: "#FF9900",
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#FFF",
    paddingVertical: 10,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    borderColor: "#FF6B6B",
    borderWidth: 1,
  },
  cancelButtonText: {
    color: "#FF6B6B",
    fontSize: 16,
    fontWeight: "bold",
  },
});
