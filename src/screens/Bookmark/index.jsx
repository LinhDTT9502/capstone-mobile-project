import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState([]);
  const navigation = useNavigation();

  // Load bookmarks từ AsyncStorage khi màn hình được mở
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const storedBookmarks = await AsyncStorage.getItem("bookmarks");
        if (storedBookmarks) {
          setBookmarks(JSON.parse(storedBookmarks));
        }
      } catch (error) {
        console.error("Error loading bookmarks:", error);
      }
    };

    loadBookmarks();
  }, []);

  // Xử lý xóa sản phẩm khỏi Bookmark
  const handleRemoveBookmark = async (item) => {
    const updatedBookmarks = bookmarks.filter(
      (bookmark) => bookmark.id !== item.id
    );
    setBookmarks(updatedBookmarks);
    await AsyncStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
    Alert.alert("Thông báo", "Đã xóa mục khỏi danh sách Bookmark.");
  };

  // Hiển thị từng sản phẩm Bookmark dưới dạng card
  const renderBookmark = ({ item }) => (
    <View style={styles.bookmarkCard}>
      {/* Hình ảnh sản phẩm */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ProductDetail", { productId: item.id })
        }
      >
        <Image
          source={{
            uri: item.imageUrl || "https://via.placeholder.com/150",
          }}
          style={styles.bookmarkImage}
        />
      </TouchableOpacity>

      {/* Thông tin sản phẩm */}
      <View style={styles.bookmarkInfo}>
        <Text style={styles.bookmarkTitle} numberOfLines={2}>
          {item.title || "Tên sản phẩm không có"}
        </Text>
        <Text style={styles.bookmarkPrice}>
          {item.price ? `${item.price.toLocaleString()} ₫` : "Giá không có"}
        </Text>
      </View>

      {/* Nút xóa */}
      <TouchableOpacity
        onPress={() => handleRemoveBookmark(item)}
        style={styles.removeButton}
      >
        <Text style={styles.removeButtonText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {bookmarks.length === 0 ? (
        <Text style={styles.emptyText}>Danh sách Bookmark của bạn trống!</Text>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBookmark}
          numColumns={2} // Hiển thị 2 card mỗi hàng
          columnWrapperStyle={styles.row} // Style cho hàng
          contentContainerStyle={[
            styles.contentContainer,
            bookmarks.length === 0 && styles.emptyList,
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
  bookmarkCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  bookmarkImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  bookmarkInfo: {
    padding: 12,
  },
  bookmarkTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  bookmarkPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF5733",
  },
  removeButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: "center",
    marginTop: 8,
    marginHorizontal: 12,
    borderRadius: 6,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  emptyList: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
});
