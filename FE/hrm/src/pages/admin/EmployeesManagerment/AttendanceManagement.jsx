import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { FiEdit2, FiUser, FiX } from "react-icons/fi";

// 🔥 hàm bỏ dấu tiếng Việt
const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

const AttendanceManagement = () => {
  const role = localStorage.getItem("role");
  if (role !== "ADMIN") return <Navigate to="/" replace />;

  const [attendances, setAttendances] = useState([]);
  const [filteredAttendances, setFilteredAttendances] = useState([]);
  const [employeeKeyword, setEmployeeKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);

  const API_URL = "http://localhost:8080/api/v1/attendances";

  const getStatusBadge = (status) => {
    const styles = {
      PRESENT: "bg-green-100 text-green-700 border-green-200",
      LATE: "bg-yellow-100 text-yellow-700 border-yellow-200",
      ABSENT: "bg-red-100 text-red-700 border-red-200",
    };
    const labels = { PRESENT: "Có mặt", LATE: "Đi trễ", ABSENT: "Vắng mặt" };

    return (
      <span className={`px-2 py-1 rounded-full text-xs border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      const params = { page: 0, size: 50 }; // lấy nhiều để filter client

      // backend filter cơ bản
      if (startDate && endDate) {
        params.filter = `attendanceDate>='${startDate}' AND attendanceDate<='${endDate}'`;
      }

      const res = await axios.get(API_URL, { params });
      const data = res.data?.data?.content || [];

      setAttendances(data);
    } catch (err) {
      console.error("ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FILTER KHÔNG DẤU (client side)
  useEffect(() => {
    if (!employeeKeyword) {
      setFilteredAttendances(attendances);
      return;
    }

    const keyword = removeVietnameseTones(employeeKeyword);

    const filtered = attendances.filter((a) => {
      const name = removeVietnameseTones(a.employeeName || "");
      return name.includes(keyword);
    });

    setFilteredAttendances(filtered);
  }, [employeeKeyword, attendances]);

  useEffect(() => {
    fetchAttendances();
  }, [startDate, endDate]);

  const handleEdit = (attendance) => {
    setEditingAttendance({
      ...attendance,
      checkInTime: attendance.checkInTime?.slice(0, 16),
      checkOutTime: attendance.checkOutTime?.slice(0, 16),
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingAttendance((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await axios.put(`${API_URL}/${editingAttendance.id}`, editingAttendance);
    setShowModal(false);
    fetchAttendances();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 md:px-6 py-6">
      <div className="w-full max-w-screen-2xl mx-auto space-y-5">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Quản lý chấm công</h1>
          <button
            onClick={() => {
              setEmployeeKeyword("");
              setStartDate("");
              setEndDate("");
              fetchAttendances();
            }}
            className="border px-4 py-2 rounded-lg bg-white hover:bg-gray-50"
          >
            Reset
          </button>
        </div>

        {/* FILTER */}
        <div className="bg-white p-4 rounded-xl grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm">Tìm nhân viên</label>
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

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded-lg"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded-lg"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Nhân viên</th>
                <th className="text-left px-4 py-2">Ngày</th>
                <th className="text-left px-4 py-2">Check-in</th>
                <th className="text-left px-4 py-2">Check-out</th>
                <th className="text-left px-4 py-2">Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center p-6">Đang tải...</td>
                </tr>
              ) : filteredAttendances.length > 0 ? (
                filteredAttendances.map((a) => (
                  <tr key={a.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{a.employeeName}</td>
                    <td>{a.attendanceDate}</td>
                    <td>{a.checkInTime || "--"}</td>
                    <td>{a.checkOutTime || "--"}</td>
                    <td>{getStatusBadge(a.status)}</td>
                    <td className="text-right pr-3">
                      <button onClick={() => handleEdit(a)}>
                        <FiEdit2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-6">Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="bg-white p-5 rounded-xl w-full max-w-md">
              <div className="flex justify-between mb-4">
                <h2 className="font-bold">Cập nhật</h2>
                <FiX onClick={() => setShowModal(false)} />
              </div>

              <form onSubmit={handleUpdate} className="space-y-3">
                <input
                  type="datetime-local"
                  name="checkInTime"
                  value={editingAttendance.checkInTime || ""}
                  onChange={handleChange}
                  className="w-full border p-2"
                />
                <input
                  type="datetime-local"
                  name="checkOutTime"
                  value={editingAttendance.checkOutTime || ""}
                  onChange={handleChange}
                  className="w-full border p-2"
                />

                <select
                  name="status"
                  value={editingAttendance.status}
                  onChange={handleChange}
                  className="w-full border p-2"
                >
                  <option value="PRESENT">Có mặt</option>
                  <option value="LATE">Đi trễ</option>
                  <option value="ABSENT">Vắng</option>
                </select>

                <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
                  Lưu
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