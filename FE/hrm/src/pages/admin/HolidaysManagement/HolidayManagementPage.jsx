/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  FiMoreVertical,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiSearch
} from "react-icons/fi";

import { useHolidayContext } from "../../../context";

const months = [
  "Tất cả",
  "01","02","03","04","05","06",
  "07","08","09","10","11","12"
];

const HolidayManagementPage = () => {
  const role = localStorage.getItem("role")?.toUpperCase();
  if (!role?.includes("ADMIN") && !role?.includes("HR")) {
    return <Navigate to="/" replace />;
  }

  const navigate = useNavigate();

  const {
    holidays,
    loading,
    removeHoliday
  } = useHolidayContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("Tất cả");
  const [activeMenu, setActiveMenu] = useState(null);

  const safeHolidays = Array.isArray(holidays) ? holidays : [];

  /* ================= HELPERS ================= */
  const isPastHoliday = (date) => {
    const today = new Date().toISOString().split("T")[0];
    return date < today;
  };

  /* ================= FILTER ================= */
  const filtered = safeHolidays.filter((h) => {
    const matchName = h.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (selectedMonth === "Tất cả") return matchName;

    const month = h.startDate?.split("-")[1];
    return matchName && month === selectedMonth;
  });

  /* ================= ACTION ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa ngày nghỉ này?")) return;

    try {
      await removeHoliday(id);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Xóa thất bại";

      alert(message);
    }
  };

  return (
    <div className="bg-gray-200 p-4 border border-[#162F47] rounded-xl shadow-2xl">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-3 border-b border-[#162F47] pb-2">
        <div className="flex items-center gap-2">
          <FiCalendar size={20} className="text-[#162F47]" />
          <span className="font-semibold text-lg text-[#162F47]">
            Quản lý ngày nghỉ
          </span>
        </div>

        <span className="text-sm text-gray-500">
          Tổng: {safeHolidays.length} ngày lễ
        </span>
      </div>

      {/* FILTER */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 border rounded-lg shadow mt-3 mb-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm ngày nghỉ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {months.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        <button
          onClick={() => navigate("/holiday-management/create")}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          <FiPlus /> Thêm ngày nghỉ
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="text-center py-10">Đang tải...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Không có ngày nghỉ
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((h) => {
            const isPast = isPastHoliday(h.startDate);

            return (
              <div
                key={h.id}
                className="bg-white rounded-xl shadow border p-5 relative hover:shadow-lg transition"
              >
                {/* MENU */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() =>
                      setActiveMenu(activeMenu === h.id ? null : h.id)
                    }
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FiMoreVertical />
                  </button>

                  {activeMenu === h.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-xl z-20 overflow-hidden">
                      <button
                        disabled={isPast}
                        onClick={() => navigate(`/holiday-management/edit/${h.id}`)}
                        className={`w-full px-4 py-2 text-sm flex gap-2 ${
                          isPast
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "hover:bg-blue-50 text-blue-600"
                        }`}
                      >
                        <FiEdit2 size={14}/> Sửa
                      </button>

                      <button
                        disabled={isPast}
                        onClick={() => handleDelete(h.id)}
                        className={`w-full px-4 py-2 text-sm flex gap-2 ${
                          isPast
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "hover:bg-red-50 text-red-600"
                        }`}
                      >
                        <FiTrash2 size={14}/> Xóa
                      </button>
                    </div>
                  )}
                </div>

                {/* INFO */}
                <h3 className="font-bold text-lg">{h.name}</h3>

                <p className="text-sm text-gray-500 mt-1">
                  {h.startDate} → {h.endDate}
                </p>

                {/* STATUS */}
                <div className="mt-2 flex gap-2">
                  {isPast ? (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                      Đã qua
                    </span>
                  ) : (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                      Sắp tới
                    </span>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    {h.type}
                  </span>

                  <span className={`text-xs px-2 py-1 rounded ${
                    h.isPaid
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {h.isPaid ? "Có lương" : "Không lương"}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {h.description || "Không có mô tả"}
                </p>

                <div className="mt-3 text-sm text-gray-500 flex justify-between">
                  <span>Hệ số:</span>
                  <span className="font-semibold text-black">
                    {h.salaryMultiplier}x
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HolidayManagementPage;