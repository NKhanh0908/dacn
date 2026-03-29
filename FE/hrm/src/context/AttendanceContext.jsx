import { createContext, useContext, useEffect, useState } from "react";
import { useEmployeeContext } from "./EmployeeContext";
import { 
  checkIn, 
  checkOut, 
  getTodayAttendance, 
  getMonthlyAttendance, 
  getAttendanceStatistics,
  filterAttendances,
  createManualAttendance,
  updateAttendance,
  deleteAttendance,
  approveAttendance,
  getAttendanceById
} from "../services";

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const { employee } = useEmployeeContext();

  // ================= STATE =================
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [monthlyAttendances, setMonthlyAttendances] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [attendanceDetail, setAttendanceDetail] = useState(null);

  // 👉 ADMIN
  const [attendances, setAttendances] = useState([]);

  const [loading, setLoading] = useState(false);

  // ================= EMPLOYEE =================
  const fetchTodayAttendance = async (employeeId) => {
    try {
      const res = await getTodayAttendance(employeeId);
      setTodayAttendance(res || null);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMonthlyAttendance = async (employeeId, year, month) => {
    try {
      const res = await getMonthlyAttendance(employeeId, year, month);
      setMonthlyAttendances(res || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStatistics = async (employeeId) => {
    try {
      const startDate = "2024-01-01";
      const endDate = new Date().toISOString().split("T")[0];

      const res = await getAttendanceStatistics(
        employeeId,
        startDate,
        endDate
      );

      setStatistics(res);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckIn = async () => {
    try {
      if (!employee?.employeeId) return;
      setLoading(true);

      await checkIn({ method: "BUTTON" });

      await fetchTodayAttendance(employee.employeeId);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      if (!employee?.employeeId) return;
      setLoading(true);

      await checkOut({ method: "BUTTON" });

      await fetchTodayAttendance(employee.employeeId);
    } finally {
      setLoading(false);
    }
  };

  // ================= ADMIN =================
  // Lấy danh sách attendance (filter)
  const fetchAttendances = async (params = {}) => {
    try {
      setLoading(true);

      const res = await filterAttendances(params);

      const data = res?.data?.content || res?.data || [];

      setAttendances(data);
    } finally {
      setLoading(false);
    }
  };

  // Thêm thủ công
  const addManualAttendance = async (data) => {
    try {
      await createManualAttendance(data);
      await fetchAttendances();
      return { success: true };
    } catch (error) {
      console.error("Create manual attendance error:", error);

      const message =
        error?.response?.data?.errors?.[0] ||
        error?.response?.data?.message ||
        "Lỗi tạo chấm công";

      return {
        success: false,
        message,
      };
    }
  };

  // Update
  const editAttendance = async (id, data) => {
    try {
      await updateAttendance(id, data);
      await fetchAttendances();
    } catch (error) {
      console.error("Update attendance error:", error);
    }
  };

  // Delete
  const removeAttendance = async (id) => {
    try {
      await deleteAttendance(id);
      await fetchAttendances();
    } catch (error) {
      console.error("Delete attendance error:", error);
    }
  };

  // Approve
  const approve = async (id) => {
    try {
      await approveAttendance(id);
      await fetchAttendances();
    } catch (error) {
      console.error("Approve error:", error);
    }
  };

  const fetchAttendanceById = async (id) => {
    try {
      setLoading(true);

      const res = await getAttendanceById(id);

      const data = res?.data || res; // tùy format BE

      setAttendanceDetail(data);
    } catch (error) {
      console.error("Fetch attendance detail error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= AUTO LOAD =================
  useEffect(() => {
    if (!employee?.employeeId) return;

    fetchTodayAttendance(employee.employeeId);
    fetchStatistics(employee.employeeId);

  }, [employee?.employeeId]);

  return (
    <AttendanceContext.Provider
      value={{
        // employee
        todayAttendance,
        monthlyAttendances,
        statistics,
        handleCheckIn,
        handleCheckOut,
        fetchMonthlyAttendance,

        // admin
        attendances,
        fetchAttendances,
        addManualAttendance,
        editAttendance,
        removeAttendance,
        approve,

        // ✅ NEW
        attendanceDetail,
        fetchAttendanceById,

        loading
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