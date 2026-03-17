import { api } from "../../config/axios";
import { 
  PAYROLL,
  PAYROLL_CALCULATE_ALL,
  PAYROLL_SEARCH
} from "../../config/constants";

// Lấy payroll theo id
export const getPayrollById = async (payrollId) => {
  const response = await api.get(`${PAYROLL}/${payrollId}`);
  return response.data;
};

// Cập nhật payroll
export const updatePayroll = async (payrollId, data) => {
  const response = await api.put(`${PAYROLL}/${payrollId}`, data);
  return response.data;
}

// Xóa payroll
export const deletePayroll = async (payrollId) => {
  const response = await api.delete(`${PAYROLL}/${payrollId}`);
  return response.data;
}

// Lấy danh sách payroll
export const getPayrolls = async () => {
  const response = await api.get(PAYROLL);
  return response.data;
}

// Tạo payroll
export const createPayroll = async (data) => {
  const response = await api.post(PAYROLL, data);
  return response.data;
}

// Tính lương cho tất cả nhân viên
export const calculateAllPayrolls = async () => {
  const response = await api.post(`${PAYROLL}/${PAYROLL_CALCULATE_ALL}`);
  return response.data;
};

// Tìm kiếm payroll
export const searchPayrolls = async (employeeId, month, year) => {
  const response = await api.get(`${PAYROLL}/${PAYROLL_SEARCH}`, { params: { employeeId, month, year } });
  return response.data;
}