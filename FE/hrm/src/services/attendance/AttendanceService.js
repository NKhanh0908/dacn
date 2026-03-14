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

// /* Tạo chấm công thủ công */
// export const createManualAttendance = async (data, config = {}) => {
//   const response = await api.post(`${ATTENDANCE}/${ATTENDANCE_MANUAL}`, data, config);
//   return response.data;
// };

// /* Lấy attendance theo ID */
// export const getAttendanceById = async (attendanceId, config = {}) => {
//   const response = await api.get(`${ATTENDANCE}/${attendanceId}`, config);
//   return response.data;
// };

// /* Cập nhật attendance */
// export const updateAttendance = async (attendanceId, data, config = {}) => {
//   const response = await api.put(`${ATTENDANCE}/${attendanceId}`, data, config);
//   return response.data;
// };

// /* Xóa attendance */
// export const deleteAttendance = async (attendanceId, config = {}) => {
//   const response = await api.delete(`${ATTENDANCE}/${attendanceId}`, config);
//   return response.data;
// };

// /* Approve attendance */
// export const approveAttendance = async (attendanceId, config = {}) => {
//   const response = await api.post(
//     `${ATTENDANCE}/${attendanceId}/${ATTENDANCE_APPROVE}`,
//     {},
//     config
//   );
//   return response.data;
// };

// /* Filter danh sách attendance */
// export const filterAttendances = async (params, config = {}) => {
//   const response = await api.get(ATTENDANCE, {
//     params,
//     ...config
//   });
//   return response.data;
// };