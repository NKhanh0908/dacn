// import { api } from "../../config/axios";
// import { 
//   ATTENDANCE, 
//   ATTENDANCE_CHECKIN, 
//   ATTENDANCE_CHECKOUT, 
//   ATTENDANCE_TODAY, 
//   ATTENDANCE_STATISTICS, 
//   ATTENDANCE_MONTHLY 
// } from "../../config/constants";

// /* Check-in */
// export const checkIn = async (data) => {
//   const response = await api.post(`${ATTENDANCE}/${ATTENDANCE_CHECKIN}`, data);
//   return response.data.data;
// };

// /* Check-out */
// export const checkOut = async (data) => {
//   const response = await api.post(`${ATTENDANCE}/${ATTENDANCE_CHECKOUT}`, data);
//   return response.data.data;
// };

// /* Lấy chấm công hôm nay */
// export const getTodayAttendance = async (employeeId) => {
//   const response = await api.get(`${ATTENDANCE}/${ATTENDANCE_TODAY}/${employeeId}`);
//   return response.data.data;
// };

// /* Chấm công theo tháng */
// export const getMonthlyAttendance = async (employeeId, year, month) => {
//   const response = await api.get(`${ATTENDANCE}/${ATTENDANCE_MONTHLY}/${employeeId}`, {
//     params: { year, month }
//   });

//   return response.data.data;
// };

// /* Thống kê chấm công */
// export const getAttendanceStatistics = async (
//   employeeId,
//   startDate,
//   endDate,
//   config = {}
// ) => {
//   const response = await api.get(
//     `${ATTENDANCE}/${ATTENDANCE_STATISTICS}/${employeeId}`,
//     {
//       params: { startDate, endDate },
//       ...config
//     }
//   );

//   return response.data.data;
// };


import { api } from "../../config/axios";
import {
  ATTENDANCE,
  ATTENDANCE_CHECKIN,
  ATTENDANCE_CHECKOUT,
  ATTENDANCE_TODAY,
  ATTENDANCE_STATISTICS,
  ATTENDANCE_MONTHLY
} from "../../config/constants";

/* Check-in */
export const checkIn = async (data) => {
  const response = await api.post(`${ATTENDANCE}/${ATTENDANCE_CHECKIN}`, data);
  return response.data.data;
};

/* Check-out */
export const checkOut = async (data) => {
  const response = await api.post(`${ATTENDANCE}/${ATTENDANCE_CHECKOUT}`, data);
  return response.data.data;
};

/* Lấy chấm công hôm nay */
export const getTodayAttendance = async (employeeId) => {
  const response = await api.get(`${ATTENDANCE}/${ATTENDANCE_TODAY}/${employeeId}`);
  return response.data.data;
};

/* Chấm công theo tháng */
export const getMonthlyAttendance = async (employeeId, year, month) => {
  const response = await api.get(`${ATTENDANCE}/${ATTENDANCE_MONTHLY}/${employeeId}`, {
    params: { year, month }
  });

  return response.data.data;
};

/* Thống kê chấm công */
export const getAttendanceStatistics = async (
  employeeId,
  startDate,
  endDate,
  config = {}
) => {
  const response = await api.get(
    `${ATTENDANCE}/${ATTENDANCE_STATISTICS}/${employeeId}`,
    {
      params: { startDate, endDate },
      ...config
    }
  );

  return response.data.data;
};

/* Lấy tất cả chấm công */
export const getAttendances = async (params = {}) => {
  const response = await api.get(`${ATTENDANCE}`, { params });
  return response.data?.data || {};
};

/* Cập nhật attendance */
export const updateAttendance = async (attendanceId, data) => {
  const response = await api.put(`${ATTENDANCE}/${attendanceId}`, data);
  return response.data?.data;
};

/* Duyệt attendance */
export const approveAttendance = async (attendanceId) => {
  const response = await api.post(`${ATTENDANCE}/${attendanceId}/approve`);
  return response.data?.data;
};

/* Không duyệt attendance (FE tự đánh dấu local nếu BE chưa có API reject) */
export const rejectAttendanceLocal = async (attendance) => {
  return {
    ...attendance,
    isApproved: false,
    rejected: true
  };
};