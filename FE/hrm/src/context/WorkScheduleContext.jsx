import { createContext, useContext, useState, useEffect } from "react";
import {
  getAllWorkSchedules,
  getWorkScheduleById,
  createWorkSchedule,
  updateWorkSchedule,
  deleteWorkSchedule,
  activateWorkSchedule,
  deactivateWorkSchedule,
  setDefaultWorkSchedule,
  getDefaultWorkSchedule,
  getActiveWorkSchedules
} from "../services";

const WorkScheduleContext = createContext();

export const WorkScheduleProvider = ({ children }) => {
  const [workSchedules, setWorkSchedules] = useState([]);
  const [activeSchedules, setActiveSchedules] = useState([]);
  const [defaultSchedule, setDefaultSchedule] = useState(null);
  const [detailSchedule, setDetailSchedule] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ================= GET ALL =================
  const fetchWorkSchedules = async () => {
    try {
      console.log("CALL API: getAllWorkSchedules");

      setLoading(true);
      const res = await getAllWorkSchedules();

      console.log("RAW RESPONSE:", res);

      const data = res?.data?.data || res?.data || res;

      console.log("PARSED DATA:", data);

      if (!Array.isArray(data)) {
        console.warn("DATA KHÔNG PHẢI ARRAY:", data);
      }

      setWorkSchedules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi lấy danh sách ca làm:", err);
      setError("Không tải được danh sách ca làm");
    } finally {
      setLoading(false);
    }
  };

  // ================= ACTIVE =================
  const fetchActiveSchedules = async () => {
    try {
      console.log("CALL API: getActiveWorkSchedules");

      const data = await getActiveWorkSchedules();

      console.log("ACTIVE DATA:", data);

      setActiveSchedules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi lấy ca active:", err);
    }
  };

  // ================= DEFAULT =================
  const fetchDefaultSchedule = async () => {
    try {
      console.log("CALL API: getDefaultWorkSchedule");

      const data = await getDefaultWorkSchedule();

      console.log("DEFAULT:", data);

      setDefaultSchedule(data);
    } catch (err) {
      console.error("Lỗi lấy ca mặc định:", err);
    }
  };

  // ================= DETAIL =================
  const fetchScheduleById = async (id) => {
    try {
      console.log("CALL API DETAIL:", id);

      setLoading(true);
      const data = await getWorkScheduleById(id);

      console.log("DETAIL DATA:", data);

      setDetailSchedule(data);
      return data;
    } catch (err) {
      console.error("Lỗi lấy chi tiết ca:", err);
      setDetailSchedule(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ================= CREATE =================
  const addWorkSchedule = async (data) => {
    try {
      console.log("CREATE:", data);

      await createWorkSchedule(data);
      await fetchWorkSchedules();
      await fetchActiveSchedules();

      alert("Tạo ca làm thành công!");
    } catch (err) {
      console.error("Lỗi thêm ca:", err);
      alert("Lỗi tạo ca làm!");
    }
  };

  // ================= UPDATE =================
  const editWorkSchedule = async (id, data) => {
    try {
      console.log("UPDATE:", id, data);

      await updateWorkSchedule(id, data);
      await fetchWorkSchedules();

      alert("Cập nhật thành công!");
    } catch (err) {
      console.error("Lỗi update:", err);
      alert("Lỗi cập nhật!");
    }
  };

  // ================= DELETE =================
  const removeWorkSchedule = async (id) => {
    try {
      console.log("DELETE:", id);

      await deleteWorkSchedule(id);
      await fetchWorkSchedules();

      alert("Xóa thành công!");
    } catch (err) {
      console.error("Lỗi xóa:", err);
      alert("Lỗi xóa!");
    }
  };

  // ================= ACTIVATE =================
  const activateSchedule = async (id) => {
    try {
      console.log("ACTIVATE:", id);

      await activateWorkSchedule(id);
      await fetchWorkSchedules();
      await fetchActiveSchedules();

      alert("Đã kích hoạt!");
    } catch (err) {
      console.error("Lỗi activate:", err);
      alert("Lỗi kích hoạt!");
    }
  };

  // ================= DEACTIVATE =================
  const deactivateSchedule = async (id) => {
    try {
      console.log("DEACTIVATE:", id);

      await deactivateWorkSchedule(id);
      await fetchWorkSchedules();
      await fetchActiveSchedules();

      alert("Đã vô hiệu hóa!");
    } catch (err) {
      console.error("Lỗi deactivate:", err);
      alert("Lỗi vô hiệu hóa!");
    }
  };

  // ================= SET DEFAULT =================
  const setDefaultScheduleHandler = async (id) => {
    try {
      console.log("SET DEFAULT:", id);

      await setDefaultWorkSchedule(id);
      await fetchDefaultSchedule();
      await fetchWorkSchedules();

      alert("Đã đặt làm ca mặc định!");
    } catch (err) {
      console.error("Lỗi set default:", err);
      alert("Lỗi đặt mặc định!");
    }
  };

  // ================= INIT =================
  useEffect(() => {
    console.log("INIT WORK SCHEDULE CONTEXT");

    fetchWorkSchedules();
    fetchDefaultSchedule();
    fetchActiveSchedules();
  }, []);

  return (
    <WorkScheduleContext.Provider
      value={{
        workSchedules,
        activeSchedules,
        defaultSchedule,
        detailSchedule,
        loading,
        error,

        fetchWorkSchedules,
        fetchActiveSchedules,
        fetchDefaultSchedule,
        fetchScheduleById,

        addWorkSchedule,
        editWorkSchedule,
        removeWorkSchedule,
        activateSchedule,
        deactivateSchedule,
        setDefaultWorkSchedule: setDefaultScheduleHandler
      }}
    >
      {children}
    </WorkScheduleContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWorkScheduleContext = () =>
  useContext(WorkScheduleContext);