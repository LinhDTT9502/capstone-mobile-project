import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  FlatList,
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
import LikeButton from "../../components/ProductDetail/LikeButton";

import { LogBox } from "react-native";
import {
  fetchComments,
  postComment,
  editComment,
  deleteComment,
  replyComment,
} from "../../services/commentService";
import {
  fetchProductById,
  getProductByProductCode,
  listColorsOfProduct,
  listSizesOfProduct,
  listConditionsOfProduct,
} from "../../services/productService";
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

LogBox.ignoreLogs([
  "VirtualizedLists should never be nested inside plain ScrollViews",
]);

const COMMENTS_PER_PAGE = 5;

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
  const [userComment, setUserComment] = useState("");
  const [userRating, setUserRating] = useState(0);

  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [page, setPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);

  // select
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [conditions, setConditions] = useState([]);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [basePrice, setBasePrice] = useState(0);

  const fetchProductColors = async (productCode) => {
    try {
      const response = await listColorsOfProduct(productCode);
      setColors(response.data.$values.map((item) => item.color)); // Assuming 'color' key
    } catch (error) {
      console.error("Error fetching colors:", error);
    }
  };

  const fetchProductSizes = async (productCode, color) => {
    try {
      const response = await listSizesOfProduct(productCode, color);
      setSizes(response.data.$values.map((item) => item.size)); // Assuming 'size' key
    } catch (error) {
      console.error("Error fetching sizes:", error);
    }
  };

  const fetchProductConditions = async (productCode, color, size) => {
    try {
      const response = await listConditionsOfProduct(productCode, color, size);
      setConditions(response.data.$values.map((item) => item.condition)); // Assuming 'condition' key
    } catch (error) {
      console.error("Error fetching conditions:", error);
    }
  };

  useEffect(() => {
    if (product.productCode) {
      fetchProductColors(product.productCode);
    }
  }, [product.productCode]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedSize(null); // Reset size and condition when color changes
    setSelectedCondition(null);
    fetchProductSizes(product.productCode, color);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSelectedCondition(null); // Reset condition when size changes
    fetchProductConditions(product.productCode, selectedColor, size);
  };

  const handleConditionSelect = (condition) => {
    setSelectedCondition(condition);
  };

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
      const productInfo = productData.$values[0];
      setProduct(productData.$values[0]);
      setLikes(productData.$values[0]?.likes || 0);
      setBasePrice(productInfo.price || 0);
      setTotalPrice((productInfo.price || 0) * quantity);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải thông tin sản phẩm.");
    }
  };

  // Update total price based on quantity and base price
  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
    setTotalPrice(basePrice * newQuantity);
  };

  const loadComments = async (newPage = 1) => {
    try {
      const response = await fetchComments(
        productId,
        newPage,
        COMMENTS_PER_PAGE
      );
      const newComments = response.data?.$values || [];

      if (newPage === 1) {
        setComments(newComments);
      } else {
        setComments((prevComments) => [...prevComments, ...newComments]);
      }

      setHasMoreComments(newComments.length === COMMENTS_PER_PAGE);
    } catch (error) {
      console.error("Error loading comments:", error);
      Alert.alert("Lỗi", "Không thể tải bình luận");
    }
  };

  const loadMoreComments = async () => {
    if (hasMoreComments) {
      const nextPage = page + 1;
      await loadComments(nextPage);
      setPage(nextPage);
    }
  };

  const handlePostComment = async (newComment) => {
    try {
      const token = await AsyncStorage.getItem("token");
      // console.log("Token:", token);
      if (!token) {
        Alert.alert("Lỗi", "Vui lòng đăng nhập để bình luận.");
        return;
      }
      const response = await postComment(productId, newComment, token);
      // console.log("Response:", response);
      loadComments();
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
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
    Alert.alert(
      "Thông báo",
      "Chức năng trả lời bình luận chưa được triển khai"
    );
  };

  const handleAddToCart = (type) => {
    Alert.alert("Thông báo", `Sản phẩm đã được thêm vào giỏ hàng! (${type})`);
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

  const updateProductImage = (color) => {
    const selectedProduct = productList.find((item) => item.color === color);
    if (selectedProduct) {
      setProductImage(selectedProduct.imgAvatarPath);
    }
  };
  const renderItem = ({ item }) => (
    <View style={styles.section}>
     {item.type === "image" && (
      <Image
        source={{
          uri: product.imgAvatarPath || "https://via.placeholder.com/300",
        }}
        style={styles.productImage}
      />
    )}
    {item.type === "info" && (
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
    )}
    {item.type === "selection" && (
      <View>
        {/* Color Selection */}
        <Text style={styles.sectionTitle}>Màu sắc</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={colors}
          keyExtractor={(color) => color}
          renderItem={({ item: color }) => (
            <TouchableOpacity
              onPress={() => handleColorSelect(color)}
              style={[
                styles.colorButton,
                selectedColor === color && styles.activeColorButton,
              ]}
            >
              <Text
                style={[
                  styles.colorButtonText,
                  selectedColor === color && styles.activeColorButtonText,
                ]}
              >
                {color}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Size Selection (visible after color selection) */}
        {selectedColor && (
          <>
            <Text style={styles.sectionTitle}>Kích thước</Text>
            <View style={styles.sizeSelector}>
              {sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  onPress={() => handleSizeSelect(size)}
                  style={[
                    styles.sizeButton,
                    selectedSize === size && styles.activeSizeButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.sizeButtonText,
                      selectedSize === size && styles.activeSizeButtonText,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Condition Selection (visible after size selection) */}
        {selectedColor && selectedSize && (
          <>
            <Text style={styles.sectionTitle}>Tình trạng</Text>
            <View style={styles.conditionSelector}>
              {conditions.map((condition) => (
                <TouchableOpacity
                  key={condition}
                  onPress={() => handleConditionSelect(condition)}
                  style={[
                    styles.conditionButton,
                    selectedCondition === condition &&
                      styles.activeConditionButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.conditionButtonText,
                      selectedCondition === condition &&
                        styles.activeConditionButtonText,
                    ]}
                  >
                    {condition}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>
    )}

      {item.type === "selection" && (
        <View style={styles.quantitySection}>
          <Text style={styles.sectionTitle}>Số lượng</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() =>
                handleQuantityChange(quantity > 1 ? quantity - 1 : 1)
              }
            >
              <FontAwesome name="minus" size={16} color={COLORS.dark} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(quantity + 1)}
            >
              <FontAwesome name="plus" size={16} color={COLORS.dark} />
            </TouchableOpacity>
          </View>
          <Text style={styles.totalPriceText}>
            Tổng giá: {formatCurrency(totalPrice)} ₫
          </Text>
          <View style={styles.addToCartContainer}>
          <AddToCartButton
            product={product}
            quantity={quantity}
            onAddToCart={() => handleAddToCart("add")}
          />
        </View>
        </View>
      )}
      {item.type === "specifications" && (
        <View>
          <Text style={styles.sectionTitle}>Thông số kỹ thuật</Text>
          <Text style={styles.specificationText}>
            Tình trạng: {product.condition}%
          </Text>
          <Text style={styles.specificationText}>
            Kích thước: {product.size}
          </Text>
          <Text style={styles.specificationText}>Màu sắc: {product.color}</Text>
        </View>
      )}
      {item.type === "promotions" && (
        <View>
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
      )}
      {item.type === "description" && (
        <View>
          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          <Text style={styles.descriptionText}>
            {product.description || "Không có mô tả"}
          </Text>
        </View>
      )}
      {item.type === "reviews" && (
        <View>
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
      )}
      {item.type === "comments" && (
        <Comment
          comments={comments}
          isLoggedIn={isLoggedIn}
          onPostComment={handlePostComment}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
          onReplyComment={handleReplyComment}
          loadMoreComments={loadMoreComments}
        />
      )}
    </View>
  );

  const sections = [
    { type: "image" },
    { type: "info" },
    { type: "selection" },
    { type: "specifications" },
    { type: "promotions" },
    { type: "description" },
    { type: "reviews" },
    { type: "comments" },
  ];

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

      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item, index) => `section-${index}`}
        style={styles.content}
      />

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
