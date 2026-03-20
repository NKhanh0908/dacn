import { createContext, useContext, useEffect, useState } from "react";
import { getPayrolls } from "../services";
import { useEmployeeContext } from "./EmployeeContext";

const PayrollContext = createContext();

export const PayrollProvider = ({ children }) => {

  const { employee } = useEmployeeContext();

  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyPayrolls = async () => {
    try {
      setLoading(true);

      const data = await getPayrolls();

      console.log("All payroll:", data);
      console.log("Employee ID:", employee?.employeeId);

      const myPayroll = data.filter(
        p => p.employeeId === employee?.employeeId
      );

      console.log("My payroll:", myPayroll);

      setPayrolls(myPayroll);

    } catch (error) {
      console.error("Fetch payroll error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employee?.employeeId) {
      fetchMyPayrolls();
    }
  }, [employee]);

  return (
    <PayrollContext.Provider value={{ payrolls, loading }}>
      {children}
    </PayrollContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePayrollContext = () => useContext(PayrollContext);