import { api, apiFile } from "../../config/axios";
import { EMPLOYEE, EMPLOYEE_GET_CURRENT, EMPLOYEE_CHECK_EXIST } from "../../config/constants";

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
export const createEmployee = async (formData, config = {}) => {
  const response = await apiFile.post(EMPLOYEE, formData, config);
  return response.data;
};

/* Cập nhật employee */
export const updateEmployee = async (formData, config = {}) => {
  const response = await apiFile.put(EMPLOYEE, formData, config);
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
