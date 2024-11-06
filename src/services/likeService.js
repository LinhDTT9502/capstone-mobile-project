// services/likeService.js
import { getLikesAPI, toggleLikeProductAPI } from '../api/apiLike';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hàm xử lý lấy số lượng likes
export const fetchLikes = async () => {
  try {
    const response = await getLikesAPI();
    return response.data;
  } catch (error) {
    console.error('Error in fetchLikes service:', error);
    throw error;
  }
};

export const handleToggleLike = async (productId, navigation) => {
  try {
    const token = await AsyncStorage.getItem('token');
    
    // Kiểm tra nếu không có token
    if (!token) {
      Alert.alert(
        "Thông báo",
        "Bạn vui lòng đăng nhập để tiếp tục.",
        [
          { text: "Hủy", style: "cancel" },
          { text: "Đăng nhập", onPress: () => navigation.navigate("Login") },
        ]
      );
      return { error: 'Vui lòng đăng nhập để tiếp tục.' };
    }

    const response = await toggleLikeProductAPI(productId, token);
    console.log('Like toggled successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in handleToggleLike service:', error);
    throw error;
  }
};
