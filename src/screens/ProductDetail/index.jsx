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
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchProductById } from "../../services/productService";
import { fetchLikes, handleToggleLike } from "../../services/likeService";
import DateTimePicker from "@react-native-community/datetimepicker";
import AddToCartButton from "../../components/AddToCardButton";
import RentButton from "../../components/RentButton";
import BuyNowButton from "../../components/BuyNowButton";

const COLORS = {
  primary: "#0035FF",
  secondary: "#FA7D0B",
  dark: "#2C323A",
  light: "#CADDED",
  white: "#FFFFFF",
  black: "#000000",
};

const PRODUCT_COLORS = [
  { id: 1, name: "Xanh", code: "#0035FF" },
  { id: 2, name: "Cam", code: "#FA7D0B" },
  { id: 3, name: "Đen", code: "#000000" },
];

export default function ProductDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params;

  const [product, setProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 2))
  );

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState("Blue");
  const [userComment, setUserComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [likes, setLikes] = useState(0);

  const [comment, setComment] = useState("");

  const handleSubmitComment = () => {
    if (!comment.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung bình luận.");
      return;
    }
    Alert.alert("Thành công", "Bình luận của bạn đã được gửi");
    setComment("");
  };

  useEffect(() => {
    loadProductDetails();
    loadLikes();
  }, [productId]);

  const loadLikes = async () => {
    try {
      const likesData = await fetchLikes();
      setLikes(likesData.likes);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải số lượng lượt thích.");
    }
  };

  const handleLikeToggle = async () => {
    try {
      const result = await handleToggleLike(productId, navigation);
      if (result.error) {
        Alert.alert("Thông báo", result.error, [
          { text: "Hủy", style: "cancel" },
          { text: "Đăng nhập", onPress: () => navigation.navigate("Login") },
        ]);
        return;
      }

      setLikes(result.newLikesCount);
      Alert.alert("Thông báo", result.message);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể thực hiện hành động like.");
    }
  };

  const loadProductDetails = async () => {
    try {
      const productData = await fetchProductById(productId);
      setProduct({
        ...productData,
        originalPrice: 1428000,
        discount: 100,
        description:
          "Vợt cầu lông Yonex Astrox 100ZZ là một trong những cây vợt cao cấp nhất của Yonex, được thiết kế cho những người chơi chuyên nghiệp. Với công nghệ VOLUME CUT RESIN và ROTATIONAL GENERATOR SYSTEM, vợt mang lại khả năng đánh cầu mạnh mẽ và chính xác.",
      });
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
    if (startDate >= endDate) {
      Alert.alert("Lỗi", "Ngày kết thúc phải sau ngày bắt đầu.");
      return;
    }
    if (!isAgreed) {
      Alert.alert(
        "Lỗi",
        "Bạn phải đồng ý với điều khoản thuê trước khi thêm vào giỏ."
      );
      return;
    }
    handleAddToCart("rent");
    setModalVisible(false);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Helper function to format date as dd/mm/yyyy
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event, selectedDate, dateType) => {
    const selected =
      selectedDate || (dateType === "start" ? startDate : endDate);
    if (dateType === "start") {
      setShowStartDatePicker(false);
      if (selected < tomorrow) {
        Alert.alert("Lỗi", "Ngày bắt đầu phải từ ngày mai trở đi.");
      } else {
        setStartDate(selected);
      }
    } else {
      setShowEndDatePicker(false);
      if (selected <= startDate) {
        Alert.alert("Lỗi", "Ngày kết thúc phải sau ngày bắt đầu.");
      } else {
        setEndDate(selected);
      }
    }
  };

  const handleSubmitReview = () => {
    if (userRating === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn số sao đánh giá.");
      return;
    }
    Alert.alert("Thành công", "Đánh giá của bạn đã được gửi");
    setUserComment("");
    setUserRating(0);
  };

  if (!product) return <Text>Loading...</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.title}>Chi tiết sản phẩm</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <Image
          source={{
            uri: product.imgAvatarPath || "https://via.placeholder.com/300",
          }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.productName}</Text>
          <Text style={styles.productTag}>For exchange</Text>
          <View style={styles.priceContainer}>
            <View>
              <Text style={styles.productPrice}>
                {product.price.toLocaleString()} ₫
              </Text>
              <Text style={styles.originalPrice}>
                {product.originalPrice.toLocaleString()} ₫
              </Text>
              <Text style={styles.discount}>Giảm {product.discount}%</Text>
            </View>
            <TouchableOpacity
              style={styles.likeButton}
              onPress={handleLikeToggle}
            >
              <AntDesign name="like2" size={24} color="#0035FF" />
              <Text style={styles.likeCount}>{likes}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.rowContainer}>
            <View style={styles.columnContainer}>
              <Text style={styles.sectionTitle}>Số lượng</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    { backgroundColor: COLORS.light },
                  ]}
                  onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                >
                  <FontAwesome name="minus" size={16} color={COLORS.dark} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    { backgroundColor: COLORS.light },
                  ]}
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <FontAwesome name="plus" size={16} color={COLORS.dark} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Màu sắc</Text>
          <View style={styles.colorSelector}>
            {PRODUCT_COLORS.map((colorOption) => (
              <TouchableOpacity
                key={colorOption.id}
                onPress={() => setColor(colorOption.name)}
                style={[
                  styles.colorButton,
                  color === colorOption.name && styles.activeColor,
                  { backgroundColor: colorOption.code },
                ]}
              />
            ))}
          </View>
          <View style={styles.addToCartContainer}>
            <AddToCartButton onAddToCart={() => handleAddToCart("add")} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông số kỹ thuật</Text>
          <Text style={styles.specificationText}>
            Tình trạng: {product.condition}%
          </Text>
          <Text style={styles.specificationText}>
            Vị trí: {product.location || "Unknown"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ưu đãi</Text>
          <View style={styles.promotionContainer}>
            <Text style={styles.promotionItem}>
              ✓ Tặng 2 Quấn cán vợt Cầu Lông: VNB 001, VS002 hoặc Joto 001
            </Text>
            <Text style={styles.promotionItem}>
              ✓ Sơn logo mặt vợt miễn phí
            </Text>
            <Text style={styles.promotionItem}>
              ✓ Bảo hành lưới đan trong 72 giờ
            </Text>
            <Text style={styles.promotionItem}>
              ✓ Thay gen vợt miễn phí trọn đời
            </Text>
            <Text style={styles.promotionItem}>
              ✓ Tích luỹ điểm thành viên Premium
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đánh giá & Nhận xét</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setUserRating(star)}>
                <FontAwesome
                  name={star <= userRating ? "star" : "star-o"}
                  size={24}
                  color={star <= userRating ? COLORS.secondary : COLORS.dark}
                />
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Nhập đánh giá của bạn..."
              value={userComment}
              onChangeText={setUserComment}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity
              style={styles.commentSubmitButton}
              onPress={handleSubmitReview}
            >
              <Text style={styles.commentSubmitText}>Gửi đánh giá</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bình luận</Text>
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Nhập bình luận của bạn..."
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity
              style={styles.commentSubmitButton}
              onPress={handleSubmitComment}
            >
              <Text style={styles.commentSubmitText}>Gửi bình luận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <View style={styles.buyNowContainer}>
          <BuyNowButton onPress={() => handleAddToCart("buy")} />
        </View>
        <View style={styles.rentContainer}>
          <RentButton onPress={() => setModalVisible(true)} />
        </View>
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
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text>Ngày bắt đầu: {formatDate(startDate)}</Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                minimumDate={tomorrow}
                onChange={(event, selectedDate) =>
                  handleDateChange(event, selectedDate, "start")
                }
              />
            )}
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text>Ngày kết thúc: {formatDate(endDate)}</Text>
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                minimumDate={tomorrow}
                onChange={(event, selectedDate) =>
                  handleDateChange(event, selectedDate, "end")
                }
              />
            )}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                onPress={() => setIsAgreed(!isAgreed)}
                style={styles.checkbox}
              >
                <FontAwesome
                  name={isAgreed ? "check-square" : "square-o"}
                  size={24}
                  color={isAgreed ? COLORS.primary : COLORS.dark}
                />
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>
                Tôi đồng ý với các điều khoản thuê sản phẩm.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddRentToCart}
            >
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
    paddingTop: 30,
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
  placeholder: {
    width: 40,
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
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.secondary,
  },
  originalPrice: {
    fontSize: 16,
    color: COLORS.dark,
    textDecorationLine: "line-through",
  },
  discount: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: "bold",
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
  promotionContainer: {
    backgroundColor: "#FFF5F5",
    padding: 12,
    borderRadius: 8,
  },
  promotionItem: {
    fontSize: 14,
    color: COLORS.dark,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.dark,
    lineHeight: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
    textAlignVertical: "top",
    color: COLORS.dark,
  },
  commentSubmitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-end",
  },
  commentSubmitText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },

  actionButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
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
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  likeCount: {
    marginLeft: 4,
    fontSize: 16,
    color: COLORS.primary,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },

  bottomNav: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
  },
  buyNowContainer: {
    flex: 1,
    marginRight: 8,
  },
  rentContainer: {
    flex: 1,
    marginLeft: 8,
  },
  addToCartContainer: {
    marginTop: 16,
  },
});
