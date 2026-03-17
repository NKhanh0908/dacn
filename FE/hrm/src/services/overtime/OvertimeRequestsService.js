import { api } from "../../config/axios";
import {
  OVERTIME_REQUESTS,
  OVERTIME_REQUESTS_REJECT,
  OVERTIME_REQUESTS_APPROVE,
} from "../../config/constants";

/* Tạo yêu cầu tăng ca */
export const createOvertimeRequest = async (data) => {
  const res = await api.post(OVERTIME_REQUESTS, data);
  return res.data;
};

/* Duyệt yêu cầu tăng ca (Admin / Manager) */
export const approveOvertimeRequest = async (id) => {
  const res = await api.put(`${OVERTIME_REQUESTS}/${id}/${OVERTIME_REQUESTS_APPROVE}`);
  return res.data;
};

/* Từ chối yêu cầu tăng ca (Admin / Manager) */
export const rejectOvertimeRequest = async (id) => {
  const res = await api.put(`${OVERTIME_REQUESTS}/${id}/${OVERTIME_REQUESTS_REJECT}`);
  return res.data;
};