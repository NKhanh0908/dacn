import { createContext, useContext, useEffect, useState } from "react";
import { getWorkCalendarByYear, checkWorkingDay } from "../services";

// Tạo context dùng chung cho module lịch làm việc
const WorkCalendarContext = createContext();

export const WorkCalendarProvider = ({ children }) => {

  const [calendar, setCalendar] = useState(null);
  const [loading, setLoading] = useState(false);

  /* Lấy lịch làm việc theo năm */
  const fetchWorkCalendar = async (year) => {
    try {
      setLoading(true);

      console.log("Fetching work calendar:", year);

      const res = await getWorkCalendarByYear(year);

      console.log("Work calendar:", res);

      setCalendar(res || null);

    } catch (error) {
      console.error("Get work calendar error:", error);
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