import { useEffect, useState } from "react";
import { FiPlus, FiXCircle, FiGrid } from "react-icons/fi";
import { useWorkCalendarContext } from "../../../context";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

const WorkCalendarManagementPage = () => {
  const {
    calendars,
    loading,
    error,
    setError,
    fetchAllCalendars
  } = useWorkCalendarContext();

  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const [newYear, setNewYear] = useState(currentYear + 1);
  const [page, setPage] = useState(0);

  // ================= LOAD =================
  useEffect(() => {
    fetchAllCalendars();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================= AUTO NEXT YEAR =================
  useEffect(() => {
    if (calendars.length > 0) {
      const maxYear = Math.max(...calendars.map((c) => c.year));
      setNewYear(maxYear + 1);
    }
  }, [calendars]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(calendars.length / ITEMS_PER_PAGE);

  const paginatedData = calendars.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  // ================= DAY FORMAT =================
  const DAY_ORDER = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY"
  ];

  const sortDays = (days = []) => {
    return [...days].sort(
      (a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b)
    );
  };

  const convertDay = (day) => {
    const map = {
      MONDAY: "Thứ 2",
      TUESDAY: "Thứ 3",
      WEDNESDAY: "Thứ 4",
      THURSDAY: "Thứ 5",
      FRIDAY: "Thứ 6",
      SATURDAY: "Thứ 7",
      SUNDAY: "Chủ nhật"
    };
    return map[day] || day;
  };

  // ================= NAVIGATE CREATE =================
  const handleNavigateCreate = () => {
    if (!newYear || isNaN(newYear)) {
      setError("Năm không hợp lệ");
      return;
    }

    navigate("/work-calendar-management/create", {
      state: { year: Number(newYear) }
    });
  };

  // ================= UI =================
  if (loading) {
    return <div className="p-6 text-gray-500">Đang tải lịch...</div>;
  }

  return (
    <div className="bg-white border-[1px] border-[#162F47] rounded-2xl p-3 shadow-2xl">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-3 border-b border-[#162F47] pb-2">
        <div className="flex items-center gap-2">
          <FiGrid size={20} className="text-[#162F47]" />
          <span className="text-[#162F47] font-semibold text-lg">
            Danh sách lịch làm việc
          </span>
        </div>

        <span className="text-sm text-gray-500">
          Tổng: {calendars.length} năm
        </span>
      </div>

      {/* CREATE */}
      <div className="flex justify-end">
        <div className="flex flex-wrap items-center gap-4">
          <Input
            label="Nhập năm"
            type="number"
            value={newYear}
            onChange={(e) => {
              setNewYear(e.target.value);
              setError?.(null);
            }}
          />

          <button
            onClick={handleNavigateCreate}
            disabled={!newYear || isNaN(newYear)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FiPlus />
            Tạo lịch
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-600 text-sm">
              <th className="p-3 text-left">Năm</th>
              <th className="p-3 text-left">Tên</th>
              <th className="p-3 text-left">Ngày làm việc</th>
              <th className="p-3 text-left">Mô tả</th>
              <th className="p-3 text-left">Trạng thái</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr
                  key={`${item.year}-${index}`}
                  className="border-b hover:bg-blue-200 transition cursor-pointer"
                >
                  <td className="p-3 font-medium text-gray-700">
                    {item.year}
                  </td>

                  <td className="p-3 font-medium text-gray-700">
                    {item.name}
                  </td>

                  <td className="p-3 flex flex-wrap gap-1">
                    {sortDays(item.workingDays).map((d) => (
                      <span
                        key={d}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                      >
                        {convertDay(d)}
                      </span>
                    ))}
                  </td>

                  <td className="p-3 text-gray-600">
                    {item.description || "--"}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        item.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.isActive ? "Hoạt động" : "Ngưng"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-400">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-6">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className={`px-4 py-2 rounded-lg border text-sm ${
            page === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-blue-100"
          }`}
        >
          Prev
        </button>

        <span className="text-sm text-gray-500">
          Trang {page + 1} / {totalPages || 1}
        </span>

        <button
          disabled={page + 1 === totalPages}
          onClick={() => setPage(page + 1)}
          className={`px-4 py-2 rounded-lg border text-sm ${
            page + 1 === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-blue-100"
          }`}
        >
          Next
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 mt-4">
          <FiXCircle />
          {error}
        </div>
      )}
    </div>
  );
};

// ================= INPUT =================
const Input = ({ label, error, ...props }) => (
  <div className="flex flex-col min-w-[200px]">
    <label className="text-xs font-semibold text-gray-500">
      {label}
    </label>

    <input
      {...props}
      className={`w-full px-3 py-2 border rounded-lg mt-1 outline-none ${
        error
          ? "border-red-500 focus:ring-2 focus:ring-red-300"
          : "border-gray-300"
      }`}
    />

    {/* giữ layout không nhảy */}
    <p className="text-red-500 text-xs mt-1 h-[16px]">
      {error || ""}
    </p>
  </div>
);

export default WorkCalendarManagementPage;