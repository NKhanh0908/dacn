import { createContext, useContext, useEffect, useState } from "react";
import {
  getHolidaysByDateRange,
  checkHoliday,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  getHolidayById
} from "../services";

const HolidayContext = createContext();

export const HolidayProvider = ({ children }) => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);

  const role = localStorage.getItem("role")?.toUpperCase();

  /* ================= COMMON ================== */
  const getCurrentYearRange = (year = new Date().getFullYear()) => {
    return {
      fromDate: `${year}-01-01`,
      toDate: `${year}-12-31`
    };
  };

  /* ================= FETCH ================= */
  const fetchHolidays = async (year) => {
    try {
      setLoading(true);
      let fromDate, toDate;

      if (role?.includes("ADMIN") || role?.includes("HR")) {
        const range = getCurrentYearRange(year);
        fromDate = range.fromDate;
        toDate = range.toDate;
      } 
      else {
        const today = new Date();
        fromDate = today.toISOString().split("T")[0];
        toDate = new Date(today.getFullYear(), 11, 31)
          .toISOString()
          .split("T")[0];
      }

      const res = await getHolidaysByDateRange(fromDate, toDate);
      setHolidays(res || []);
    } catch (error) {
      console.error("Fetch holidays error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= EMPLOYEE ================= */
  const isHoliday = async (date) => {
    try {
      const res = await checkHoliday(date);
      return res;
    } catch (error) {
      console.error("Check holiday error:", error);
      return false;
    }
  };

  /* ================= ADMIN ================= */
  const addHoliday = async (data, employeeId) => {
    try {
      await createHoliday(data, employeeId); 
      await fetchHolidays();
    } catch (err) {
      console.error("Create holiday error:", err);
      throw err;
    }
  };

  const editHoliday = async (id, data) => {
    try {
      await updateHoliday(id, data);
      await fetchHolidays();
    } catch (err) {
      console.error("Update holiday error:", err);
    }
  };

  const removeHoliday = async (id) => {
    try {
      await deleteHoliday(id);
      await fetchHolidays();
    } catch (err) {
      console.error("Delete holiday error:", err);
      throw err;
    }
  };

  const getHolidayDetail = async (id) => {
    try {
      const res = await getHolidayById(id);
      return res;
    } catch (err) {
      console.error("Get detail error:", err);
      return null;
    }
  };

  /* ================= INIT ================= */
  useEffect(() => {
    fetchHolidays();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <HolidayContext.Provider
      value={{
        holidays,
        loading,

        fetchHolidays,

        isHoliday,

        addHoliday,
        editHoliday,
        removeHoliday,
        getHolidayDetail
      }}
    >
      {children}
    </HolidayContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useHolidayContext = () => useContext(HolidayContext);