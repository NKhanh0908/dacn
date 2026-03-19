/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useEmployeeContext } from "../../../context/EmployeeContext";

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  if (role !== "ADMIN" && role !== "HR") return <Navigate to="/" replace />;

  // const isAdmin = role === "ADMIN";
  const { employees } = useEmployeeContext();
  const [employee, setEmployee] = useState(null);
  const [banks, setBanks] = useState([]);

  // LOAD DATA 
  useEffect(() => {
    const emp = employees.find((e) => e.employeeId == id);

    if (emp) {
      setEmployee({
        ...emp,
        startDate: emp.startDate?.split("T")[0] || "",
        dateOfBirth: emp.dateOfBirth?.split("T")[0] || ""
      });
    }
  }, [id, employees]);

  useEffect(() => {
    const fetchBanks = async () => {
      const res = await fetch("https://api.vietqr.io/v2/banks");
      const data = await res.json();
      setBanks(data.data);
    };
    fetchBanks();
  }, []);

  if (!employee) return <div className="p-6">Loading...</div>;

  return (
    <div className="overflow-y-auto h-[calc(100vh-100px)] pr-4 pb-4">
      <div className="w-full mx-auto">

        {/* HEADER */}
        <div className="mt-2 mb-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Chi tiết nhân viên
          </h1>

          <button
            onClick={() => navigate(`/employees/edit/${employee.employeeId}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Chỉnh sửa
          </button>
        </div>

        <form className="flex flex-col gap-6">
          {/* ================= PERSONAL ================= */}
          <div className="bg-gray-200 p-4 border-[1px] border-[#162F47] rounded-2xl shadow-2xl">
            <div className="border-b-[1px] border-[#162F47]">
              <h3 className="font-semibold">Thông tin cá nhân</h3>
            </div>

            <div className="flex gap-4 pt-2">
              <div className="flex flex-col justify-center items-center gap-6 w-1/6">
                <img
                  src={employee.avatarUrl || "https://via.placeholder.com/150"}
                  alt="Avatar"
                  className="w-32 h-32 object-cover rounded-full border"
                />
              </div>
              
              <div className="flex flex-col gap-2 w-5/6">
                <div className="flex gap-4">
                  <div className="w-1/2 space-y-2">
                    <Input disabled name="fullName" label="Họ tên" value={employee.fullName} />
                    <Input disabled type="date" name="dateOfBirth" label="Ngày sinh" value={employee.dateOfBirth} />
                    <Select
                      disabled
                      name="gender"
                      label="Giới tính"
                      value={employee.gender}
                      options={[
                        { value: "MALE", label: "Nam" },
                        { value: "FEMALE", label: "Nữ" }
                      ]}
                    />
                  </div>

                  <div className="w-1/2 space-y-2">
                    <Input disabled name="email" label="Email" value={employee.email} />
                    <Input disabled name="phone" label="SĐT" value={employee.phone} />
                    <Input disabled name="idCard" label="CMND/CCCD" value={employee.idCard || ""} />
                  </div>
                </div>

                <TextArea disabled name="address" label="Địa chỉ" value={employee.address || ""}/>                
              </div>
            </div>
          </div>

          {/* ================= WORK ================= */}
          {/* {isAdmin && ( */}
          <div className="bg-blue-100 p-4 border-[1px] border-[#162F47] rounded-2xl shadow-2xl">
            <div className="border-b-[1px] border-[#162F47]">
              <h3 className="font-semibold">Thông tin công việc</h3>
            </div>

            <div className="flex gap-4 pt-2">
              <div className="w-1/4">
                <Input disabled label="Phòng ban" value={employee.department} />
              </div>

              <div className="w-1/4">
                <Input disabled label="Chức vụ" value={employee.position} />
              </div>

              <div className="w-1/4">
                <Input disabled type="date" label="Ngày vào làm" value={employee.startDate} />
              </div>

              <div className="w-1/4">
                <Input disabled label="Trạng thái" value={employee.status} />
              </div>
            </div>
          </div>
          {/* )} */}

          {/* ================= FINANCE ================= */}
          {/* {(isAdmin || role === "HR") && ( */}
          <div className="bg-green-50 p-4 border-[1px] border-[#162F47] rounded-2xl shadow-2xl">
            <div className="border-b-[1px] border-[#162F47]">
              <h3 className="font-semibold mb-3">Thông tin tài chính</h3>
            </div>

            <div className="flex gap-4 pt-2">
              <div className="w-1/4">
                <Input disabled name="bankAccount" label="Số tài khoản" value={employee.bankAccount || ""} />
              </div>

              {/* giống UI dropdown nhưng disable */}
              <div className="w-1/4">
                <label className="text-xs font-semibold text-gray-500">
                  Ngân hàng
                </label>

                <div className="w-full px-3 py-2 border rounded-lg mt-1 flex items-center gap-2 bg-gray-100">
                  {banks.find(b => b.shortName === employee.bankName)?.logo && (
                    <img
                      src={banks.find(b => b.shortName === employee.bankName)?.logo}
                      className="w-6 h-6"
                    />
                  )}
                  <span>{employee.bankName || "-"}</span>
                </div>
              </div>

              <div className="w-1/4">
                <Input disabled name="taxCode" label="Mã số thuế" value={employee.taxCode || ""} />
              </div>

              <div className="w-1/4"> 
                <Input disabled name="socialInsuranceNumber" label="Số BHXH" value={employee.socialInsuranceNumber || ""} />
              </div>
            </div>
          </div>
          {/* )} */}

          {/* ================= EMERGENCY ================= */}
          <div className="bg-yellow-50 p-4 border-[1px] border-[#162F47] rounded-2xl shadow-2xl">
            <div className="border-b-[1px] border-[#162F47]">
              <h3 className="font-semibold mb-3">Liên hệ khẩn cấp</h3>
            </div>

            <div className="flex gap-4 pt-2">
              <div className="w-1/3">
                <Input disabled name="emergencyContactName" label="Tên liên hệ" value={employee.emergencyContactName || ""} />
              </div>

              <div className="w-1/3">
                <Input disabled name="emergencyContactPhone" label="SĐT liên hệ" value={employee.emergencyContactPhone || ""} />
              </div>

              <div className="w-1/3">
                <Input disabled name="emergencyContactRelationship" label="Mối quan hệ" value={employee.emergencyContactRelationship || ""} />
              </div>
            </div>
          </div>

          {/* ACTION */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/employees")}
              className="px-4 py-2 border rounded-lg"
            >
              Quay lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ================= COMPONENT =================
const Input = ({ label, ...props }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500">{label}</label>
    <input {...props} className="w-full px-3 py-2 border rounded-lg mt-1 bg-gray-100" />
  </div>
);

const Select = ({ label, options = [], ...props }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500">{label}</label>
    <select {...props} className="w-full px-3 py-2 border rounded-lg mt-1 bg-gray-100">
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const TextArea = ({ label, ...props }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500">{label}</label>
    <textarea {...props} className="w-full px-3 py-2 border rounded-lg mt-1 bg-gray-100" />
  </div>
);

export default EmployeeDetailPage;