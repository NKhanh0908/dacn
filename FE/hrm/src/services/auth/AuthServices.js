import { api } from "../../config/axios";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  SESSION_ACCOUNT,
  SESSION_LOGGED_IN
} from "../../config/constants";
import { getCurrentEmployee } from "../employee/EmployeeService";

/* Đăng nhập */
const authLogin = async (formData, config = {}) => {
  const response = await api.post("accounts/sign-in", formData, config);

  if (response.data && response.data.success) {
    console.log(">>check response token: ", response);

    const accessToken = response.data.data.token;
    const refreshToken = response.data.data.refreshToken;

    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
  }

  return response.data;
};

/* Đăng xuất */
const authLogout = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  sessionStorage.removeItem(SESSION_ACCOUNT);
  sessionStorage.removeItem(SESSION_LOGGED_IN);
};

/* Lấy thông tin user hiện tại */
const getProfile = (config = {}) => {
  return getCurrentEmployee(config);
};

/* Tạo tài khoản */
const createAccount = async (formData, config = {}) => {
  const response = await api.post("accounts", formData, config);
  return response.data;
};

/* Xác thực OTP */
const verify = async (verifyObject, config = {}) => {
  const response = await api.post("accounts/verify-otp", verifyObject, config);
  return response.data;
};

/* Reset mật khẩu */
const resetPassword = async (resetObject, config = {}) => {
  const response = await api.post("accounts/reset-password", resetObject, config);
  return response.data;
};

/* Quên mật khẩu */
const forgotPassword = async (forgotObject, config = {}) => {
  const response = await api.post("accounts/forgot-password", forgotObject, config);
  return response.data;
};

export {
  authLogin,
  authLogout,
  getProfile,
  createAccount,
  verify,
  resetPassword,
  forgotPassword
};
