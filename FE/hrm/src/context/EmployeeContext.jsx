import { createContext, useContext, useEffect, useState } from "react";
import { 
  getCurrentEmployee,
  getAllEmployees,
  createEmployee,
  updateEmployee 
} from "../services";

const EmployeeContext = createContext(null);

export const EmployeeProvider = ({ children }) => {
  const [employee, setEmployee] = useState(null);

  // ADMIN DATA
  const [employees, setEmployees] = useState([]);

  // PAGINATION
  const [page, setPage] = useState(1);
  const [size] = useState(12);
  const [totalPages] = useState(1);

  // LOADING TÁCH RIÊNG
  const [loadingEmployee, setLoadingEmployee] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const role = localStorage.getItem("role");

  // EMPLOYEE: lấy user hiện tại
  const fetchCurrentEmployee = async () => {
    setLoadingEmployee(true);
    try {
      const res = await getCurrentEmployee();
      setEmployee({
        ...res.data,
        avatarUrl: res.data.avatarUrl || ""
      });
      // setEmployee(res.data);
    } catch (err) {
      console.error("Fetch employee failed", err);
      setEmployee(null);
    } finally {
      setLoadingEmployee(false);
    }
  };

  // ADMIN: lấy list nhân viên
  const fetchEmployees = async () => {
    if (role !== "ADMIN" && role !== "HR") return;

    setLoadingEmployees(true);
    try {
      const res = await getAllEmployees();

      const data = res?.data?.data || res?.data || [];

      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch employees error", err);
      setEmployees([]); 
    } finally {
      setLoadingEmployees(false);
    }
  };

  // CREATE
  const handleCreateEmployee = async (data) => {
    const res = await createEmployee(data);
    await fetchEmployees();
    return res; 
  };

  // UPDATE
  const handleUpdateMyProfile = async (data) => {
    await updateEmployee(employee.employeeId, data);
    await fetchCurrentEmployee();
  };

  const handleUpdateEmployee = async (id, data) => {
    await updateEmployee(id, data);
    await fetchEmployees();
  };

  // INIT
  useEffect(() => {
    fetchCurrentEmployee();

    if (role === "ADMIN" || role === "HR") {
      fetchEmployees();
    }
  }, []);

  return (
    <EmployeeContext.Provider 
      value={{ 
        employee,
        setEmployee,
        loadingEmployee,

        employees,
        loadingEmployees,
        fetchEmployees,

        createEmployee: handleCreateEmployee,
        updateMyProfile: handleUpdateMyProfile,
        updateEmployee: handleUpdateEmployee,

        page,
        setPage,
        totalPages,
        size
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useEmployeeContext = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployeeContext must be used inside EmployeeProvider");
  }
  return context;
};