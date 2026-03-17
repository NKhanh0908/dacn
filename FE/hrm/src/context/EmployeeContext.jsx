import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentEmployee } from "../services";

const EmployeeContext = createContext(null);

export const EmployeeProvider = ({ children }) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  /*Khi app load lần đầu -> gọi API lấy thông tin nhân viên hiện tại*/
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await getCurrentEmployee();
        setEmployee(res.data);
      } catch (err) {
        console.error("Fetch employee failed", err);
        setEmployee(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, []);

  return (
    <EmployeeContext.Provider value={{ employee, setEmployee, loading }}>
      {children}
    </EmployeeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useEmployeeContext = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error(
      "useEmployeeContext must be used inside EmployeeProvider"
    );
  }
  return context;
};