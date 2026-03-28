import { createContext, useContext, useEffect, useState } from "react";
import { createLeaveRequest, filterLeaveRequests } from "../services";

// Tạo context
const LeaveRequestContext = createContext();

// Provider
export const LeaveRequestProvider = ({ children }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState({});

  /* Lấy danh sách đơn nghỉ phép của nhân viên */
  const fetchLeaveRequests  = async () => {
    try {
      setLoading(true);

      const res = await filterLeaveRequests({
        ...filters,
        page,
        size
      });

      const data = res.data || res; 
      setLeaveRequests(data.content || []);
      setTotalPages(data.totalPages || 0);

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
        setFilters,
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