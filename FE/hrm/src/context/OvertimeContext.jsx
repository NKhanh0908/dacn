import { createContext, useContext, useState } from "react";
import {
  createOvertimeRequest,
  approveOvertimeRequest,
  rejectOvertimeRequest,
  getOvertimeRequestForAdmin,
  getMyOvertimeRequests,
} from "../services";

const OvertimeRequestContext = createContext();

export const OvertimeRequestProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ADMIN
  const [overtimes, setOvertimes] = useState([]);

  // EMPLOYEE
  const [myOvertimes, setMyOvertimes] = useState([]);

  /* ================= EMPLOYEE ================= */

  // Tạo request
  const submitOvertimeRequest = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const res = await createOvertimeRequest(data);
      return res;
    } catch (err) {
      const message =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        "Gửi yêu cầu thất bại";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách của bản thân
  const fetchMyOvertimes = async () => {
    try {
      setLoading(true);
      const res = await getMyOvertimeRequests();

      const data = res?.data || [];
      setMyOvertimes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("FETCH MY OVERTIME ERROR:", err);
      setError("Không lấy được danh sách tăng ca của bạn");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADMIN ================= */

  const fetchOvertimes = async () => {
    try {
      setLoading(true);
      const res = await getOvertimeRequestForAdmin();

      const data = res?.data || [];
      setOvertimes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("FETCH OVERTIME ERROR:", err);
      setError("Không lấy được danh sách tăng ca");
    } finally {
      setLoading(false);
    }
  };

  const approveOvertime = async (id) => {
    try {
      setLoading(true);
      await approveOvertimeRequest(id);
      await fetchOvertimes();
    } catch (err) {
      console.error("APPROVE ERROR:", err);
      setError("Duyệt tăng ca thất bại");
    } finally {
      setLoading(false);
    }
  };

  const rejectOvertime = async (id) => {
    try {
      setLoading(true);
      await rejectOvertimeRequest(id);
      await fetchOvertimes();
    } catch (err) {
      console.error("REJECT ERROR:", err);
      setError("Từ chối tăng ca thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <OvertimeRequestContext.Provider
      value={{
        loading,
        error,
        setError,

        // EMPLOYEE
        submitOvertimeRequest,
        myOvertimes,
        fetchMyOvertimes,

        // ADMIN
        overtimes,
        fetchOvertimes,
        approveOvertime,
        rejectOvertime,
      }}
    >
      {children}
    </OvertimeRequestContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useOvertimeRequestContext = () => {
  return useContext(OvertimeRequestContext);
};