/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiRefreshCw,
} from "react-icons/fi";
import { useOvertimeRequestContext } from "../../../context";

const removeVietnameseTones = (str = "") => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
};

const OvertimeManagement = () => {
  const role = localStorage.getItem("role");
  if (role !== "ADMIN" && role !== "HR") {
    return <Navigate to="/" replace />;
  }

  const {
    overtimes,
    loading,
    fetchOvertimes,
    approveOvertime,
    rejectOvertime,
  } = useOvertimeRequestContext();

  const [activeTab, setActiveTab] = useState("PENDING");
  const [employeeKeyword, setEmployeeKeyword] = useState("");

  useEffect(() => {
    fetchOvertimes();
  }, []);

  /* ================= FILTER ================= */

  const filteredOvertimes = useMemo(() => {
    let data = [...overtimes];

    // tab
    if (activeTab === "PENDING") {
      data = data.filter((item) => item.status === "PENDING");
    } else {
      data = data.filter((item) => item.status !== "PENDING");
    }

    // search
    if (employeeKeyword.trim()) {
      const keyword = removeVietnameseTones(employeeKeyword);
      data = data.filter((item) =>
        removeVietnameseTones(item.employeeName || "").includes(keyword)
      );
    }

    return data;
  }, [overtimes, activeTab, employeeKeyword]);

  const pendingCount = overtimes.filter(
    (i) => i.status === "PENDING"
  ).length;

  const processedCount = overtimes.filter(
    (i) => i.status !== "PENDING"
  ).length;

  /* ================= UI ================= */

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
      APPROVED: "bg-green-100 text-green-700 border-green-200",
      REJECTED: "bg-red-100 text-red-700 border-red-200",
    };

    const labels = {
      PENDING: "Chưa xử lý",
      APPROVED: "Đã duyệt",
      REJECTED: "Đã từ chối",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs border ${
          styles[status] || "bg-gray-100 text-gray-700 border-gray-200"
        }`}
      >
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="animate-fade-in duration-300 border-[1px] border-[#162F47] rounded-xl shadow-2xl p-3 bg-gray-200">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-3">
            Quản lý yêu cầu tăng ca
          </h1>
          <p className="text-gray-500 mt-2">
            Quản lý và xét duyệt các yêu cầu tăng ca của nhân viên
          </p>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 border rounded-lg shadow mt-3 mb-3">
        
        {/* Search */}
        <div className="relative flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Tìm theo nhân viên
          </label>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={employeeKeyword}
              onChange={(e) => setEmployeeKeyword(e.target.value)}
              placeholder="Nhập tên nhân viên..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Tabs */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Trạng thái
          </label>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("PENDING")}
              className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                activeTab === "PENDING"
                  ? "bg-yellow-50 text-yellow-700 border-yellow-300"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              Chưa xử lý ({pendingCount})
            </button>

            <button
              onClick={() => setActiveTab("PROCESSED")}
              className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                activeTab === "PROCESSED"
                  ? "bg-green-50 text-green-700 border-green-300"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              Đã xử lý ({processedCount})
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-full overflow-auto">
          <table className="w-full text-sm">
            
            <thead className="bg-slate-100 sticky top-0 z-10">
              <tr className="text-slate-700">
                <th className="text-left px-4 py-4 font-semibold">Nhân viên</th>
                <th className="text-left px-4 py-4 font-semibold">Ngày</th>
                <th className="text-left px-4 py-4 font-semibold">Bắt đầu</th>
                <th className="text-left px-4 py-4 font-semibold">Kết thúc</th>
                <th className="text-left px-4 py-4 font-semibold">Lý do</th>
                <th className="text-left px-4 py-4 font-semibold">Trạng thái</th>
                <th className="text-center px-4 py-4 font-semibold">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredOvertimes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-500">
                    Không có dữ liệu phù hợp
                  </td>
                </tr>
              ) : (
                filteredOvertimes.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-4 font-semibold text-slate-800">
                      {item.employeeName}
                    </td>
                    <td className="px-4 py-4">
                      {item.overtimeDate || item.date}
                    </td>
                    <td className="px-4 py-4">{item.startTime}</td>
                    <td className="px-4 py-4">{item.endTime}</td>
                    <td className="px-4 py-4 max-w-[250px] truncate">
                      {item.reason}
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(item.status)}
                    </td>

                    <td className="px-4 py-4">
                      {item.status === "PENDING" ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => approveOvertime(item.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
                          >
                            <FiCheckCircle />
                            Duyệt
                          </button>

                          <button
                            onClick={() => rejectOvertime(item.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
                          >
                            <FiXCircle />
                            Từ chối
                          </button>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400 text-sm">
                          Đã xử lý
                        </div>
                      )}
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

export default OvertimeManagement;