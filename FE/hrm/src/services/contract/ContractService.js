import { api } from "../../config/axios";
import { 
  CONTRACT, 
  CONTRACT_FILTER, 
  CONTRACT_TERMINATE, 
  CONTRACT_SIGN 
} from "../../config/constants";

/* Tạo hợp đồng */
export const createContract = async (data, config = {}) => {
  const response = await api.post(CONTRACT, data, config);
  return response.data;
};

/* Lấy contract theo ID */
export const getContractById = async (contractId, config = {}) => {
  const response = await api.get(`${CONTRACT}/${contractId}`, config);
  return response.data;
};

/* Cập nhật contract */
export const updateContract = async (contractId, data, config = {}) => {
  const response = await api.patch(`${CONTRACT}/${contractId}`, data, config);
  return response.data;
};

/* Xóa contract */
export const deleteContract = async (contractId, config = {}) => {
  const response = await api.delete(`${CONTRACT}/${contractId}`, config);
  return response.data;
};

/* Ký hợp đồng */
export const signContract = async (contractId, config = {}) => {
  const response = await api.post(`${CONTRACT}/${contractId}/${CONTRACT_SIGN}`, {}, config);
  return response.data;
};

/* Chấm dứt hợp đồng */
export const terminateContract = async (contractId, config = {}) => {
  const response = await api.post(`${CONTRACT}/${contractId}/${CONTRACT_TERMINATE}`, {}, config);
  return response.data;
};

/* Lọc danh sách contract */
export const filterContracts = async (params, config = {}) => {
  const response = await api.get(`${CONTRACT}/${CONTRACT_FILTER}`, {
    params,
    ...config
  });
  return response.data;
};