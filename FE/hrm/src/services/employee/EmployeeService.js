import { api, apiFile } from "../../config/axios";
import { 
  EMPLOYEE, 
  EMPLOYEE_GET_CURRENT, 
  EMPLOYEE_CHECK_EXIST 
} from "../../config/constants";

/* Lấy employee hiện tại */
export const getCurrentEmployee = async (config = {}) => {
  const response = await api.get(`${EMPLOYEE}/${EMPLOYEE_GET_CURRENT}`, config);
  return response.data;
};

/* Lấy employee theo ID */
export const getEmployeeById = async (employeeId, config = {}) => {
  const response = await api.get(`${EMPLOYEE}/${employeeId}`, config);
  return response.data;
};

/* Tạo employee */
export const createEmployee = async (formData) => {
  const res = await apiFile.post(EMPLOYEE, formData);
  return res.data; // res.data là JSON body của API
};

/* Cập nhật employee */
export const updateEmployee = async (employeeId, data) => {
  const response = await apiFile.put(`${EMPLOYEE}/${employeeId}`, data);
  return response.data;
};

/* Xóa employee */
export const deleteEmployee = async (employeeId, config = {}) => {
  const response = await api.delete(`${EMPLOYEE}/${employeeId}`, config);
  return response.data;
};

/* Check tồn tại */
export const checkEmployeeExisted = async (employeeId, config = {}) => {
  const response = await api.get(`${EMPLOYEE}/${EMPLOYEE_CHECK_EXIST}/${employeeId}`, config);
  return response.data;
};

// Lấy danh sách tất cả employee (dành cho admin)
export const getAllEmployees = async (config = {}) => {
  const response = await api.get(EMPLOYEE, config);
  return response.data;
}