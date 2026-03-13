import { createContext, useContext, useState, useEffect } from "react";
import {
  getAllWorkSchedules,
  createWorkSchedule,
  updateWorkSchedule,
  deleteWorkSchedule,
  activateWorkSchedule,
  deactivateWorkSchedule,
  setDefaultWorkSchedule,
  getDefaultWorkSchedule 
} from "../services/workSchedule/workScheduleService";

// Context dùng để quản lý ca làm việc trong toàn hệ thống
const WorkScheduleContext = createContext();

export const WorkScheduleProvider = ({ children }) => {
  const [workSchedules, setWorkSchedules] = useState([]);
  const [defaultSchedule, setDefaultSchedule] = useState(null);

  /*Lấy toàn bộ danh sách ca làm từ API*/
  const fetchWorkSchedules = async () => {
    try {
      const res = await getAllWorkSchedules();
      setWorkSchedules(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách ca làm:", error);
    }
  };

  /*Thêm ca làm mới*/
  const addWorkSchedule = async (data) => {
    try {
      await createWorkSchedule(data);
      await fetchWorkSchedules();
    } catch (error) {
      console.error("Lỗi thêm ca làm:", error);
    }
  };

  /*Cập nhật ca làm*/
  const editWorkSchedule = async (id, data) => {
    try {
      await updateWorkSchedule(id, data);
      await fetchWorkSchedules();
    } catch (error) {
      console.error("Lỗi sửa ca làm:", error);
    }
  };

  /*Xóa ca làm*/
  const removeWorkSchedule = async (id) => {
    try {
      await deleteWorkSchedule(id);
      await fetchWorkSchedules();
    } catch (error) {
      console.error("Lỗi xóa ca làm:", error);
    }
  };

  /*Kích hoạt ca làm*/
  const activateSchedule = async (id) => {
    try {
      await activateWorkSchedule(id);
      await fetchWorkSchedules();
    } catch (error) {
      console.error("Lỗi kích hoạt ca làm:", error);
    }
  };

  /*Vô hiệu hóa ca làm*/
  const deactivateSchedule = async (id) => {
    try {
      await deactivateWorkSchedule(id);
      await fetchWorkSchedules();
    } catch (error) {
      console.error("Lỗi vô hiệu hóa ca làm:", error);
    }
  };

  /*Thiết lập ca làm mặc định*/
  const setDefaultWorkScheduleHandler = async (id) => {
    try {
      await setDefaultWorkSchedule(id);
      await fetchWorkSchedules();
      await fetchDefaultSchedule();
    } catch (error) {
      console.error("Lỗi thiết lập ca làm mặc định:", error);
    }
  };

  /*Lấy ca làm mặc định*/
  const fetchDefaultSchedule = async () => {
    try {
      const res = await getDefaultWorkSchedule();
      setDefaultSchedule(res);
    } catch (error) {
      console.error("Lỗi lấy ca làm mặc định:", error);
    }
  };

  /*Khi app load lần đầu -> load dữ liệu*/
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWorkSchedules();
    fetchDefaultSchedule();
  }, []);

  return (
    <WorkScheduleContext.Provider
      value={{
        workSchedules,
        defaultSchedule,
        fetchWorkSchedules,
        fetchDefaultSchedule,
        addWorkSchedule,
        editWorkSchedule,
        removeWorkSchedule,
        activateSchedule,
        deactivateSchedule,
        setDefaultWorkSchedule: setDefaultWorkScheduleHandler
      }}
    >
      {children}
    </WorkScheduleContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWorkScheduleContext = () => {
   return useContext(WorkScheduleContext);
};