import { getLikesAPI, toggleLikeProductAPI } from '../api/apiLike';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hàm xử lý lấy số lượng likes
export const fetchLikes = async () => {
  try {
    const response = await getLikesAPI();
    // console.log('Likes fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in fetchLikes service:', error);
    throw error;
  }
};

// Hàm xử lý like/hủy like sản phẩm
export const handleToggleLike = async (productId, navigation) => {
  try {
    // const token = await AsyncStorage.getItem('token');
    // if (!token) {
    //   console.log('User not logged in. Requesting login.');
    //   return { error: 'Vui lòng đăng nhập để tiếp tục.' };
    // }

    const response = await toggleLikeProductAPI(productId, token);
    console.log('Like toggled successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in handleToggleLike service:', error);
    throw error;
  }
};
