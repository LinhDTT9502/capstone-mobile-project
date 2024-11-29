import axios from "axios";

export const getCustomerLoyalPoints = (userId) => {
  return axios.get(`/api/Customer/get-loyal-points`, {
    params: { userId },
  });
};
