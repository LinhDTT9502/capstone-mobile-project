// src/services/productService.js
import { getProductList, getProductById, getProductFilterBy, searchProducts as searchProductsAPI } from '../api/apiProduct';

export const fetchProducts = async (currentPage) => {
  try {
    const response = await getProductList(currentPage);
    const { total, data } = response.data;
    return { total, products: data.$values };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductsFiltered = async (
      sortBy,
      isAscending,
      selectedBrands,
      selectedCategories,
      minPrice,
      maxPrice
    ) => {
  try {
    const response = await getProductFilterBy(
      sortBy,
      isAscending,
      selectedBrands,
      selectedCategories,
      minPrice,
      maxPrice
    );
    const { total, data } = response.data;
    return { total, products: data.$values };
  } catch (error) {
    console.error('Error fetching sorted products:', error);
    throw error;
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await getProductById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

export const fetchProductsByCategory = async (categoryId, currentPage) => {
  try {
    const response = await getProductList(currentPage);
    const { total, data } = response.data;
    // console.log("API Response Data:", data.$values);

    // Lọc sản phẩm theo `categoryId`
    const filteredProducts = data.$values.filter(
      (product) => product.categoryID === categoryId
    );

    return { total, products: filteredProducts };
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

export const searchProducts = async (keywords) => {
  try {
    const response = await searchProductsAPI(keywords);
    return response.data;
  } catch (error) {
    console.error('Error in searchProducts:', error);
    throw error;
  }
};



