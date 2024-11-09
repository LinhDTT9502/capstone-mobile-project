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
  Dimensions,
} from "react-native";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

import AddToCartButton from "../../components/AddToCardButton";
import RentButton from "../../components/RentButton";
import BuyNowButton from "../../components/BuyNowButton";
import Comment from "../../components/ProductDetail/Comment";
import LikeButton from "../../components/ProductDetail/LikeBButton";

import {
  fetchComments,
  postComment,
  editComment,
  deleteComment,
  replyComment,
} from "../../services/commentService";
import { fetchProductById } from "../../services/productService";
import { fetchLikes, handleToggleLike } from "../../services/likeService";
import styles from "./css/ProductDetailStyles";
const screenWidth = Dimensions.get("window").width;

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

const PRODUCT_SIZES = ["3U5", "3U6", "4U5", "4U6"];
const PRODUCT_CONDITIONS = ["Mới", "Như mới", "Đã sử dụng"];

export default function ProductDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params;

  const [product, setProduct] = useState({});
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
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("Mới");
  const [userComment, setUserComment] = useState("");
  const [userRating, setUserRating] = useState(0);

  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    loadProductDetails();
    loadLikes();
    checkLoginStatus();
    loadComments();
  }, [productId]);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error("Error retrieving token:", error);
      setIsLoggedIn(false);
    }
  };

  const loadLikes = async () => {
    try {
      const likesData = await fetchLikes();
      setLikes(likesData.likes || 0);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const handleLikeToggle = async () => {
    if (!isLoggedIn) {
      return;
    }

    const newLikesCount = isLiked ? likes - 1 : likes + 1;
    setLikes(newLikesCount);
    setIsLiked(!isLiked);

    try {
      await handleToggleLike(productId, navigation);
      await loadProductDetails();
    } catch (error) {
      setLikes(likes);
      setIsLiked(!isLiked);
      Alert.alert("Lỗi", "Không thể thực hiện hành động like.");
    }
  };

  const loadProductDetails = async () => {
    try {
      const productData = await fetchProductById(productId);
      setProduct(productData.$values[0]);
      setLikes(productData.$values[0]?.likes || 0);
      setSize(productData.$values[0]?.size || "");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải thông tin sản phẩm.");
      console.error("Error loading product details:", error);
    }
  };

  const loadComments = async () => {
    try {
      const data = await fetchComments(productId);
      setComments(data);
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const handlePostComment = async (newComment) => {
    try {
      await postComment(productId, newComment);
      loadComments();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể đăng bình luận");
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    try {
      await editComment(commentId, newContent);
      loadComments();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể sửa bình luận");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      loadComments();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể xóa bình luận");
    }
  };

  const handleReplyComment = async (commentId) => {
    Alert.alert("Thông báo", "Chức năng trả lời bình luận chưa được triển khai");
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

  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

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
        <TouchableOpacity
          onPress={() => navigation.navigate("Cart")}
          style={styles.cartButton}
        >
          <Ionicons name="cart-outline" size={24} color={COLORS.dark} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Image
          source={{
            uri: product.imgAvatarPath || "https://via.placeholder.com/300",
          }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>
            {product.productName || "Tên sản phẩm không có"}
          </Text>
          <Text style={styles.productTag}>For exchange</Text>
          <View style={styles.priceContainer}>
            <View>
              <Text style={styles.productPrice}>
                {product.price
                  ? `${formatCurrency(product.price)} ₫`
                  : "Giá không có"}
              </Text>
              {product.discount && product.listedPrice ? (
                <>
                  <Text style={styles.originalPrice}>
                    {formatCurrency(product.listedPrice)} ₫
                  </Text>
                  <Text style={styles.discount}>Giảm {product.discount}%</Text>
                </>
              ) : null}
            </View>
            <LikeButton
              isLiked={isLiked}
              likes={likes}
              onPress={handleLikeToggle}
              disabled={!isLoggedIn}
            />
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

          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
            Kích thước
          </Text>
          <View style={styles.sizeSelector}>
            {PRODUCT_SIZES.map((sizeOption) => (
              <TouchableOpacity
                key={sizeOption}
                onPress={() => setSize(sizeOption)}
                style={[
                  styles.sizeButton,
                  size === sizeOption && styles.activeSize,
                ]}
              >
                <Text
                  style={[
                    styles.sizeButtonText,
                    size === sizeOption && styles.activeSizeText,
                  ]}
                >
                  {sizeOption}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
            Tình trạng
          </Text>
          <View style={styles.conditionSelector}>
            {PRODUCT_CONDITIONS.map((conditionOption) => (
              <TouchableOpacity
                key={conditionOption}
                onPress={() => setCondition(conditionOption)}
                style={[
                  styles.conditionButton,
                  condition === conditionOption && styles.activeCondition,
                ]}
              >
                <Text
                  style={[
                    styles.conditionButtonText,
                    condition === conditionOption && styles.activeConditionText,
                  ]}
                >
                  {conditionOption}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.addToCartContainer}>
            <AddToCartButton
              product={product}
              quantity={quantity}
              onAddToCart={() => handleAddToCart("add")}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông số kỹ thuật</Text>
          <Text style={styles.specificationText}>
            Tình trạng: {product.condition}%
          </Text>
          <Text style={styles.specificationText}>
            Kích thước: {product.size}
          </Text>
          <Text style={styles.specificationText}>Màu sắc: {product.color}</Text>
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
          <Text style={styles.descriptionText}>
            {product.description || "Không có mô tả"}
          </Text>
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

        <Comment
          comments={comments}
          isLoggedIn={isLoggedIn}
          onPostComment={handlePostComment}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
          onReplyComment={handleReplyComment}
        />
      </ScrollView>

      <View style={styles.bottomNav}>
        <View style={styles.buyNowContainer}>
          <BuyNowButton onPress={() => handleAddToCart("buy")} />
        </View>
        <View style={styles.rentContainer}>
          <RentButton onPress={() => setModalVisible(true)} />
        </View>
      </View>

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

