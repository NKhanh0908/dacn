import { createContext, useContext, useEffect, useState } from "react";
import { 
  createAttendanceRequest,
  getMyAttendanceRequests 
} from "../services/attendance_requests/AttendanceRequestsService";
import { useEmployeeContext } from "./EmployeeContext";

// Tạo context cho module yêu cầu chấm công
const AttendanceRequestContext = createContext();

export const AttendanceRequestProvider = ({ children }) => {
  const { employee } = useEmployeeContext();
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  /*Lấy danh sách yêu cầu chấm công của nhân viên*/
  const fetchMyAttendanceRequests = async () => {
    try {
      if (!employee?.employeeId) return;
      setLoading(true);
      console.log("Fetching my attendance requests...");
      const res = await getMyAttendanceRequests();
      console.log("My attendance requests:", res);
      setMyRequests(res.data || []);
    } catch (error) {
      console.error("Get my attendance requests error:", error);
    } finally {
      setLoading(false);
    }
  };

  /*Gửi yêu cầu chấm công*/
  const submitAttendanceRequest = async (data) => {
    try {
      setLoading(true);
      console.log("Submitting attendance request:", data);
      await createAttendanceRequest(data);

      await fetchMyAttendanceRequests();
    } catch (error) {
      console.error("Submit attendance request error:", error);
    } finally {
      setLoading(false);
    }
  };

  /*Khi employee thay đổi -> load danh sách request*/
  useEffect(() => {
    if (employee?.employeeId) {
      fetchMyAttendanceRequests();
    }
  }, [employee]);

  return (
    <AttendanceRequestContext.Provider
      value={{
        myRequests,
        loading,
        fetchMyAttendanceRequests,
        submitAttendanceRequest
      }}
    >
      {children}
    </AttendanceRequestContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAttendanceRequestContext = () => {
  return useContext(AttendanceRequestContext);
};