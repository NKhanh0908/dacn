/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FiSearch, FiPlus, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";

import { useContractContext } from "../../../context";

const CONTRACT_TYPE_LABEL = {
  PROBATION: "Thử việc",
  FIXED_TERM: "Ngắn hạn",
  INDEFINITE_TERM: "Dài hạn",
};

const CONTRACT_STATUS_LABEL = {
  DRAFT: "Nháp",
  PENDING_SIGNATURE: "Chờ ký",
  ACTIVE: "Đang hiệu lực",
  EXPIRED: "Hết hạn",
  TERMINATED: "Đã chấm dứt",
  CANCELLED: "Đã hủy",
};

const CONTRACT_STATUS_STYLE = {
  DRAFT: "bg-slate-100 text-slate-700 border-slate-200",
  PENDING_SIGNATURE: "bg-amber-100 text-amber-700 border-amber-200",
  ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  EXPIRED: "bg-gray-100 text-gray-700 border-gray-200",
  TERMINATED: "bg-rose-100 text-rose-700 border-rose-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

const formatDate = (value) => {
  if (!value) return "--";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("vi-VN");
};

const ContractManagement = () => {
  const role = localStorage.getItem("role");
  if (role !== "ADMIN" && role !== "HR") return <Navigate to="/" replace />;

  const {
    contracts,
    loading,
    filters,
    setFilters,
    fetchContracts,
    handleDelete,
  } = useContractContext();

  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchContracts(0, filters);
    }, 500);

    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);


  return (
    <div className="overflow-y-auto h-[calc(100vh-100px)] pr-4 pb-4">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Quản lý hợp đồng
          </h1>
          <p className="text-gray-500 mt-2">
            Tổng số hợp đồng: 
            <span className="font-semibold text-slate-700">
              {" "}{contracts.length}
            </span>
          </p>
        </div>

        <button
          onClick={() => navigate("/contracts-management/create")}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <FiPlus size={18} /> Thêm hợp đồng
        </button>
      </div>

      {/* FILTER */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 border rounded-lg shadow mt-3 mb-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm mã HĐ ..."
            value={filters.keyword}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, keyword: e.target.value }))
            }
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
          className="border rounded-lg px-3"
        >
          <option value="">Tất cả</option>
          <option value="PENDING_SIGNATURE">Chờ ký</option>
          <option value="ACTIVE">Đang hiệu lực</option>
          <option value="EXPIRED">Hết hạn</option>
          <option value="TERMINATED">Đã chấm dứt</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>

        <select
          value={filters.contractType}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, contractType: e.target.value }))
          }
          className="border rounded-lg px-3"
        >
          <option value="">Tất cả</option>
          <option value="PROBATION">Thử việc</option>
          <option value="FIXED_TERM">Xác định thời hạn</option>
          <option value="INDEFINITE_TERM">Không xác định thời hạn</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-full overflow-auto">
          <table className="w-full min-w-[1200px] text-sm">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr className="text-slate-700">
                <th className="text-left px-4 py-4 font-semibold">Mã HĐ</th>
                <th className="text-left px-4 py-4 font-semibold">Nhân viên</th>
                <th className="text-left px-4 py-4 font-semibold">Loại</th>
                <th className="text-left px-4 py-4 font-semibold">Ngày bắt đầu</th>
                <th className="text-left px-4 py-4 font-semibold">Ngày kết thúc</th>
                <th className="text-left px-4 py-4 font-semibold">Trạng thái</th>
                <th className="text-center px-4 py-4 font-semibold">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-slate-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : contracts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-slate-500">
                    Không có hợp đồng nào
                  </td>
                </tr>
              ) : (
                contracts.map((c) => (
                  <tr
                    key={c.contractId}
                    className="border-t border-slate-100 hover:bg-slate-200 transition"
                  >
                    <td className="px-4 py-4 font-semibold text-slate-800">
                      {c.contractNumber || "--"}
                    </td>
                    <td className="px-4 py-4">{c.employeeName || "--"}</td>
                    <td className="px-4 py-4">
                      {CONTRACT_TYPE_LABEL[c.contractType] || c.contractType || "--"}
                    </td>
                    <td className="px-4 py-4">{formatDate(c.startDate)}</td>
                    <td className="px-4 py-4">{formatDate(c.endDate)}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs border ${
                          CONTRACT_STATUS_STYLE[c.status] ||
                          "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {CONTRACT_STATUS_LABEL[c.status] || c.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            navigate(`/contracts-management/${c.contractId}`);
                          }}
                          className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100"
                        >
                          <FiEye />
                        </button>

                        <button 
                          onClick={() => {
                            navigate(`/contracts-management/edit/${c.contractId}`);
                          }}
                          className="p-2 rounded-lg border border-blue-200 text-blue-600 bg-white hover:bg-blue-50"
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          onClick={() => handleDelete(c.contractId)}
                          className="p-2 rounded-lg border border-red-200 text-red-600 bg-white hover:bg-red-50"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <div className="border p-2 rounded">{value || "--"}</div>
  </div>
);

export default ContractManagement;