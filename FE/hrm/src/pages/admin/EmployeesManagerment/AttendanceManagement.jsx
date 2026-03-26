import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  FiEdit2,
  FiUser,
  FiX,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiCalendar
} from "react-icons/fi";

import {
  getAttendances,
  updateAttendance,
  approveAttendance
} from "../../../services/attendance/AttendanceService";

// 🔥 bỏ dấu tiếng Việt
const removeVietnameseTones = (str = "") => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

const AttendanceManagement = () => {
  const role = localStorage.getItem("role");
  if (role !== "ADMIN" && role !== "HR") {
    return <Navigate to="/" replace />;
  }

  const [attendances, setAttendances] = useState([]);
  const [employeeKeyword, setEmployeeKeyword] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("ALL"); // ALL | PENDING | APPROVED | REJECTED
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);

  // =========================
  // UI Helpers
  // =========================
  const getStatusBadge = (status) => {
    const styles = {
      PRESENT: "bg-green-100 text-green-700 border-green-200",
      LATE: "bg-yellow-100 text-yellow-700 border-yellow-200",
      ABSENT: "bg-red-100 text-red-700 border-red-200",
    };

    const labels = {
      PRESENT: "Có mặt",
      LATE: "Đi trễ",
      ABSENT: "Vắng mặt",
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs border ${styles[status] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
        {labels[status] || status || "Không rõ"}
      </span>
    );
  };

  const getApprovalBadge = (attendance) => {

    if (attendance?.isApproved === true) {
      return (
        <span className="px-2 py-1 rounded-full text-xs border bg-green-100 text-green-700 border-green-200">
          Đã duyệt
        </span>
      );
    }

    return (
      <span className="px-2 py-1 rounded-full text-xs border bg-yellow-100 text-yellow-700 border-yellow-200">
        Chưa duyệt
      </span>
    );
  };

  // =========================
  // Fetch data
  // =========================
  const fetchAttendances = async () => {
    setLoading(true);
    try {
      const params = {
        page: 0,
        size: 200,
      };

      const res = await getAttendances(params);

      // hỗ trợ nhiều kiểu backend trả về
      const data =
        res?.content ||
        res?.result ||
        res?.items ||
        [];

      setAttendances(data);
    } catch (err) {
      console.error("Lỗi lấy danh sách chấm công:", err);
      setAttendances([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, []);

  // =========================
  // Filter theo tháng + tên + duyệt
  // =========================
  const filteredAttendances = useMemo(() => {
    let result = [...attendances];

    // 1. Lọc theo tên không dấu
    if (employeeKeyword.trim()) {
      const keyword = removeVietnameseTones(employeeKeyword.trim());

      result = result.filter((a) => {
        const name = removeVietnameseTones(a.employeeName || "");
        return name.includes(keyword);
      });
    }

    // 2. Lọc theo tháng yyyy-mm
    if (selectedMonth) {
      result = result.filter((a) => {
        if (!a.attendanceDate) return false;
        return a.attendanceDate.startsWith(selectedMonth);
      });
    }

    // 3. Lọc theo trạng thái duyệt
    if (approvalFilter === "PENDING") {
      result = result.filter((a) => a.isApproved !== true && !a.rejected);
    }

    if (approvalFilter === "APPROVED") {
      result = result.filter((a) => a.isApproved === true);
    }

    if (approvalFilter === "REJECTED") {
      result = result.filter((a) => a.rejected === true);
    }

    return result;
  }, [attendances, employeeKeyword, selectedMonth, approvalFilter]);

  // =========================
  // Edit
  // =========================
  const handleEdit = (attendance) => {
    setEditingAttendance({
      ...attendance,
      checkInTime: attendance.checkInTime || "",
      checkOutTime: attendance.checkOutTime || "",
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingAttendance((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateAttendance(editingAttendance.id, editingAttendance);
      setShowModal(false);
      fetchAttendances();
    } catch (err) {
      console.error("Lỗi cập nhật chấm công:", err);
      alert("Cập nhật thất bại!");
    }
  };

  // =========================
  // Approve / Reject
  // =========================
  const handleApprove = async (attendanceId) => {
    try {
      await approveAttendance(attendanceId);
      alert("Duyệt chấm công thành công!");
      fetchAttendances();
    } catch (err) {
      console.error("Lỗi duyệt chấm công:", err);
      alert(
        err?.response?.data?.message ||
        "Duyệt thất bại! Có thể backend chưa đủ dữ liệu (ví dụ thiếu lịch làm việc)."
      );
    }
  };

  const handleReset = () => {
    setEmployeeKeyword("");
    setSelectedMonth("");
    setApprovalFilter("ALL");
    fetchAttendances();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 md:px-6 py-6">
      <div className="w-full max-w-screen-2xl mx-auto space-y-5">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <h1 className="text-2xl font-bold">Quản lý chấm công</h1>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 border px-4 py-2 rounded-lg bg-white hover:bg-gray-50"
          >
            <FiRefreshCw />
            Reset
          </button>
        </div>

        {/* FILTER */}
        <div className="bg-white p-4 rounded-xl grid md:grid-cols-4 gap-4 shadow-sm">
          {/* Tìm tên */}
          <div>
            <label className="text-sm font-medium mb-1 block">Tìm nhân viên</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Nhập tên nhân viên..."
                value={employeeKeyword}
                onChange={(e) => setEmployeeKeyword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Lọc theo tháng */}
          <div>
            <label className="text-sm font-medium mb-1 block">Lọc theo tháng</label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-3 text-gray-400" />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Phân loại duyệt */}
          <div>
            <label className="text-sm font-medium mb-1 block">Trạng thái duyệt</label>
            <select
              value={approvalFilter}
              onChange={(e) => setApprovalFilter(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="ALL">Tất cả</option>
              <option value="PENDING">Chưa duyệt</option>
              <option value="APPROVED">Đã duyệt</option>
            </select>
          </div>

          {/* Tổng số */}
          <div className="flex items-end">
            <div className="w-full bg-blue-50 border border-blue-100 rounded-xl p-3">
              <p className="text-sm text-gray-600">Tổng bản ghi</p>
              <p className="text-2xl font-bold text-blue-700">
                {filteredAttendances.length}
              </p>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-3">Nhân viên</th>
                  <th className="text-left px-4 py-3">Ngày</th>
                  <th className="text-left px-4 py-3">Check-in</th>
                  <th className="text-left px-4 py-3">Check-out</th>
                  <th className="text-left px-4 py-3">Trạng thái</th>
                  <th className="text-left px-4 py-3">Duyệt</th>
                  <th className="text-center px-4 py-3">Hành động</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center p-6">
                      Đang tải...
                    </td>
                  </tr>
                ) : filteredAttendances.length > 0 ? (
                  filteredAttendances.map((a) => (
                    <tr key={a.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{a.employeeName || "--"}</td>
                      <td className="px-4 py-3">{a.attendanceDate || "--"}</td>
                      <td className="px-4 py-3">{a.checkInTime || "--"}</td>
                      <td className="px-4 py-3">{a.checkOutTime || "--"}</td>
                      <td className="px-4 py-3">{getStatusBadge(a.status)}</td>
                      <td className="px-4 py-3">{getApprovalBadge(a)}</td>

                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2 flex-wrap">
                          {/* Duyệt */}
                          {a.isApproved !== true && !a.rejected && (
                            <>
                              <button
                                onClick={() => handleApprove(a.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm"
                              >
                                <FiCheckCircle />
                                Duyệt
                              </button>
                            </>
                          )}

                          {/* Sửa */}
                          <button
                            onClick={() => handleEdit(a)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-50 text-sm"
                          >
                            <FiEdit2 />
                            Sửa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-6">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL */}
        {showModal && editingAttendance && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white p-5 rounded-xl w-full max-w-md shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Cập nhật chấm công</h2>
                <button onClick={() => setShowModal(false)}>
                  <FiX className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-3">
                <div>
                  <label className="text-sm block mb-1">Check-in</label>
                  <input
                    type="time"
                    name="checkInTime"
                    value={editingAttendance.checkInTime || ""}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-sm block mb-1">Check-out</label>
                  <input
                    type="time"
                    name="checkOutTime"
                    value={editingAttendance.checkOutTime || ""}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-sm block mb-1">Trạng thái</label>
                  <select
                    name="status"
                    value={editingAttendance.status || "PRESENT"}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-lg"
                  >
                    <option value="PRESENT">Có mặt</option>
                    <option value="LATE">Đi trễ</option>
                    <option value="ABSENT">Vắng</option>
                  </select>
                </div>

                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Lưu cập nhật
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceManagement;