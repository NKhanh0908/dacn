import { createContext, useContext, useEffect, useState } from "react";
import { getHolidaysByDateRange, checkHoliday } from "../services/holiday/HolidaysService";

// Tạo context dùng chung cho module ngày nghỉ
const HolidayContext = createContext();

export const HolidayProvider = ({ children }) => {

  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);

  /* Lấy danh sách ngày nghỉ từ hôm nay đến cuối năm */
  const fetchUpcomingHolidays = async () => {
    try {
      setLoading(true);

      const today = new Date();
      const fromDate = today.toISOString().split("T")[0];

      const toDate = new Date(today.getFullYear(), 11, 31)
        .toISOString()
        .split("T")[0];

      const res = await getHolidaysByDateRange(fromDate, toDate);

      console.log("Upcoming holidays:", res);

      setHolidays(res || []);

    } catch (error) {
      console.error("Get holidays error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* Kiểm tra một ngày có phải ngày nghỉ hay không */
  const isHoliday = async (date) => {
    try {
      const res = await checkHoliday(date);

      console.log("Check holiday:", res);

      return res;
    } catch (error) {
      console.error("Check holiday error:", error);
      return false;
    }
  };

  /* Khi component load -> lấy danh sách ngày nghỉ */
  useEffect(() => {
    fetchUpcomingHolidays();
  }, []);

  return (
    <HolidayContext.Provider
      value={{
        holidays,
        loading,
        fetchUpcomingHolidays,
        isHoliday
      }}
    >
      {children}
    </HolidayContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useHolidayContext = () => {
  return useContext(HolidayContext);
};