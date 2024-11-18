// services/checkoutService.js
import { createSaleOrder as createSaleOrderApi } from '../api/apiSaleOrder';

export const processSaleOrder = async (orderData) => {
  try {
    const response = await createSaleOrderApi(orderData);
    return response.data;
  } catch (error) {
    console.error('Error processing sale order:', error);
    throw error;
  }
};

export const formatOrderData = (cartItems, userData, deliveryDetails) => {
  return {
    fullName: userData.fullName,
    email: userData.email,
    contactPhone: userData.phoneNumber,
    address: userData.address,
    userID: deliveryDetails.userId,
    shipmentDetailID: deliveryDetails.shipmentId,
    deliveryMethod: deliveryDetails.deliveryMethod,
    gender: userData.gender || "string",
    branchId: deliveryDetails.branchId,
    dateOfReceipt: new Date().toISOString(),
    discountCode: deliveryDetails.discountCode || "string",
    note: deliveryDetails.note || "string",
    saleOrderDetailCMs: cartItems.map(item => ({
      productId: item.id,
      productName: item.productName,
      productCode: item.productCode || "string",
      quantity: item.quantity,
      unitPrice: item.price
    }))
  };
};

export const processCheckout = async (cartItems, userData, deliveryDetails) => {
  try {
    const orderData = formatOrderData(cartItems, userData, deliveryDetails);
    console.log("Order Data Sent to API:", JSON.stringify(orderData, null, 2));
    const response = await processSaleOrder(orderData);
    return response;
  } catch (error) {
    console.error("Error during checkout:", error.response?.data || error.message);
    throw error;
  }
};