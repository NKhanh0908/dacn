/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import {
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiRefreshCw,
} from "react-icons/fi";

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

  const [overtimes, setOvertimes] = useState([]);
  const [employeeKeyword, setEmployeeKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:8080/api/v1/overtime-requests";

  const fetchOvertimes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      const data = res.data?.data || [];
      setOvertimes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("FETCH OVERTIME ERROR:", err.response?.data || err);
      alert(
        "Không lấy được danh sách tăng ca.\nKiểm tra backend đã có GET /overtime-requests chưa."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOvertimes();
  }, []);

  const filteredOvertimes = useMemo(() => {
    let data = [...overtimes];

    if (employeeKeyword.trim()) {
      const keyword = removeVietnameseTones(employeeKeyword);
      data = data.filter((item) =>
        removeVietnameseTones(item.employeeName || "").includes(keyword)
      );
    }

    if (statusFilter === "PENDING") {
      data = data.filter((item) => item.status === "PENDING");
    } else if (statusFilter === "APPROVED") {
      data = data.filter((item) => item.status === "APPROVED");
    } else if (statusFilter === "REJECTED") {
      data = data.filter((item) => item.status === "REJECTED");
    }

    return data;
  }, [overtimes, employeeKeyword, statusFilter]);

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
        className={`px-2 py-1 rounded-full text-xs font-medium border ${
          styles[status] || "bg-gray-100 text-gray-700 border-gray-200"
        }`}
      >
        {labels[status] || status}
      </span>
    );
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}/approve`);
      fetchOvertimes();
    } catch (err) {
      console.error("APPROVE OVERTIME ERROR:", err.response?.data || err);
      alert("Duyệt tăng ca thất bại");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}/reject`);
      fetchOvertimes();
    } catch (err) {
      console.error("REJECT OVERTIME ERROR:", err.response?.data || err);
      alert("Từ chối tăng ca thất bại");
    }
  };

  const handleReset = () => {
    setEmployeeKeyword("");
    setStatusFilter("ALL");
    fetchOvertimes();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 md:px-5 xl:px-8 py-6">
      <div className="w-full max-w-[1600px] mx-auto space-y-5">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Duyệt tăng ca
            </h1>
            <p className="text-sm text-gray-500">
              Quản lý và xử lý các yêu cầu tăng ca của nhân viên
            </p>
          </div>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 border px-4 py-2 rounded-lg bg-white hover:bg-gray-50 text-sm font-medium"
          >
            <FiRefreshCw />
            Reset
          </button>
        </div>

        {/* FILTER */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Tìm nhân viên
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Nhập tên nhân viên..."
                value={employeeKeyword}
                onChange={(e) => setEmployeeKeyword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Trạng thái xử lý
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">Tất cả</option>
              <option value="PENDING">Chưa xử lý</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="REJECTED">Đã từ chối</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                    Nhân viên
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                    Ngày tăng ca
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                    Bắt đầu
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                    Kết thúc
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                    Lý do
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                    Trạng thái
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center p-8 text-gray-500">
                      Đang tải...
                    </td>
                  </tr>
                ) : filteredOvertimes.length > 0 ? (
                  filteredOvertimes.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {item.employeeName}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {item.overtimeDate || item.date}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {item.startTime || "--"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {item.endTime || "--"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {item.reason || "--"}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {item.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => handleApprove(item.id)}
                                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm"
                              >
                                <FiCheckCircle />
                                Duyệt
                              </button>

                              <button
                                onClick={() => handleReject(item.id)}
                                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
                              >
                                <FiXCircle />
                                Từ chối
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-8 text-gray-400">
                      Không có dữ liệu yêu cầu tăng ca
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OvertimeManagement;