import { createContext, useContext, useEffect, useState } from "react";
import {
  filterContracts,
  getContractById,
  deleteContract,
  terminateContract,
  createContract,
  updateContract,
  signContract,
} from "../services";
import { useEmployeeContext } from "./EmployeeContext";

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const { employee } = useEmployeeContext();

  // ✅ FIX: luôn dùng string
  const role = localStorage.getItem("ROLE");

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);

  // pagination
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // filters
  const [filters, setFilters] = useState({
    keyword: "",
    status: "",
    contractType: "",
    fromDate: "",
    toDate: "",
  });

  // ================= FETCH =================
  const fetchContracts = async (customPage = page, customFilters = filters) => {
    try {
      setLoading(true);

      let params = {
        page: customPage,
        size,
      };

      // ✅ EMPLOYEE
      if (role?.includes("EMPLOYEE")) {
        if (!employee?.employeeId) return;
        params.employeeId = employee.employeeId;
      }

      // ✅ ADMIN / HR
      if (role?.includes("ADMIN") || role?.includes("HR")) {
        if (customFilters.keyword?.trim())
          params.contractNumber = customFilters.keyword.trim();

        if (customFilters.status)
          params.contractStatus = customFilters.status;

        if (customFilters.contractType)
          params.contractType = customFilters.contractType;

        if (customFilters.fromDate)
          params.startDate = customFilters.fromDate;

        if (customFilters.toDate)
          params.endDate = customFilters.toDate;
      }

      console.log("PARAMS:", params); // debug

      const res = await filterContracts(params);

      setContracts(res?.data?.content || []);
      setTotalPages(res?.data?.totalPages || 0);
    } catch (error) {
      console.error("Fetch contracts error:", error);
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= CRUD =================

  // ➕ CREATE
  const handleCreate = async (data) => {
    try {
      setLoading(true);
      await createContract(data);
      await fetchContracts(0);
      alert("Tạo hợp đồng thành công");
      return true;
    } catch (error) {
      console.error("Create error:", error);
      alert("Tạo hợp đồng thất bại");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✏️ UPDATE
  const handleUpdate = async (id, data) => {
    try {
      setLoading(true);
      await updateContract(id, data);
      await fetchContracts();
      alert("Cập nhật hợp đồng thành công");
      return true;
    } catch (error) {
      console.error("Update error:", error);
      alert("Cập nhật thất bại");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✍️ SIGN CONTRACT
  const handleSign = async (id) => {
    try {
      setLoading(true);

      const role = localStorage.getItem("ROLE");

      // ✅ FIX CORE LOGIC
      const signedBy = role?.includes("EMPLOYEE")
        ? "EMPLOYEE"
        : "EMPLOYER";

      const payload = {
        signedBy,
        signatureData: "signed-electronic",
        ipAddress: "127.0.0.1",
        notes: "Ký hợp đồng từ hệ thống",
      };

      console.log("ROLE:", role);
      console.log("SIGNED BY:", signedBy);

      await signContract(id, payload);

      await fetchContracts();
      alert("Ký hợp đồng thành công");
    } catch (error) {
      console.error("Sign error:", error);
      alert("Ký hợp đồng thất bại");
    } finally {
      setLoading(false);
    }
  };

  // ❌ DELETE
  const handleDelete = async (id) => {
    const ok = window.confirm("Bạn có chắc muốn xóa hợp đồng?");
    if (!ok) return;

    try {
      setLoading(true);
      await deleteContract(id);
      await fetchContracts();
      alert("Xóa thành công");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Xóa thất bại");
    } finally {
      setLoading(false);
    }
  };

  // ⛔ TERMINATE
  const handleTerminate = async (id, data = {}) => {
    const ok = window.confirm("Bạn có chắc muốn chấm dứt hợp đồng?");
    if (!ok) return;

    try {
      setLoading(true);
      await terminateContract(id, data);
      await fetchContracts();
      alert("Chấm dứt thành công");
    } catch (error) {
      console.error("Terminate error:", error);
      alert("Thất bại");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 DETAIL
  const getDetail = async (id) => {
    try {
      const res = await getContractById(id);
      return res?.data || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // ================= EFFECT =================
  useEffect(() => {
    if (role?.includes("EMPLOYEE")) {
      if (employee?.employeeId) {
        fetchContracts(page);
      }
    } else {
      fetchContracts(page);
    }
    // eslint-disable-next-line
  }, [employee, page]);

  return (
    <ContractContext.Provider
      value={{
        contracts,
        loading,
        page,
        setPage,
        totalPages,

        filters,
        setFilters,

        fetchContracts,

        handleCreate,
        handleUpdate,
        handleSign,
        handleDelete,
        handleTerminate,

        getDetail,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useContractContext = () => useContext(ContractContext);