import { api } from "../../config/axios";
import { 
  ATTENDANCE_REQUESTS,
  ATTENDANCE_REVIEW,
  ATTENDANCE_PENDING,
  ATTENDANCE_MY_REQUESTS,
  ATTENDANCE_ALL
} from "../../config/constants";

/* Tạo yêu cầu chấm công */
export const createAttendanceRequest = async (data) => {
  const res = await api.post(ATTENDANCE_REQUESTS, data);
  return res.data.data;
};

/* Duyệt yêu cầu chấm công (approve / reject) */
export const reviewAttendanceRequest = async (id, data) => {
  const res = await api.post(`${ATTENDANCE_REQUESTS}/${id}/${ATTENDANCE_REVIEW}`, data);
  return res.data;
};

/* Lấy thông tin chi tiết một yêu cầu chấm công theo ID */
export const getAttendanceRequestById = async (id) => {
  const res = await api.get(`${ATTENDANCE_REQUESTS}/${id}`);
  return res.data;
};

/* Hủy yêu cầu chấm công */
export const cancelAttendanceRequest = async (id) => {
  const res = await api.delete(`${ATTENDANCE_REQUESTS}/${id}`);
  return res.data;
};

/* Lấy danh sách các yêu cầu chấm công đang chờ duyệt - Thường dành cho Manager / Admin */
export const getPendingAttendanceRequests = async () => {
  const res = await api.get(`${ATTENDANCE_REQUESTS}/${ATTENDANCE_PENDING}`);
  return res.data;
};

/* Lấy danh sách yêu cầu chấm công của chính user */
export const getMyAttendanceRequests = async () => {
  const res = await api.get(`${ATTENDANCE_REQUESTS}/${ATTENDANCE_MY_REQUESTS}`);
  return res.data;
};

/* Lấy tất cả yêu cầu chấm công trong hệ thống - Thường dành cho Admin */
export const getAllAttendanceRequests = async () => {
  const res = await api.get(`${ATTENDANCE_REQUESTS}/${ATTENDANCE_ALL}`);
  return res.data.data.content || [];
};