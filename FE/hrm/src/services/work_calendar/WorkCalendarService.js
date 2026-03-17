import { api } from "../../config/axios";
import {
  WORK_CALENDAR,
  WORK_CALENDAR_CHECK
} from "../../config/constants";

/* Tạo lịch làm việc cho năm mới */
export const createWorkCalendar = async (data) => {
  const res = await api.post(WORK_CALENDAR, data);
  return res.data;
};

/* Lấy lịch làm việc theo năm */
export const getWorkCalendarByYear = async (year) => {
  const res = await api.get(`${WORK_CALENDAR}/${year}`);
  return res.data;
};

/* Kiểm tra một ngày có phải ngày làm việc hay không  */
export const checkWorkingDay = async (date) => {
  const res = await api.get(`${WORK_CALENDAR}/${WORK_CALENDAR_CHECK}`, {
    params: { date }
  });
  return res.data;
};