import { createContext, useContext, useEffect, useState } from "react";
import { useEmployeeContext } from "./EmployeeContext";
import { 
  checkIn, 
  checkOut, 
  getTodayAttendance, 
  getMonthlyAttendance, 
  getAttendanceStatistics 
} from "../services";

// Tạo context dùng chung cho module chấm công
const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const { employee } = useEmployeeContext();
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [monthlyAttendances, setMonthlyAttendances] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);

  /*Lấy dữ liệu chấm công hôm nay của nhân viên*/
  const fetchTodayAttendance = async (employeeId) => {
    try {
      console.log("Fetching today attendance for:", employeeId);
      const res = await getTodayAttendance(employeeId);
      console.log("Today attendance:", res);
      setTodayAttendance(res || null);
    } catch (error) {
      console.error("Get today attendance error:", error);
    }
  };

  /*Lấy dữ liệu chấm công theo tháng*/
  const fetchMonthlyAttendance = async (employeeId, year, month) => {
    try {
      const res = await getMonthlyAttendance(employeeId, year, month);
      console.log("Monthly attendance:", res);
      setMonthlyAttendances(res || []);
    } catch (error) {
      console.error("Get monthly attendance error:", error);
    }
  };

  /*Lấy thống kê chấm công của nhân viên*/
  const fetchStatistics = async (employeeId) => {
    try {
      const startDate = "2024-01-01"; 
      const endDate = new Date().toISOString().split("T")[0];
      const res = await getAttendanceStatistics(
        employeeId,
        startDate,
        endDate
      );
      console.log("Statistics:", res);
      setStatistics(res);
    } catch (error) {
      console.error("Get statistics error:", error);
    }
  };

  /*Xử lý check-in*/
  const handleCheckIn = async () => {
    try {
      if (!employee?.employeeId) return;
      setLoading(true);
      await checkIn({ method: "BUTTON" });
      // Sau khi check-in -> lấy lại dữ liệu hôm nay
      const res = await getTodayAttendance(employee.employeeId);
      setTodayAttendance(res);
    } catch (error) {
      console.error("Check-in error:", error);
    } finally {
      setLoading(false);
    }
  };

  /*Xử lý check-out*/
  const handleCheckOut = async () => {
    try {
      if (!employee?.employeeId) return;
      setLoading(true);
      await checkOut({ method: "BUTTON" });
      // Sau khi check-out -> lấy lại dữ liệu hôm nay
      const res = await getTodayAttendance(employee.employeeId);
      setTodayAttendance(res);
    } catch (error) {
      console.error("Check-out error:", error);
    } finally {
      setLoading(false);
    }
  };

  /*Khi employee thay đổi -> load lại toàn bộ dữ liệu chấm công*/
  useEffect(() => {
    if (!employee?.employeeId) return;

    fetchTodayAttendance(employee.employeeId);
    fetchStatistics(employee.employeeId);

  }, [employee?.employeeId]);

  return (
    <AttendanceContext.Provider
      value={{
        todayAttendance,
        monthlyAttendances,
        statistics,
        loading,
        handleCheckIn,
        handleCheckOut,
        fetchMonthlyAttendance 
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAttendanceContext = () => {
  return useContext(AttendanceContext);
};