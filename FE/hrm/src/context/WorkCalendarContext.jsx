import { createContext, useContext, useEffect, useState } from "react";
import { getWorkCalendarByYear, checkWorkingDay } from "../services";

// Tạo context dùng chung cho module lịch làm việc
const WorkCalendarContext = createContext();

export const WorkCalendarProvider = ({ children }) => {

  const [calendar, setCalendar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* Lấy lịch làm việc theo năm */
  const fetchWorkCalendar = async (year) => {
    try {
      setLoading(true);
      setError(null); // reset lỗi

      const res = await getWorkCalendarByYear(year);

      setCalendar(res || null);
    } catch (error) {
      if (error.response?.status === 404) {
        // case hợp lệ -> không cần log đỏ
        setError("Năm này chưa có lịch làm việc");
      } else {
        console.error("Get work calendar error:", error);
        setError("Lỗi hệ thống");
      }

      setCalendar(null);
    } finally {
      setLoading(false);
    }
  };

  /* Kiểm tra một ngày có phải ngày làm việc hay không */
  const isWorkingDay = async (date) => {
    try {
      const res = await checkWorkingDay(date);

      console.log("Check working day:", res);

      return res;
    } catch (error) {
      console.error("Check working day error:", error);
      return false;
    }
  };

  /* Khi load hệ thống -> lấy lịch năm hiện tại */
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    fetchWorkCalendar(currentYear);
  }, []);

  return (
    <WorkCalendarContext.Provider
      value={{
        calendar,
        loading,
        error,
        fetchWorkCalendar,
        isWorkingDay
      }}
    >
      {children}
    </WorkCalendarContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWorkCalendarContext = () => {
  return useContext(WorkCalendarContext);
};