/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  FiSearch,
  FiDollarSign,
  FiCalendar,
  FiPlay,
  FiRefreshCw,
  FiTrash2
} from "react-icons/fi";

import { useEmployeeContext } from "../../../context";
import { usePayrollContext } from "../../../context";

const PayrollManagement = () => {
  const role = localStorage.getItem("role")?.toUpperCase();
  const isAdmin = role?.includes("ADMIN");
  const isHR = role?.includes("HR");

  if (!isAdmin && !isHR) return <Navigate to="/" replace />;

  const { employees, loadingEmployees } = useEmployeeContext();
  const {
    payrolls,
    fetchPayrolls,
    createPayroll,
    updatePayroll,
    deletePayroll
  } = usePayrollContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("employee");
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  // ================= SAFE =================
  const safeEmployees = Array.isArray(employees) ? employees : [];
  const safePayrolls = Array.isArray(payrolls) ? payrolls : [];

  // ================= MERGE (FIX CHUẨN) =================
  const mergedData = safeEmployees.map(emp => {

    const payroll = safePayrolls
      .filter(p => p.employeeId === emp.employeeId)
      .sort((a, b) => b.year - a.year || b.month - a.month)[0];

    return {
      ...emp,
      payroll
    };
  });

  // ================= FILTER =================
  const filtered = mergedData.filter(emp =>
    emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleUpdate = async (emp) => {
    if (!emp.payroll) {
      alert("Chưa có payroll!");
      return;
    }

    try {
      await updatePayroll(emp.payroll.payrollId, emp.employeeId);
      await fetchPayrolls();
      alert("Cập nhật thành công!");
    } catch (err) {
      console.error(err);
      alert("Lỗi cập nhật!");
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
    try {
      await Promise.all(
        safeEmployees.map(emp =>
          createPayroll(emp.employeeId).catch(() => null)
        )
      );

      await fetchPayrolls();
      alert("Đã tính lương toàn bộ!");
    } catch (err) {
      console.error(err);
      alert("Lỗi!");
    }
  };

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

  // ================= UI =================
  return (
    <div className="overflow-y-auto h-[calc(100vh-100px)] pr-4 pb-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Quản lý lương
          </h1>
          <p className="text-gray-500">
            Tổng {filtered.length} nhân viên
          </p>
        </div>

        <button
          onClick={handleCalculateAll}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          <FiPlay /> Tính tất cả
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 border rounded-lg shadow mb-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm nhân viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewMode("employee")}
          className={`px-3 py-1 rounded ${
            viewMode === "employee"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Theo nhân viên
        </button>

        <button
          onClick={() => setViewMode("time")}
          className={`px-3 py-1 rounded ${
            viewMode === "time"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Theo thời gian
        </button>
      </div>

      {/* GRID */}
      {loadingEmployees ? (
        <div className="text-center py-10">Đang tải...</div>
      ) : viewMode === "employee" ? (

        // ================= EMPLOYEE VIEW =================
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(emp => (
            <div
              key={emp.employeeId}
              className="bg-white rounded-xl shadow-sm border p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
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
                <div>Lương: {emp.payroll?.basicSalary?.toLocaleString() || "--"}</div>
                <div>Phụ cấp: {emp.payroll?.allowances?.toLocaleString() || "--"}</div>
                <div className="text-green-600 font-semibold">
                  Net: {emp.payroll?.netSalary?.toLocaleString() || "--"}
                </div>
                <div>
                  Tháng:{" "}
                  {emp.payroll
                    ? `${emp.payroll.month}/${emp.payroll.year}`
                    : "--"}
                </div>
              </div>

              <div className="flex gap-2 mt-4">

                <button
                  onClick={() => handleCreate(emp)}
                  disabled={!!emp.payroll}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm disabled:opacity-50"
                >
                  <FiPlay className="inline mr-1"/> Tính
                </button>

                <button
                  onClick={() => handleUpdate(emp)}
                  disabled={!emp.payroll}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg text-sm disabled:opacity-50"
                >
                  <FiRefreshCw className="inline mr-1"/> Sửa
                </button>

                <button
                  onClick={() => handleDelete(emp)}
                  disabled={!emp.payroll}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm disabled:opacity-50"
                >
                  <FiTrash2 className="inline mr-1"/> Xóa
                </button>

              </div>
            </div>
          ))}
        </div>

      ) : (

        // ================= TIME VIEW =================
        <div className="space-y-6">

          {/* ================= YEAR TABS ================= */}
          <div className="flex gap-2 flex-wrap">
            {Object.keys(groupedData)
              .sort((a, b) => b - a)
              .map(year => (
                <button
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setSelectedMonth(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    selectedYear === year
                      ? "bg-blue-500 text-white shadow"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {year}
                </button>
              ))}
          </div>

          {/* ================= MONTH TABS ================= */}
          {selectedYear && (
            <div className="flex gap-2 flex-wrap">
              {Object.keys(groupedData[selectedYear])
                .sort((a, b) => b - a)
                .map(month => (
                  <button
                    key={month}
                    onClick={() => setSelectedMonth(month)}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      selectedMonth === month
                        ? "bg-green-500 text-white shadow"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    Th {month}
                  </button>
                ))}
            </div>
          )}

          {/* ================= CONTENT ================= */}
          {selectedYear && selectedMonth && (
            <div>

              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Tháng {selectedMonth}/{selectedYear}
                </h2>

                <div className="text-sm text-gray-500">
                  Tổng lương:{" "}
                  <span className="font-semibold text-green-600">
                    {groupedData[selectedYear][selectedMonth]
                      .reduce((sum, p) => sum + p.netSalary, 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>

              {/* GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

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
                          <span>Lương cơ bản</span>
                          <span className="font-medium">
                            {payroll.basicSalary.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span>Phụ cấp</span>
                          <span className="font-medium">
                            {payroll.allowances.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span>Khấu trừ</span>
                          <span className="text-red-500">
                            {payroll.totalDeductions.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between text-green-600 font-semibold text-base">
                          <span>Thực nhận</span>
                          <span>
                            {payroll.netSalary.toLocaleString()}
                          </span>
                        </div>

                      </div>

                      {/* ACTION */}
                      <div className="flex gap-2 mt-4">

                        <button
                          onClick={() => handleUpdate({ payroll, ...emp })}
                          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-1"
                        >
                          <FiRefreshCw /> Sửa
                        </button>

                        <button
                          onClick={() => handleDelete({ payroll, ...emp })}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-1"
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