/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect, useRef  } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiDollarSign,
  FiCalendar,
  FiPlay,
  FiGift,
  FiTrash2,
  FiMoreVertical,
  FiEye
} from "react-icons/fi";

import { useEmployeeContext } from "../../../context";
import { usePayrollContext } from "../../../context";

const PayrollManagement = () => {
  const role = localStorage.getItem("role")?.toUpperCase();
  if (!role.includes("ADMIN") && !role.includes("HR")) return <Navigate to="/" replace />;

  const navigate = useNavigate();
  const { employees, loadingEmployees } = useEmployeeContext();
  const {
    payrolls,
    fetchPayrolls,
    createPayroll,
    deletePayroll,
    calculateAllPayrolls
  } = usePayrollContext();

  const today = new Date();
  const currentMonth = today.getMonth() + 1; 
  const currentYear = today.getFullYear();

  // ========== STATE ==========
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("Phòng ban");
  const [viewMode, setViewMode] = useState("employee");
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const yearRef = useRef(null);
  const [yearWidth, setYearWidth] = useState(0);

  // ========== DEPARTMENTS ==========
  const departments = ["Phòng ban", "HR", "IT", "Finance", "Marketing", "Sales"];

  // ================= SAFE =================
  const safeEmployees = Array.isArray(employees) ? employees : [];
  const safePayrolls = Array.isArray(payrolls) ? payrolls : [];

  // ================= MERGE =================
  const mergedData = safeEmployees.map(emp => {
    // Lấy payroll đúng tháng hiện tại
    const payroll = safePayrolls.find(
      p => p.employeeId === emp.employeeId &&
          p.month === currentMonth &&
          p.year === currentYear
    );

    return {
      ...emp,
      payroll
    };
  });

  // ================= FILTER =================
  const filtered = mergedData.filter(emp => {
    const matchName = emp.fullName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchDept =
      selectedDepartment === "Phòng ban" ||
      emp.department === selectedDepartment;

    return matchName && matchDept;
  });

  // ================= ACTION =================
  const handleCreate = async (emp) => {
    if (emp.payroll) {
      alert("Đã có payroll tháng này!");
      return;
    }

    try {
      await createPayroll(emp.employeeId);
      await fetchPayrolls();
      alert("Tính lương thành công!");
    } catch (err) {
      console.error(err);
      alert("Lỗi tính lương!");
    }
  };

  const handleDelete = async (emp) => {
    if (!emp.payroll) {
      alert("Không có payroll!");
      return;
    }

    if (!window.confirm("Bạn có chắc muốn xóa?")) return;

    try {
      await deletePayroll(emp.payroll.payrollId);
      await fetchPayrolls();
      alert("Xóa thành công!");
    } catch (err) {
      console.error(err);
      alert("Lỗi xóa!");
    }
  };

  const handleCalculateAll = async () => {
    if (!window.confirm("Bạn có chắc muốn tính lương toàn bộ cho tất cả nhân viên?")) return;

    try {
      await calculateAllPayrolls();
    } catch (err) {
      console.error(err);
    }
  };

  // ========== GROUP PAYROLLS THEO NĂM + THÁNG ==========
  const groupedData = {};

  safePayrolls.forEach(p => {
    const year = p.year;
    const month = p.month;
    if (!groupedData[year]) {
      groupedData[year] = {};
    }

    if (!groupedData[year][month]) {
      groupedData[year][month] = [];
    }
    groupedData[year][month].push(p);
  });

  // ================= AUTO SELECT LATEST =================
  useEffect(() => {
    if (viewMode === "time" && !selectedYear && Object.keys(groupedData).length > 0) {
      const years = Object.keys(groupedData).map(Number).sort((a, b) => b - a);
      const latestYear = years[0];
      const months = Object.keys(groupedData[latestYear]).map(Number).sort((a, b) => b - a);
      const latestMonth = months[0];

      setSelectedYear(latestYear);
      setSelectedMonth(latestMonth);
    }

    if (yearRef.current) {
      setYearWidth(yearRef.current.offsetWidth); 
    }
  }, [viewMode, groupedData, selectedYear]);

  // ================= UI =================
  return (
    <div className="overflow-y-auto h-[calc(100vh-100px)] pr-4 pb-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Quản lý lương
          </h1>
          <p className="text-gray-500 mt-2">
            Tổng {filtered.length} nhân viên
          </p>
        </div>

        <button
          onClick={handleCalculateAll}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <FiPlay size={18} /> Tính lương tất cả
        </button>
      </div>

      {/* FILTER */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 border rounded-lg shadow mt-3 mb-3">
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
          {departments.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 mb-3 bg-gray-200 rounded-lg w-max">
        <button
          onClick={() => setViewMode("employee")}
          className={`px-3 py-2 rounded-lg ${
            viewMode === "employee"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Lương nhân viên
        </button>

        <button
          onClick={() => setViewMode("time")}
          className={`px-3 py-2 rounded-lg ${
            viewMode === "time"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Lịch sử lương
        </button>
      </div>

      {/* GRID */}
      {loadingEmployees ? (
        <div className="text-center py-10">Đang tải...</div>
      ) : viewMode === "employee" ? (

        // ================= EMPLOYEE VIEW =================
        <div>
          <div className="mt-2 mb-3">
            <h1 className="text-2xl font-bold">
              Tính lương tháng {currentMonth}/{currentYear}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-6 ">
            {filtered.map(emp => (
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
                          navigate(`/payroll-management/${emp.payroll.payrollId}`);
                          setActiveMenu(null);
                        }}
                        disabled={!emp.payroll}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-blue-50 text-blue-600 disabled:cursor-not-allowed disabled:text-gray-400"
                      >
                        <FiEye size={14} /> Xem chi tiết
                      </button>

                      <button
                        onClick={() => handleDelete(emp)}
                        disabled={!emp.payroll}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-blue-50 text-red-600 disabled:cursor-not-allowed disabled:text-gray-400"
                      >
                        <FiTrash2 /> Xóa
                      </button>
                    </div>
                  )}
                </div>

                {/* INFO */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {emp.fullName?.charAt(0)}
                  </div>

                  <div>
                    <h3 className="font-bold">{emp.fullName}</h3>
                    <p className="text-xs text-gray-500">
                      {emp.department} • {emp.position}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm border-t pt-4">
                  <div className="flex items-center gap-2">
                    <FiCalendar /> Tháng:{" "}
                    {emp.payroll
                      ? `${emp.payroll.month}/${emp.payroll.year}`
                      : "--"}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <FiDollarSign /> Lương cơ bản:
                    </span>
                    {emp.payroll?.basicSalary?.toLocaleString() || "--"}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <FiDollarSign /> Thực nhận:
                    </span>
                    <span className="font-semibold text-green-600">
                      {emp.payroll?.netSalary?.toLocaleString() || "--"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 mx-auto w-1/2">
                  <button
                    onClick={() => handleCreate(emp)}
                    disabled={!!emp.payroll}
                    className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm disabled:opacity-50"
                  >
                    <FiPlay/> Tính lương
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // ================= TIME VIEW =================
        <div className="relative">
          {/* ================= YEAR TABS ================= */}
          <div
            ref={yearRef}
            className="flex flex-wrap bg-gray-200 rounded-t-lg w-max border border-gray-400 border-b-0"
          >
            {Object.keys(groupedData)
              .sort((a, b) => b - a)
              .map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    setSelectedYear(Number(year));
                    const months = Object.keys(groupedData[year])
                      .map(Number)
                      .sort((a, b) => b - a);
                    setSelectedMonth(months[0]);
                  }}
                  className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition ${
                    selectedYear === Number(year)
                      ? "bg-blue-200 shadow"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {year}
                </button>
              ))}
          </div>

          {/* ================= MONTH TABS ================= */}
          {selectedYear && (
            <div className="flex gap-2 flex-wrap bg-blue-200 px-2 pt-3 relative border border-gray-400 border-b-0 border-t-0">
              <div
                className="absolute top-0 right-0 border-t-[1px] border-gray-400"
                style={{ width: `calc(100% - ${yearWidth}px + 1.7px)` }}
              ></div>
              {Object.keys(groupedData[selectedYear])
                .sort((a, b) => b - a)
                .map((month) => (
                  <button
                    key={month}
                    onClick={() => setSelectedMonth(Number(month))}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      selectedMonth === Number(month)
                        ? "bg-blue-500 text-white shadow"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    Tháng {month}
                  </button>
                ))}
            </div>
          )}

          {/* ================= CONTENT ================= */}
          {selectedYear && selectedMonth && (
            <div className="bg-blue-200 p-2 rounded-b-lg mb-4 border border-gray-400 border-t-0">
              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Tháng {selectedMonth}/{selectedYear}
                </h2>

                <div className="text-md">
                  <b>Tổng lương:</b>{" "}
                  <span className="font-semibold text-green-600">
                    {groupedData[selectedYear][selectedMonth]
                      .reduce((sum, p) => sum + p.netSalary, 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>

              {/* GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {groupedData[selectedYear][selectedMonth].map(payroll => {
                  const emp = safeEmployees.find(
                    e => e.employeeId === payroll.employeeId
                  );

                  return (
                    <div
                      key={payroll.payrollId}
                      className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-lg transition-all duration-200"
                    >
                      {/* HEADER */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                          {emp?.fullName?.charAt(0)}
                        </div>

                        <div>
                          <h3 className="font-semibold">
                            {emp?.fullName || "Unknown"}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {emp?.department} • {emp?.position}
                          </p>
                        </div>
                      </div>

                      {/* INFO */}
                      <div className="space-y-2 text-sm border-t pt-3">

                        <div className="flex justify-between">
                          <span className="flex items-center gap-1">
                            <FiDollarSign />
                            Lương cơ bản
                          </span>
                          <span className="font-medium">
                            {payroll.basicSalary.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="flex items-center gap-1">
                            <FiGift />
                            Phụ cấp
                          </span>
                          <span className="font-medium">
                            {payroll.allowances.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="flex items-center gap-1">
                            <FiDollarSign />
                            Khấu trừ
                          </span>
                          <span className="text-red-500">
                            {payroll.totalDeductions.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between text-green-600 font-semibold text-base">
                          <span className="flex items-center gap-1">
                            <FiDollarSign />
                            Thực nhận
                          </span>
                          <span>
                            {payroll.netSalary.toLocaleString()}
                          </span>
                        </div>

                      </div>

                      {/* ACTION */}
                      <div className="mt-4 mx-auto w-1/2">
                        <button
                          onClick={() => handleDelete({ payroll, ...emp })}
                          className="flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-1"
                        >
                          <FiTrash2 /> Xóa
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PayrollManagement;