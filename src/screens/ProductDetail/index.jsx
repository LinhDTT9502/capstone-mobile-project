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
  const [currentUserId, setCurrentUserId] = useState(null);

  // select
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [conditions, setConditions] = useState([]);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [productList, setProductList] = useState([]);
  const [imagesByColor, setImagesByColor] = useState({});

  const [selectedImage, setSelectedImage] = useState("");
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [fullscreenImages, setFullscreenImages] = useState([]);

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem("currentUserId");
        // console.log("Fetched User ID:", userId); // Debug
        setCurrentUserId(userId ? parseInt(userId, 10) : null);
      } catch (error) {
        console.error("Error fetching current user ID:", error);
      }
    };

    fetchCurrentUserId();
  }, []);

  useEffect(() => {
    // console.log("currentUserId in ProductDetail:", currentUserId);
  }, [currentUserId]);

  const fetchProductColors = async (productCode) => {
    try {
      const response = await listColorsOfProduct(productCode);
      setColors(response.data.$values.map((item) => item.color));
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
    const loadProductList = async () => {
      try {
        const response = await getProductByProductCode(product.productCode);
        setProductList(response.$values || []);

        // Fetch images for each color from the beginning
        const initialImages = {};
        response.$values.forEach((item) => {
          if (!initialImages[item.color]) {
            initialImages[item.color] = item.imgAvatarPath; // Store first image per color
          }
        });
        setImagesByColor(initialImages); // Store in state for color-specific display
      } catch (error) {
        console.error("Lỗi khi tải danh sách sản phẩm:", error);
      }
    };

    if (product.productCode) {
      loadProductList();
    }
  }, [product.productCode]);

  useEffect(() => {
    if (product.productCode) {
      fetchProductColors(product.productCode);
    }
  }, [product.productCode]);

  const fetchProductPrice = (productCode, color, size, condition) => {
    try {
      const matchingProduct = productList.find(
        (product) =>
          product.productCode === productCode &&
          product.color === color &&
          product.size === size &&
          product.condition === condition
      );

      if (matchingProduct) {
        setTotalPrice(matchingProduct.price || 0);
        setProduct((prevProduct) => ({
          ...prevProduct,
          imgAvatarPath: matchingProduct.imgAvatarPath,
        }));
      } else {
        setTotalPrice("Hết Hàng/ Chưa có hàng");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật giá sản phẩm:", error);
    }
  };

  const fetchImagesByColor = (color) => {
    return productList
      .filter((product) => product.color === color)
      .map((product) => product.imgAvatarPath);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedSize(null);
    setSelectedCondition(null);

    // const images = fetchImagesByColor(color);
    // setFullscreenImages(images);
    // setSelectedImage(images[0] || "");

    // fetchProductSizes(product.productCode, color);

    const matchingProduct = productList.find(
      (product) =>
        product.color === color && product.productCode === product.productCode
    );

    if (matchingProduct) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        imgAvatarPath: matchingProduct.imgAvatarPath,
        price: matchingProduct.price || 0,
      }));
      setTotalPrice(matchingProduct.price || 0);
      setBasePrice(matchingProduct.price || 0);
    } else {
      setTotalPrice("Hết Hàng/ Chưa có hàng");
      setBasePrice(0);
    }

    // Tiếp tục lấy danh sách kích thước dựa trên màu đã chọn
    fetchProductSizes(product.productCode, color);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSelectedCondition(null);
    fetchProductConditions(product.productCode, selectedColor, size);
  };

  const handleConditionSelect = (condition) => {
    setSelectedCondition(condition);
    fetchProductPrice(
      product.productCode,
      selectedColor,
      selectedSize,
      condition
    );
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    loadProductDetails();
    loadLikes();
    checkLoginStatus();
    // loadComments();
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
      // console.log("Fetched Product Data by ID:", productData);

      // Trực tiếp sử dụng productData mà không cần $values
      const productCode = productData.productCode;

      if (!productCode) {
        Alert.alert("Lỗi", "Mã sản phẩm không hợp lệ.");
        return;
      }

      // Gọi API để lấy danh sách sản phẩm dựa trên productCode
      const productListResponse = await getProductByProductCode(productCode);
      // console.log("Product List by Product Code:", productListResponse);

      if (
        productListResponse &&
        productListResponse.$values &&
        productListResponse.$values.length > 0
      ) {
        const firstProduct = productListResponse.$values[0];
        setProduct(firstProduct);
        setLikes(firstProduct.likes || 0);
        setBasePrice(firstProduct.price || 0);
        setTotalPrice((firstProduct.price || 0) * quantity);
      } else {
        Alert.alert("Lỗi", "Không tìm thấy sản phẩm cho mã sản phẩm này.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải thông tin sản phẩm.");
      console.error("Error loading product details:", error);
    }
  };

  // Update total price based on quantity and base price
  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
    setTotalPrice(basePrice * newQuantity);
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
    return amount.toLocaleString();
  };

  const updateProductImage = (color) => {
    const colorSpecificImage = product.images?.find(
      (img) => img.color === color
    )?.imgAvatarPath;
    if (colorSpecificImage) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        imgAvatarPath: colorSpecificImage,
      }));
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.section}>
      {item.type === "image" && (
        <>
          <Image
            source={{
              uri:
                selectedImage ||
                product.imgAvatarPath ||
                "https://via.placeholder.com/300",
            }}
            style={styles.productImage}
          />

          <FlatList
            data={Object.values(imagesByColor)}
            horizontal
            keyExtractor={(image, index) => `${image}-${index}`}
            style={styles.thumbnailList}
            renderItem={({ item: image }) => (
              <TouchableOpacity
                onPress={() => setSelectedImage(image)}
                style={[
                  styles.thumbnailContainer,
                  selectedImage === image && styles.selectedThumbnail,
                ]}
              >
                <Image source={{ uri: image }} style={styles.thumbnailImage} />
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </>
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
                  styles.colorOptionContainer,
                  selectedColor === color && styles.activeColorOptionContainer,
                ]}
              >
                <Image
                  source={{
                    uri:
                      imagesByColor[color] || "https://via.placeholder.com/60",
                  }}
                  style={styles.colorOptionImage}
                />
                <Text
                  style={[
                    styles.colorOptionText,
                    selectedColor === color && styles.activeColorOptionText,
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
            Tổng giá:{" "}
            {typeof totalPrice === "string"
              ? totalPrice
              : `${formatCurrency(totalPrice)} ₫`}
          </Text>

          <View style={styles.addToCartContainer}>
            {typeof totalPrice === "string" ? (
              <Text style={{ color: "red", fontSize: 16, fontWeight: "bold" }}>
                {totalPrice}
              </Text>
            ) : (
              <AddToCartButton
                product={product}
                quantity={quantity}
                color={selectedColor}
                size={selectedSize}
                condition={selectedCondition}
                onAddToCart={() => handleAddToCart("add")}
              />
            )}
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
          productId={productId}
          isLoggedIn={isLoggedIn}
          currentUserId={currentUserId}
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

      <Modal
        visible={isImageModalVisible}
        transparent={true}
        onRequestClose={() => setIsImageModalVisible(false)}
      >
        <View style={styles.imageModalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsImageModalVisible(false)}
          >
            <AntDesign name="close" size={30} color="white" />
          </TouchableOpacity>
          <FlatList
            data={fullscreenImages}
            horizontal
            pagingEnabled
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.fullscreenImage} />
            )}
            keyExtractor={(image) => image}
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={fullscreenImages.indexOf(selectedImage)}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
