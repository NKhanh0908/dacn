// eslint-disable react-hooks/rules-of-hooks 
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiClock, FiMoreVertical, FiEdit2, FiEye, FiCalendar, FiPlus } from "react-icons/fi";
import { useEmployeeContext, useAttendanceContext } from "../../../context";
import { AttendanceRequestManagement, OvertimeManagement } from "../../index";

const AttendanceManagementPage = () => {
  const navigate = useNavigate();
  const { employees, loadingEmployees } = useEmployeeContext();
  const { attendances, fetchAttendances } = useAttendanceContext();

  // ========== STATE ==========
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("Phòng ban");
  const [viewMode, setViewMode] = useState("attendance");
  const [activeMenu, setActiveMenu] = useState(null);

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const yearRef = useRef(null);

  // ========== SAFE ==========
  const safeEmployees = Array.isArray(employees) ? employees : [];
  const safeAttendance = Array.isArray(attendances) ? attendances : [];

  // ========== GROUP DATA (FIX CHUẨN) ==========
  const groupedData = {};

  safeAttendance.forEach((a) => {
    if (!a.attendanceDate) return;

    const date = new Date(a.attendanceDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if (!groupedData[year]) groupedData[year] = {};
    if (!groupedData[year][month]) groupedData[year][month] = {};
    if (!groupedData[year][month][day]) groupedData[year][month][day] = [];

    groupedData[year][month][day].push(a);
  });

  // ========== AUTO SELECT MỚI NHẤT ==========
  useEffect(() => {
    const years = Object.keys(groupedData).map(Number).sort((a, b) => b - a);
    if (!years.length) return;

    const y = years[0];
    const months = Object.keys(groupedData[y]).map(Number).sort((a, b) => b - a);
    const m = months[0];

    const days = Object.keys(groupedData[y][m]).map(Number).sort((a, b) => b - a);
    const d = days[0];

    setSelectedYear(y);
    setSelectedMonth(m);
    setSelectedDay(d);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendances]);

  // ========== FETCH ==========
  useEffect(() => {
    fetchAttendances();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ========== MERGE ==========
  const mergedData = safeEmployees.map((emp) => {
    const attendance = safeAttendance.find(
      (a) =>
        a.employeeId === emp.employeeId &&
        a.attendanceDate &&
        new Date(a.attendanceDate).getFullYear() === selectedYear &&
        new Date(a.attendanceDate).getMonth() + 1 === selectedMonth &&
        new Date(a.attendanceDate).getDate() === selectedDay
    );

    return { ...emp, attendance };
  });

  // ========== FILTER ==========
  const filtered = mergedData.filter((emp) => {
    const matchName = emp.fullName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchDept =
      selectedDepartment === "Phòng ban" ||
      emp.department === selectedDepartment;

    return matchName && matchDept;
  });

  const getStatusLabel = (status) => {
    switch (status) {
      case "WORKING":
        return "Đang làm";
      case "PROBATION":
        return "Thử việc";
      case "ON_LEAVE":
        return "Nghỉ phép";
      case "RESIGNED":
        return "Đã nghỉ";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "WORKING":
        return "bg-green-100 text-green-700";
      case "PROBATION":
        return "bg-yellow-100 text-yellow-700";
      case "ON_LEAVE":
        return "bg-blue-100 text-blue-700";
      case "RESIGNED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getAttendanceStatusLabel = (status) => {
    switch (status) {
      case "PRESENT":
        return "Có mặt";
      case "ABSENT":
        return "Vắng";
      case "LATE":
        return "Đi trễ";
      case "EARLY_LEAVE":
        return "Về sớm";
      case "LATE_AND_EARLY_LEAVE":
        return "Trễ & về sớm";
      case "ON_TIME":
        return "Đúng giờ";
      case "LEAVE":
        return "Nghỉ phép";
      case "HOLIDAY":
        return "Ngày lễ";
      case "WEEKEND":
        return "Cuối tuần";
      case "BUSINESS_TRIP":
        return "Công tác";
      case "REMOTE_WORK":
        return "Làm từ xa";
      case "OVERTIME":
        return "Tăng ca";
      case "OT_PENDING_APPROVAL":
        return "OT chờ duyệt";
      case "OT_REJECTED":
        return "OT bị từ chối";
      case "PENDING":
        return "Chờ duyệt";
      default:
        return status || "Không xác định";
    }
  };

  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case "PRESENT":
      case "ON_TIME":
        return "bg-green-100 text-green-700";
      case "LATE":
      case "EARLY_LEAVE":
      case "LATE_AND_EARLY_LEAVE":
        return "bg-yellow-100 text-yellow-700";
      case "ABSENT":
        return "bg-red-100 text-red-700";
      case "LEAVE":
      case "HOLIDAY":
      case "WEEKEND":
        return "bg-blue-100 text-blue-700";
      case "BUSINESS_TRIP":
      case "REMOTE_WORK":
        return "bg-purple-100 text-purple-700";
      case "OVERTIME":
        return "bg-indigo-100 text-indigo-700";
      case "OT_PENDING_APPROVAL":
      case "PENDING":
        return "bg-gray-100 text-gray-600";
      case "OT_REJECTED":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // ================= UI =================
  return (
    <div className="overflow-y-auto h-[calc(100vh-100px)] pr-4 pb-4">
      {/* VIEW MODE TOGGLE */}
      <div className="flex gap-2 mb-3 bg-gray-200 rounded-lg w-max">
        <button
          onClick={() => setViewMode("attendance")}
          className={`px-3 py-2 rounded-lg ${
            viewMode === "attendance"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Chấm công
        </button>

        <button
          onClick={() => setViewMode("attendance-requests")}
          className={`px-3 py-2 rounded-lg ${
            viewMode === "attendance-requests"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Yêu cầu chấm công
        </button>

        <button
          onClick={() => setViewMode("leave-requests")}
          className={`px-3 py-2 rounded-lg ${
            viewMode === "leave-requests"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Yêu cầu tăng ca
        </button>
      </div>

      {/* GRID */}
      {loadingEmployees ? (
        <div className="text-center py-10">Đang tải...</div>
      ) : viewMode === "attendance" ? (

        // CHẤM CÔNG
        <div className="animate-fade-in duration-300 border-[1px] border-[#162F47] rounded-xl shadow-2xl p-3 bg-gray-200">
          <h1 className="text-2xl font-bold mb-3">Quản lý chấm công</h1>

          {/* FILTER */}
          <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 border rounded-lg shadow mb-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="border rounded-lg px-3"
            >
              {["Phòng ban", "HR", "IT", "Finance", "Marketing", "Sales"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>

            <button
              onClick={() => navigate("/attendance-management/create")}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <FiPlus /> Thêm chấm công
            </button>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 space-y-4">
            {/* YEAR */}
            <div ref={yearRef} className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-500 w-12">Năm:</span>
              <div ref={yearRef} className="flex gap-2 overflow-x-auto pb-1 pr-2 no-scrollbar">
                {Object.keys(groupedData)
                  .sort((a, b) => b - a)
                  .map((year) => (
                    <button
                      key={year}
                      onClick={() => {
                        const y = Number(year);
                        setSelectedYear(y);

                        const months = Object.keys(groupedData[y] || {})
                          .map(Number)
                          .sort((a, b) => b - a);

                        const m = months[0];
                        setSelectedMonth(m);

                        const days = Object.keys(groupedData[y]?.[m] || {})
                          .map(Number)
                          .sort((a, b) => b - a);

                        const d = days[0];
                        setSelectedDay(d);
                      }}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedYear === Number(year)
                          ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
              </div>
            </div>

            {/* MONTH */}
            <div className="flex items-center gap-4 border-t pt-3">
              <span className="text-sm font-medium text-gray-500 w-12">Tháng:</span>
              <div className="flex gap-2 overflow-x-auto pb-1 pr-2 no-scrollbar">
                {Object.keys(groupedData[selectedYear] || {})
                  .sort((a, b) => b - a)
                  .map((month) => (
                    <button
                      key={month}
                      onClick={() => {
                        const m = Number(month);
                        setSelectedMonth(m);

                        const days = Object.keys(groupedData[selectedYear]?.[m] || {})
                          .map(Number)
                          .sort((a, b) => b - a);

                        const d = days[0];
                        setSelectedDay(d);
                      }}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedMonth === Number(month)
                          ? "bg-indigo-500 text-white shadow-md shadow-indigo-100"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Tháng {month}
                    </button>
                  ))}
              </div>
            </div>

            {/* DAY */}
            <div className="flex items-center gap-4 border-t pt-3">
              <span className="text-sm font-medium text-gray-500 w-12">Ngày:</span>
              <div className="flex gap-2 overflow-x-auto pb-1 pr-2 no-scrollbar">
                {Object.keys(groupedData[selectedYear]?.[selectedMonth] || {})
                  .sort((a, b) => b - a)
                  .map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(Number(day))}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                        selectedDay === Number(day)
                          ? "bg-emerald-500 text-white rotate-3 shadow-lg"
                          : "bg-gray-50 text-gray-600 hover:bg-emerald-100 hover:text-emerald-700"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((emp) => (
              <div
                key={emp.employeeId}
                className="bg-white rounded-xl shadow-sm border p-5 relative"
              >
                {/* MENU */}
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={() =>
                      setActiveMenu(
                        activeMenu === emp.employeeId
                          ? null
                          : emp.employeeId
                      )
                    }
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FiMoreVertical />
                  </button>

                  {activeMenu === emp.employeeId && (
                    <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-xl z-20">
                      {/* DETAIL PAGE */}
                      <button
                        onClick={() => {
                          navigate(`/attendance-management/${emp.attendance?.id}`);
                          setActiveMenu(null);
                        }}
                        disabled={!emp.attendance?.checkInTime}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-blue-50 text-blue-600 disabled:cursor-not-allowed disabled:text-gray-400"
                      >
                        <FiEye size={14} /> Xem chi tiết
                      </button>

                      {/* EDIT PAGE */}
                      <button
                        onClick={() => {
                          navigate(`/attendance-management/edit/${emp.attendance?.id}`);
                          setActiveMenu(null);
                        }}
                        disabled={!emp.attendance?.checkInTime}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-blue-50 text-blue-600 disabled:cursor-not-allowed disabled:text-gray-400"
                      >
                        <FiEdit2 size={14} /> Chỉnh sửa
                      </button>
                    </div>
                  )}
                </div>

                {/* INFO */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {emp.fullName?.charAt(0)}
                  </div>

                  <div>
                    <h3 className="font-bold">{emp.fullName}</h3>
                    <p className="text-xs text-gray-500">
                      {emp.department} • {emp.position}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${getStatusColor(emp.status)}`}
                    >
                      {getStatusLabel(emp.status)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-dashed border-gray-100">
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold flex items-center gap-1">
                      <FiClock size={10}/> Check-in
                    </span>
                    <p className="text-sm font-bold text-gray-700">{emp.attendance?.checkInTime || "--:--"}</p>
                  </div>
                  <div className="space-y-1 border-l pl-3">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold flex items-center gap-1">
                      <FiClock size={10}/> Check-out
                    </span>
                    <p className="text-sm font-bold text-gray-700">{emp.attendance?.checkOutTime || "--:--"}</p>
                  </div>
                </div>
                
                <div className="mt-4 text-[11px] flex items-center justify-between text-gray-400 bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center gap-2 ">
                    <FiCalendar size={12} />
                    <span>Ngày: {emp.attendance?.attendanceDate || "----/--/--"}</span>
                  </div>
                  <div>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${getAttendanceStatusColor(emp.attendance?.status)}`}
                    >
                      {getAttendanceStatusLabel(emp.attendance?.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : viewMode === "attendance-requests" ? (
        <AttendanceRequestManagement />
      ) : (
        <OvertimeManagement />
      )}
    </div>
  );
};

export default AttendanceManagementPage;