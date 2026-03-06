/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { FiGrid } from "react-icons/fi";
import { filterContracts } from "../../services/contract/ContractService";
import { useEmployeeContext } from "../../context/EmployeeContext";
import { useNavigate } from "react-router-dom";

const ContractPage = () => {
  const { employee } = useEmployeeContext();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchContracts = async () => {
    try {
      const res = await filterContracts({
        employeeId: employee.employeeId,
        page,
        size,
      });

      setContracts(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (employee) {
      fetchContracts();
    }
  }, [page, employee]);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const contractType = (type) => {
    switch (type) {
      case "PROBATION":
        return "Thử việc";
      case "FIXED_TERM":
        return "Có thời hạn";
      case "INDEFINITE_TERM":
        return "Vô thời hạn";
      default:
        return type;
    }
  };

  return (
    <div className="overflow-y-auto h-[calc(100vh-100px)]">
      <div className="bg-white border-2 border-[#162F47] rounded-2xl p-3 shadow-2xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-[#162F47] pb-2">
          <div className="flex items-center gap-2">
            <FiGrid size={20} className="text-[#162F47]" />
            <span className="text-[#162F47] font-semibold text-lg">Danh sách hợp đồng</span>
          </div>
          <span className="text-sm text-gray-500">
            Tổng: {contracts.length} hợp đồng
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600 text-sm">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Loại hợp đồng</th>
                <th className="p-3 text-left">Vị trí</th>
                <th className="p-3 text-left">Ngày ký</th>
                <th className="p-3 text-left">Ngày hết hạn</th>
              </tr>
            </thead>

            <tbody>
              {contracts.length > 0 ? (
                contracts.map((c) => (
                  <tr
                    key={c.contractId}
                    onClick={() => navigate(`/contracts/${c.contractId}`)}
                    className="border-b hover:bg-blue-200 transition cursor-pointer"
                  >
                    <td className="p-3 font-medium text-gray-700">
                      {c.contractId}
                    </td>

                    <td className="p-3">
                      <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                        {contractType(c.contractType)}
                      </span>
                    </td>

                    <td className="p-3">
                      {contractType(c.jobTitle)}
                    </td>

                    <td className="p-3 text-gray-600">
                      {formatDate(c.signedDate)}
                    </td>

                    <td className="p-3 text-gray-600">
                      {formatDate(c.endDate)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center p-6 text-gray-400"
                  >
                    Không có hợp đồng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className={`px-4 py-2 rounded-lg border text-sm
            ${
              page === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-blue-100"
            }`}
          >
            Prev
          </button>

          <span className="text-sm text-gray-500">
            Trang {page + 1} / {totalPages}
          </span>

          <button
            disabled={page + 1 === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-4 py-2 rounded-lg border text-sm
            ${
              page + 1 === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-blue-100"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractPage;