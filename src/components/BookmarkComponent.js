import React, { useState, useEffect } from "react";
import { TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const BookmarkComponent = ({
  item, // Thông tin của mục cần Bookmark
  token, // Token để xác thực người dùng
  style, // CSS tùy chỉnh cho nút Bookmark
  iconSize = 24, // Kích thước icon Bookmark
  color = "#3366FF", // Màu sắc của icon Bookmark
}) => {
  const [bookmarks, setBookmarks] = useState([]); // Danh sách Bookmark hiện tại
  const [isBookmarked, setIsBookmarked] = useState(false); // Trạng thái đã Bookmark

  // Load danh sách Bookmark từ AsyncStorage khi component được render
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const storedBookmarks = await AsyncStorage.getItem("bookmarks");
        if (storedBookmarks) {
          const parsedBookmarks = JSON.parse(storedBookmarks);
          setBookmarks(parsedBookmarks);
          setIsBookmarked(parsedBookmarks.some((bookmark) => bookmark.id === item.id));
        }
      } catch (error) {
        console.error("Error loading bookmarks:", error);
      }
    };
    loadBookmarks();
  }, [item.id]);

  // Hàm lưu Bookmark vào AsyncStorage
  const saveBookmarks = async (updatedBookmarks) => {
    try {
      await AsyncStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
      setBookmarks(updatedBookmarks); // Cập nhật danh sách Bookmark trong state
    } catch (error) {
      console.error("Error saving bookmarks:", error);
    }
  };

  // Hàm xử lý khi nhấn nút Bookmark
  const handleBookmarkToggle = async () => {
    if (!token) {
      Alert.alert("Thông báo", "Bạn cần đăng nhập để sử dụng tính năng Bookmark.");
      return;
    }

    let updatedBookmarks = [];
    if (isBookmarked) {
      // Xóa mục khỏi danh sách Bookmark
      updatedBookmarks = bookmarks.filter((bookmark) => bookmark.id !== item.id);
      setIsBookmarked(false);
      Alert.alert("Thành công", "Đã xóa sản phẩm khỏi Bookmark.");
    } else {
      // Thêm mục vào danh sách Bookmark
      const newItem = {
        id: item.id,
        title: item.title,
        price: item.price,
        imageUrl: item.imageUrl, // Đảm bảo có đủ thông tin
      };
      updatedBookmarks = [...bookmarks, newItem];
      setIsBookmarked(true);
      Alert.alert("Thành công", "Đã thêm sản phẩm vào Bookmark.");
    }

    saveBookmarks(updatedBookmarks); // Lưu danh sách cập nhật vào AsyncStorage
  };

  return (
    <TouchableOpacity
      style={style} // Áp dụng style truyền vào từ props
      onPress={handleBookmarkToggle} // Xử lý toggle Bookmark
    >
      <Ionicons
        name={isBookmarked ? "bookmark" : "bookmark-outline"} // Thay đổi icon dựa trên trạng thái
        size={iconSize} // Kích thước icon
        color={color} // Màu sắc icon
      />
    </TouchableOpacity>
  );
};

export default BookmarkComponent;
