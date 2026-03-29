import { api } from "../../config/axios";
import { 
  HOLIDAYS,
  HOLIDAYS_UPCOMING,
  HOLIDAYS_SALARY_MULTIPLIER,
  HOLIDAYS_DATE_RANGE,
  HOLIDAYS_CHECK
} from "../../config/constants";

/*Lấy ngày nghỉ theo ID */
export const getHolidayById = async (id) => {
  const res = await api.get(`${HOLIDAYS}/${id}`);
  return res.data;
};

/*Tạo ngày nghỉ mới */
export const createHoliday = async (data, createdByEmployeeId) => {
  const res = await api.post(`${HOLIDAYS}`, data, {
    params: {
      createdByEmployeeId
    }
  });
  return res.data;
};

/*Cập nhật ngày nghỉ */
export const updateHoliday = async (id, data) => {
  const res = await api.put(`${HOLIDAYS}/${id}`, data);
  return res.data;
};

/*Xóa ngày nghỉ */
export const deleteHoliday = async (id) => {
  const res = await api.delete(`${HOLIDAYS}/${id}`);
  return res.data;
};

/*Lấy danh sách ngày nghỉ sắp tới */
export const getUpcomingHolidays = async () => {
  const res = await api.get(`${HOLIDAYS}/${HOLIDAYS_UPCOMING}`);
  return res.data;
};

/*Lấy hệ số lương của ngày lễ(dùng khi tính lương ngày lễ) */
export const getHolidaySalaryMultiplier = async (date) => {
  const res = await api.get(`${HOLIDAYS}/${HOLIDAYS_SALARY_MULTIPLIER}`, {
    params: { date }
  });
  return res.data;
};

/*Lấy danh sách ngày lễ trong khoảng thời gian */
export const getHolidaysByDateRange = async (fromDate, toDate) => {
  const res = await api.get(`${HOLIDAYS}/${HOLIDAYS_DATE_RANGE}`, {
    params: {
      fromDate,
      toDate
    }
  });
  return res.data;
};

/*Kiểm tra một ngày có phải ngày lễ hay không */
export const checkHoliday = async (date) => {
  const res = await api.get(`${HOLIDAYS}/${HOLIDAYS_CHECK}`, {
    params: { date }
  });
  return res.data;
};
