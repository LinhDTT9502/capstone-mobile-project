import axios from 'axios';

const API_BASE_URL = 'https://twosportapi-295683427295.asia-southeast2.run.app/api/SaleOrder';

// Get all sale orders
export const getAllSaleOrders = () => {
  return axios.get(`${API_BASE_URL}/list-all`, {
    headers: {
      'accept': '*/*'
    }
  });
};

// Get sale order by ID
export const getSaleOrderById = (id) => {
  return axios.get(`${API_BASE_URL}/${id}`, {
    headers: {
      'accept': '*/*'
    }
  });
};

// Create a new sale order
export const createSaleOrder = (orderData) => {
  return axios.post(`${API_BASE_URL}/create-sale-order`, orderData, {
    headers: {
      'accept': '*/*',
      'Content-Type': 'application/json'
    }
  });
};

// Update a sale order
export const updateSaleOrder = (id, saleOrderData) => {
  return axios.put(`${API_BASE_URL}/update/${id}`, saleOrderData, {
    headers: {
      'accept': '*/*',
      'Content-Type': 'application/json'
    }
  });
};

// Delete a sale order
export const deleteSaleOrder = (id) => {
  return axios.delete(`${API_BASE_URL}/delete/${id}`, {
    headers: {
      'accept': '*/*'
    }
  });
};

// Get sale orders by customer ID
export const getSaleOrdersByCustomerId = (customerId) => {
  return axios.get(`${API_BASE_URL}/get-by-customer/${customerId}`, {
    headers: {
      'accept': '*/*'
    }
  });
};

// Get sale orders by status
export const getSaleOrdersByStatus = (status) => {
  return axios.get(`${API_BASE_URL}/get-by-status/${status}`, {
    headers: {
      'accept': '*/*'
    }
  });
};

// Update sale order status
export const updateSaleOrderStatus = (id, status) => {
  return axios.put(`${API_BASE_URL}/update-status/${id}/${status}`, null, {
    headers: {
      'accept': '*/*'
    }
  });
};