/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiPhone,
  FiCalendar,
  FiMoreVertical,
  FiSearch,
  FiPlus,
  FiEdit2,
  FiEye, 
  FiLock,
  FiUnlock,
} from "react-icons/fi";

import { useEmployeeContext } from "../../../context";

const departments = ["Phòng ban", "HR", "IT", "Finance", "Marketing", "Sales"];
const statusFilters = ["Trạng thái", "Đang làm", "Thử việc", "Nghỉ phép", "Đã nghỉ"];

const EmployeesManagement = () => {
  const role = localStorage.getItem("role")?.trim().toUpperCase();
  console.log("ROLE:", localStorage.getItem("role"));
  const isAdmin = role.includes("ADMIN");
  const isHR = role.includes("HR");

  if (!isAdmin && !isHR) return <Navigate to="/" replace />;

  const navigate = useNavigate();
  const { employees, loadingEmployees, updateEmployee } = useEmployeeContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("Phòng ban");
  const [selectedStatus, setSelectedStatus] = useState("Trạng thái");
  const [activeMenu, setActiveMenu] = useState(null);

  // ================= SAFE DATA =================
  const safeEmployees = Array.isArray(employees) ? employees : [];

  // ================= FILTER =================
  const filteredEmployees = safeEmployees.filter((emp) => {
    const matchName = emp.fullName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchDept =
      selectedDepartment === "Phòng ban" ||
      emp.department === selectedDepartment;

    const statusMap = {
      "Đang làm": "WORKING",
      "Thử việc": "PROBATION",
      "Nghỉ phép": "ON_LEAVE",
      "Đã nghỉ": "RESIGNED",
    };

    const matchStatus =
      selectedStatus === "Trạng thái" ||
      emp.status === statusMap[selectedStatus];
      
    return matchName && matchDept && matchStatus;
  });

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("vi-VN") : "-";

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

  const handleToggleStatus = async (emp) => {
    try {
      let newStatus =
        emp.status === "RESIGNED" ? "WORKING" : "RESIGNED";

      const formData = new FormData();
      formData.append("status", newStatus);

      await updateEmployee(emp.employeeId, formData);
    } catch (err) {
      console.error(err);
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  // ================= UI =================
  return (
    <div className="overflow-y-auto h-[calc(100vh-100px)] pr-4 pb-4">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Quản lý nhân viên
          </h1>
          <p className="text-gray-500 mt-2">
            Tổng cộng {filteredEmployees.length} nhân viên 
            • {" "}
            {
              filteredEmployees.filter((e) => e.status === "WORKING" || e.status === "PROBATION")
                .length
            } {" "}
            đang làm việc 
            • {" "}
            {
              filteredEmployees.filter((e) => e.status === "ON_LEAVE")
                .length
            } {" "}
            nghỉ phép
          </p>
        </div>

        <button
          onClick={() => navigate("/employees/create")}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <FiPlus size={18} /> Thêm nhân viên
        </button>
      </div>

      {/* FILTER */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 border rounded-lg shadow mt-3 mb-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên..."
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

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border rounded-lg px-3"
        >
          {statusFilters.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* GRID */}
      {loadingEmployees ? (
        <div className="text-center py-10">Đang tải...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.employeeId}
              className="bg-white rounded-xl shadow-sm border p-5 relative"
            >
              {/* MENU */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() =>
                    setActiveMenu(
                      activeMenu === employee.employeeId
                        ? null
                        : employee.employeeId
                    )
                  }
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FiMoreVertical />
                </button>

                {activeMenu === employee.employeeId && (
                  <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-xl z-20">
                    {/* DETAIL PAGE */}
                    <button
                      onClick={() => {
                        navigate(`/employees/${employee.employeeId}`);
                        setActiveMenu(null);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-blue-50 text-blue-600"
                    >
                      <FiEye size={14} /> Xem chi tiết
                    </button>

                    {/* 👉 EDIT PAGE */}
                    <button
                      onClick={() =>
                        navigate(`/employees/edit/${employee.employeeId}`)
                      }
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-blue-50 text-blue-600"
                    >
                      <FiEdit2 size={14} /> Chỉnh sửa
                    </button>

                    <button
                      onClick={() => {
                        handleToggleStatus(employee);
                        setActiveMenu(null);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 ${
                        employee.status === "RESIGNED"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {employee.status === "RESIGNED" ? (
                        <>
                          <FiUnlock size={14} /> Mở khóa
                        </>
                      ) : (
                        <>
                          <FiLock size={14} /> Khóa
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* INFO */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {employee.fullName?.charAt(0)}
                </div>

                <div>
                  <h3 className="font-bold">{employee.fullName}</h3>
                  <p className="text-xs text-gray-500">
                    {employee.department} • {employee.position}
                  </p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${getStatusColor(employee.status)}`}
                  >
                    {getStatusLabel(employee.status)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 border-t pt-4">
                <div className="flex gap-2">
                  <FiMail /> {employee.email}
                </div>
                <div className="flex gap-2">
                  <FiPhone /> {employee.phone}
                </div>
                <div className="flex gap-2">
                  <FiCalendar /> {formatDate(employee.startDate)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeesManagement;