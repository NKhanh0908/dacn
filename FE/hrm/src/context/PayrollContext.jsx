import { createContext, useContext, useEffect, useState } from "react";
import { 
  getPayrolls,
  getPayrollById,
  createPayroll,
  updatePayroll,
  deletePayroll,
  calculateAllPayrolls
} from "../services";
import { useEmployeeContext } from "./EmployeeContext";

const PayrollContext = createContext();

export const PayrollProvider = ({ children }) => {
  const { employee } = useEmployeeContext();

  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailPayroll, setDetailPayroll] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState(null);

  const role = localStorage.getItem("role")?.toUpperCase();
  const isAdmin = role?.includes("ADMIN") || role?.includes("HR");

  // ================= FETCH =================
  const fetchPayrolls = async () => {
    try {
      setLoading(true);

      const data = await getPayrolls();

      console.log("All payroll:", data);
      console.log("Employee ID:", employee?.employeeId);

      if (isAdmin) {
        setPayrolls(Array.isArray(data) ? data : []);
      } else {
        const myPayroll = (data || []).filter(
          p => p.employeeId === employee?.employeeId
        );
        setPayrolls(myPayroll);
      }

    } catch (error) {
      console.error("Fetch payroll error:", error);
      setPayrolls([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH DETAIL PAYROLL =================
  const fetchPayrollById = async (payrollId) => {
    try {
      setLoadingDetail(true);
      setErrorDetail(null);
      const data = await getPayrollById(payrollId);
      setDetailPayroll(data);
      return data;
    } catch (err) {
      console.error("Fetch payroll detail error:", err);
      setErrorDetail("Không tìm thấy payroll");
      setDetailPayroll(null);
      return null;
    } finally {
      setLoadingDetail(false);
    }
  };

  // ================= CREATE =================
  const handleCreatePayroll = async (employeeId) => {
    try {
      await createPayroll({ employId: employeeId });
      await fetchPayrolls();
    } catch (err) {
      console.error("Create payroll error:", err);
      throw err;
    }
  };

  // ================= UPDATE =================
  const handleUpdatePayroll = async (payrollId, employeeId) => {
    try {
      await updatePayroll(payrollId, { employId: employeeId });
      await fetchPayrolls();
    } catch (err) {
      console.error("Update payroll error:", err);
      throw err;
    }
  };

  // ================= DELETE =================
  const handleDeletePayroll = async (payrollId) => {
    try {
      await deletePayroll(payrollId);
      await fetchPayrolls();
    } catch (err) {
      console.error("Delete payroll error:", err);
      throw err;
    }
  };

  // ================ CALCULATE ALL PAYROLLS =================
  const handleCalculateAllPayrolls = async () => {
    try {
      setLoading(true);
      await calculateAllPayrolls();
      await fetchPayrolls();
      alert("Đã tính lương toàn bộ!");
    } catch (err) {
      console.error("Tính lương toàn bộ lỗi:", err);
      alert("Lỗi tính lương toàn bộ!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin || employee?.employeeId) {
      fetchPayrolls();
    }
  }, [employee]);

  return (
    <PayrollContext.Provider 
      value={{ 
        payrolls, 
        loading,
        fetchPayrolls,
        isAdmin,
        calculateAllPayrolls: handleCalculateAllPayrolls,
        createPayroll: handleCreatePayroll, 
        updatePayroll: handleUpdatePayroll, 
        deletePayroll: handleDeletePayroll,
        fetchPayrollById: fetchPayrollById,
        detailPayroll: detailPayroll,
        loadingDetail: loadingDetail,
        errorDetail: errorDetail }}>
      {children}
    </PayrollContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePayrollContext = () => useContext(PayrollContext);