// services/likeService.js
import { getLikesAPI, toggleLikeProductAPI } from "../api/apiLike";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Hàm xử lý lấy số lượng likes
export const fetchLikes = async () => {
  try {
    const response = await getLikesAPI();
    return response.data;
  } catch (error) {
    console.error("Error in fetchLikes service:", error);
    throw error;
  }
};

export const handleToggleLike = async (productId, navigation) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      return;
    }

    const response = await toggleLikeProductAPI(productId, token);
    // console.log("API response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in handleToggleLike service:", error);
    throw error;
  }
};
