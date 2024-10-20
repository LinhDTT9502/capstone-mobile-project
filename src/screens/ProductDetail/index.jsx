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
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faHeart,
  faCheckSquare,
  faSquare,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import demoProduct from "../../../assets/images/product_demo.jpg";
import { useNavigation } from "@react-navigation/native";

export default function ProductDetail() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [side, setSide] = useState("M");

  const handleAddToCart = () => {
    if (!startDate || !endDate) {
      Alert.alert("Vui lòng chọn ngày thuê.");
      return;
    }

    if (!isAgreed) {
      Alert.alert("Bạn phải đồng ý với điều khoản trước khi tiếp tục.");
      return;
    }

    Alert.alert("Thuê sản phẩm đã được thêm vào giỏ hàng!");

    const rentalItem = {
      productName: "Nike Air Max 270 React ENG",
      startDate,
      endDate,
      quantity,
      side,
      type: "rent",
    };

    setModalVisible(false);
  };

  const handleBuyNow = () => {
    if (!startDate || !endDate) {
      Alert.alert("Vui lòng chọn ngày thuê.");
      return;
    }

    if (!isAgreed) {
      Alert.alert("Bạn phải đồng ý với điều khoản trước khi tiếp tục.");
      return;
    }

    Alert.alert("Đang chuyển đến trang thanh toán...");

    const rentalItem = {
      productName: "Nike Air Max 270 React ENG",
      startDate,
      endDate,
      quantity,
      side,
      type: "rent",
    };

    navigation.navigate("Cart", { rentalItem });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Chi tiết sản phẩm</Text>
        <FontAwesomeIcon icon={faHeart} size={20} color="#FF6B6B" />
      </View>

      <ScrollView style={styles.content}>
        <Image source={demoProduct} style={styles.productImage} />
        <Text style={styles.productName}>Nike Air Max 270 React ENG</Text>
        <Text style={styles.productTag}>For exchange</Text>

        <Text style={styles.sectionTitle}>Thông số kỹ thuật</Text>
        <Text style={styles.specificationText}>Tình trạng: Mới</Text>
        <Text style={styles.specificationText}>
          Mô tả: The Nike Air Max 270 React ENG combines a full-length React
          foam
        </Text>
        <Text style={styles.specificationText}>Vị trí: 123 ABC Street</Text>

        {/* Quantity and Side Selection */}
        <View style={styles.selectorContainer}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
            >
              <FontAwesomeIcon icon={faMinus} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <FontAwesomeIcon icon={faPlus} />
            </TouchableOpacity>
          </View>
{/* 
          <View style={styles.sideSelector}>
            <Text style={styles.selectorLabel}>Chọn Size:</Text>
            <TouchableOpacity onPress={() => setSide("M")} style={[styles.sideButton, side === "M" && styles.activeSide]}>
              <Text>M</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSide("L")} style={[styles.sideButton, side === "L" && styles.activeSide]}>
              <Text>L</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSide("XL")} style={[styles.sideButton, side === "XL" && styles.activeSide]}>
              <Text>XL</Text>
            </TouchableOpacity>
          </View> */}
        </View>

        <Text style={styles.sectionTitle}>Được đăng bởi:</Text>
        <View style={styles.uploaderContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/40" }}
            style={styles.uploaderImage}
          />
          <View style={styles.uploaderInfo}>
            <Text style={styles.uploaderName}>James Lawson</Text>
            <Text style={styles.publishedDate}>Được đăng: 21/02/2024</Text>
            <Text>⭐️⭐️⭐️⭐️☆</Text>
          </View>
        </View>

        {/* Comments and Reviews Section */}
        <Text style={styles.sectionTitle}>Đánh giá & Nhận xét</Text>
        <View style={styles.commentContainer}>
          <Text style={styles.commentUser}>Trần Văn A:</Text>
          <Text style={styles.commentText}>
            Giày rất đẹp và thoải mái. Dịch vụ nhanh chóng.
          </Text>
          <Text style={styles.commentDate}>24/02/2024</Text>
        </View>
        <View style={styles.commentContainer}>
          <Text style={styles.commentUser}>Nguyễn Thị B:</Text>
          <Text style={styles.commentText}>
            Rất hài lòng với chất lượng sản phẩm!
          </Text>
          <Text style={styles.commentDate}>22/02/2024</Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation for Add to Cart and Rent */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => Alert.alert("Sản phẩm đã được thêm vào giỏ hàng!")}
        >
          <Text style={styles.navButtonText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.navButtonText}>Thuê sản phẩm</Text>
        </TouchableOpacity>
      </View>

      {/* Rent Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
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
              <TouchableOpacity
                onPress={() => setIsAgreed(!isAgreed)}
                style={styles.checkbox}
              >
                <FontAwesomeIcon
                  icon={isAgreed ? faCheckSquare : faSquare}
                  size={24}
                  color={isAgreed ? "#4CAF50" : "#333"}
                />
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>
                Tôi đồng ý với các điều khoản thuê sản phẩm.
              </Text>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleAddToCart}>
              <Text style={styles.submitButtonText}>Thêm vào giỏ hàng</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
              <Text style={styles.buyNowButtonText}>Mua ngay</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:30,
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
  uploaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "#F9F9F9",
    padding: 8,
    borderRadius: 8,
  },
  uploaderImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  uploaderInfo: {
    flex: 1,
  },
  uploaderName: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  publishedDate: {
    fontSize: 12,
    color: "#999",
  },

  // Selector container for quantity and size
  selectorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
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
  sideSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  sideButton: {
    backgroundColor: "#E6F0FF",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  activeSide: {
    backgroundColor: "#4CAF50",
  },

  // Comment and Review Section
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

  // Bottom navigation for actions
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#FFF",
  },
  navButton: {
    flex: 1,
    backgroundColor: "#FF9900",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  navButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  // Modal styles for renting products
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
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
  checkboxLabel: {
    marginLeft: 10,
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
  buyNowButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  buyNowButtonText: {
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

