import { createContext, useContext, useEffect, useState } from "react";
import { createLeaveRequest, getMyLeaveRequests  } from "../services";

// Tạo context
const LeaveRequestContext = createContext();

// Provider
export const LeaveRequestProvider = ({ children }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  /* Lấy danh sách đơn nghỉ phép của nhân viên */
  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);

      const data = await getMyLeaveRequests();

      setLeaveRequests(data || []);
      setTotalPages(1); 
    } catch (err) {
      console.error("Lỗi load leave requests:", err);
    } finally {
      setLoading(false);
    }
  };

  /* Tạo đơn nghỉ phép */
  const submitLeaveRequest = async (payload) => {
    try {
      setLoading(true);
      await createLeaveRequest(payload);
      await fetchLeaveRequests(); // reload lại danh sách sau khi tạo
    } catch (error) {
      console.error("Lỗi khi tạo đơn nghỉ phép:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LeaveRequestContext.Provider
      value={{
        leaveRequests,
        loading,
        page,
        totalPages,
        setPage,
        submitLeaveRequest
      }}
    >
      {children}
    </LeaveRequestContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLeaveRequestContext = () => {
    return useContext(LeaveRequestContext);
};