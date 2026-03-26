import { createContext, useContext, useEffect, useState } from "react";
import { filterContracts } from "../services";
import { useEmployeeContext } from "./EmployeeContext";

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {

  const { employee } = useEmployeeContext();

  const [contracts, setContracts] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchContracts = async (currentPage = page) => {
    if (!employee?.employeeId) return;

    try {
      setLoading(true);

      const res = await filterContracts({
        employeeId: employee.employeeId,
        page: currentPage,
        size
      });

      setContracts(res.data.content);
      setTotalPages(res.data.totalPages);

    } catch (error) {
      console.error("Fetch contracts error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employee?.employeeId) {
      fetchContracts(page);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee, page]);

  return (
    <ContractContext.Provider
      value={{
        contracts,
        page,
        setPage,
        totalPages,
        loading,
        fetchContracts
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useContractContext = () => {
  return useContext(ContractContext);
};