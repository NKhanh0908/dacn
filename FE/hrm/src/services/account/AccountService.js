import { api } from "../../config/axios";
import { ACCOUNTS } from "../../config/constants";

// Thêm tài khoản mới
export const createAccount = async (data) => {
  const response = await api.post(ACCOUNTS, data);
  return response.data;
};