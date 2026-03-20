import { api } from "../../config/axios";
import {
  LEAVE_REQUESTS,
  LEAVE_REQUESTS_REVIEW,
  LEAVE_REQUESTS_CANCEL,
  LEAVE_REQUESTS_MY,
  LEAVE_REQUESTS_FILTER
} from "../../config/constants";

/* Tạo đơn nghỉ phép */
export const createLeaveRequest = async (data) => {
  const res = await api.post(`${LEAVE_REQUESTS}`, data);
  return res.data;
};

/* Duyệt đơn nghỉ phép */
export const reviewLeaveRequest = async (id, data) => {
  const res = await api.put(`${LEAVE_REQUESTS}/${id}/${LEAVE_REQUESTS_REVIEW}`, data);
  return res.data;
};

/* Từ chối đơn nghỉ phép */
export const cancelLeaveRequest = async (id) => {
  const res = await api.put(`${LEAVE_REQUESTS}/${id}/${LEAVE_REQUESTS_CANCEL}`);
  return res.data;
};

/* Lấy đơn nghỉ phép theo ID */
export const getLeaveRequestById = async (id) => {
  const res = await api.get(`${LEAVE_REQUESTS}/${id}`);
  return res.data;
};

/* Lấy danh sách đơn của tôi */
export const getMyLeaveRequests = async () => {
  const res = await api.get(`${LEAVE_REQUESTS}/${LEAVE_REQUESTS_MY}`);
  return res.data;
};

/* Lọc danh sách đơn nghỉ phép */
export const filterLeaveRequests = async (params) => {
  const res = await api.get(`${LEAVE_REQUESTS}/${LEAVE_REQUESTS_FILTER}`, {
    params
  });
  return res.data;
};