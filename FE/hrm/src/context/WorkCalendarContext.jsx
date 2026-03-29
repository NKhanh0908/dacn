import { createContext, useContext, useEffect, useState } from "react";
import {
  getWorkCalendarByYear,
  checkWorkingDay,
  createWorkCalendar
} from "../services";

const WorkCalendarContext = createContext();

export const WorkCalendarProvider = ({ children }) => {

  const [calendar, setCalendar] = useState(null);
  const [calendars, setCalendars] = useState([]); 

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  // ================= GET BY YEAR (EMPLOYEE) =================
  const fetchWorkCalendar = async (year) => {
    try {
      setLoading(true);
      setError(null);

      const res = await getWorkCalendarByYear(year);
      setCalendar(res || null);

    } catch (error) {
      if (error.response?.status === 404) {
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

  // ================= SCAN MANY YEARS (ADMIN) =================
  const fetchAllCalendars = async () => {
    try {
      setLoading(true);

      const results = [];
      let year = new Date().getFullYear();

      while (true) {
        try {
          const res = await getWorkCalendarByYear(year);

          if (!res) break;

          results.push(res);
          year += 1;

        } catch (err) {
          if (err.response?.status === 404) {
            break; 
          } else {
            console.error(err);
            break;
          }
        }
      }

      setCalendars(results);

    } catch (err) {
      console.error("Fetch all calendars error:", err);
      setError("Không tải được danh sách lịch");
    } finally {
      setLoading(false);
    }
  };

  // ================= CREATE (ADMIN) =================
  const createCalendar = async (data) => {
    try {
      setCreating(true);
      setError(null);

      const res = await createWorkCalendar(data);
      await fetchAllCalendars();
      if (data.year) {
        await fetchWorkCalendar(data.year);
      }

      return res;
    } catch (error) {
      console.error("Create calendar error:", error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Tạo lịch thất bại");
      }

      throw error;
    } finally {
      setCreating(false);
    }
  };

  // ================= CHECK WORKING DAY =================
  const isWorkingDay = async (date) => {
    try {
      const res = await checkWorkingDay(date);
      return res;
    } catch (error) {
      console.error("Check working day error:", error);
      return false;
    }
  };

  // ================= AUTO LOAD CURRENT YEAR =================
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    fetchWorkCalendar(currentYear);
  }, []);

  return (
    <WorkCalendarContext.Provider
      value={{
        calendar,
        calendars, 

        loading,
        creating,
        error,
        setError,

        fetchWorkCalendar,
        isWorkingDay,

        fetchAllCalendars,
        createCalendar
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