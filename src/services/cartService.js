import {
  addToCartAPI,
  getCartAPI,
  reduceCartItemAPI,
  remmoveCartItemAPI,
  updateCartItemQuantityAPI,
} from "../api/apiCart";

export const addToCart = async (productId, quantityToAdd, token) => {
  try {
    const response = await addToCartAPI(productId, quantityToAdd, token);
    return response.data;
  } catch (error) {
    console.error("Add to cart failed", error);
    throw new Error("Chỉ còn 1 sản phẩm!");
  }
};

export const getUserCart = async (sortBy = "") => {
  try {
    const response = await getCartAPI(sortBy);
    return response.data.data.$values;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

export const reduceCartItem = async (id, token) => {
  try {
    const response = await reduceCartItemAPI(id, token);
    return response;
  } catch (error) {
    console.error("Error reducing cart item:", error);
    throw error;
  }
};

export const removeCartItem = async (id, token) => {
  try {
    const response = await remmoveCartItemAPI(id, token);
    return response;
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw new Error("Error removing cart item");
  }
};

export const updateCartItemQuantity = async (cartItemId, quantity, token) => {
  try {
    const response = await updateCartItemQuantityAPI(
      cartItemId,
      quantity,
      token
    );
    // console.log("Cart item quantity updated successfully");
    return response.data;
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    throw new Error("Error updating cart item quantity: " + error.message);
  }
};
