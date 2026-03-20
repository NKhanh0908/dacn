/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useEmployeeContext, useAccount } from "../../../context";

const CreateNewEmployeePage = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  if (role !== "ADMIN" && role !== "HR") return <Navigate to="/" replace />;

  const isAdmin = role === "ADMIN";
  const { createEmployee } = useEmployeeContext();
  const { handleCreateAccount } = useAccount();

  const [employee, setEmployee] = useState({
    fullName: "",
    email: "",
    phone: "",
    idCard: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    department: "",
    position: "",
    status: "WORKING",
    startDate: "",
    bankAccount: "",
    bankName: "",
    taxCode: "",
    roleId: "1",
    socialInsuranceNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    role: "EMPLOYEE"
  });

  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState("");
  const [banks, setBanks] = useState([]);
  const [openBank, setOpenBank] = useState(false);

  const roleOptions = isAdmin
    ? [
        { value: "EMPLOYEE", label: "EMPLOYEE" },
        { value: "HR", label: "HR" },
        { value: "ADMIN", label: "Admin" }
      ]
    : [{ value: "EMPLOYEE", label: "EMPLOYEE" }];

  // LOAD BANK
  useEffect(() => {
    const fetchBanks = async () => {
      const res = await fetch("https://api.vietqr.io/v2/banks");
      const data = await res.json();
      setBanks(data.data);
    };
    fetchBanks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setPreviewAvatar(URL.createObjectURL(file));
  };

  const TextArea = ({ label, className = "", ...props }) => (
    <div>
      <label className="text-xs font-semibold text-gray-500">{label}</label>
      <textarea
        {...props}
        className={`w-full px-3 py-2 border rounded-lg mt-1 ${className}`}
        rows={3}
      />
    </div>
  );

  const departmentOptions = [
    { value: "", label: "Chọn phòng ban" },
    { value: "HR", label: "HR" },
    { value: "IT", label: "IT" },
    { value: "Finance", label: "Finance" },
    { value: "Marketing", label: "Marketing" },
    { value: "Sales", label: "Sales" }
  ];

  const positionMap = {
    HR: [
      { value: "HR_MANAGER", label: "Trưởng phòng HR" },
      { value: "HR_STAFF", label: "Nhân viên HR" }
    ],
    IT: [
      { value: "DEV", label: "Developer" },
      { value: "TESTER", label: "Tester" },
      { value: "IT_SUPPORT", label: "IT Support" }
    ],
    Finance: [
      { value: "ACCOUNTANT", label: "Kế toán" },
      { value: "FINANCE_MANAGER", label: "Trưởng phòng tài chính" }
    ],
    Marketing: [
      { value: "CONTENT", label: "Content" },
      { value: "ADS", label: "Chạy quảng cáo" }
    ],
    Sales: [
      { value: "SALES_STAFF", label: "Nhân viên kinh doanh" },
      { value: "SALES_MANAGER", label: "Trưởng phòng kinh doanh" }
    ]
  };

  const positionOptions = (() => {
    if (!employee?.department) {
      return [{ value: "", label: "Chọn phòng ban trước" }];
    }
    return [
      { value: "", label: "Chọn chức vụ" },
      ...(positionMap[employee.department] || [])
    ];
  })();

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Tạo formData cho nhân viên
      const formData = new FormData();
      Object.keys(employee).forEach((key) => formData.append(key, employee[key] || ""));
      if (avatarFile) formData.append("image", avatarFile);

      // 1️⃣ Tạo nhân viên
      const res = await createEmployee(formData);
      const newEmployee = res.data;
      if (!newEmployee?.employeeId) throw new Error("Không lấy được employeeId");

      // 2️⃣ Tạo account tự động
      const accountData = {
        username: newEmployee.phone,
        password: newEmployee.dateOfBirth, // hoặc format YYYYMMDD nếu muốn
        employeeId: newEmployee.employeeId,
        role: employee.role,
      };
      await handleCreateAccount(accountData);

      alert(`Tạo nhân viên và tài khoản thành công!\nID nhân viên: ${newEmployee.employeeId}`);
      navigate("/employees");
    } catch (err) {
      console.error(err);
      alert("Tạo nhân viên hoặc tài khoản thất bại!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overflow-y-auto h-[calc(100vh-100px)] pr-4 pb-4">
      <div className="w-full mx-auto">
        <div className="mt-2 mb-3">
          <h1 className="text-2xl font-bold">Thêm nhân viên</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* PERSONAL */}
          <div className="bg-gray-200 p-4 border-[1px] border-[#162F47] rounded-2xl shadow-2xl">
            <div className="border-b-[1px] border-[#162F47]">
              <h3 className="font-semibold">Thông tin cá nhân</h3>
            </div>

            <div className="flex gap-4 pt-2">
              <div className="flex flex-col justify-center items-center gap-6 w-1/6">
                <img
                  src={previewAvatar || "https://via.placeholder.com/150"}
                  className="w-32 h-32 rounded-full object-cover border-[1px] border-[#162F47]"
                />
                <input type="file" id="avatarUpload" hidden onChange={handleAvatarChange} />
                <label
                  htmlFor="avatarUpload"
                  className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Chọn ảnh đại diện
                </label>
              </div>

              <div className="flex flex-col gap-2 w-5/6">
                <div className="flex gap-4">
                  <div className="w-1/2 space-y-2">
                    <Input name="fullName" label="Họ tên" value={employee.fullName} onChange={handleChange} />
                    <Input type="date" name="dateOfBirth" label="Ngày sinh" value={employee.dateOfBirth} onChange={handleChange} />
                    <Select
                      name="gender"
                      label="Giới tính"
                      value={employee.gender}
                      onChange={handleChange}
                      options={[
                        { value: "MALE", label: "Nam" },
                        { value: "FEMALE", label: "Nữ" }
                      ]}
                    />
                  </div>

                  <div className="w-1/2 space-y-2">
                    <Input name="email" label="Email" value={employee.email} onChange={handleChange} />
                    <Input name="phone" label="SĐT" value={employee.phone} onChange={handleChange} />
                    <Input name="idCard" label="CMND/CCCD" value={employee.idCard || ""} onChange={handleChange} />
                  </div>
                </div>

                <TextArea name="address" label="Địa chỉ" value={employee.address || ""} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* WORK */}
          {(isAdmin || role === "HR") && (
            <div className="bg-blue-100 p-4 border-[1px] border-[#162F47] rounded-2xl shadow-2xl">
              <div className="border-b-[1px] border-[#162F47]">
                <h3 className="font-semibold">Thông tin công việc</h3>
              </div>

              <div className="flex gap-4 pt-2">
                <div className="w-1/5">
                  <Select name="department" label="Phòng ban" value={employee.department} onChange={handleChange} options={departmentOptions} />
                </div>

                <div className="w-1/5">
                  <Select name="position" label="Chức vụ" value={employee.position} onChange={handleChange} options={positionOptions} />
                </div>

                <div className="w-1/5">
                  <Input type="date" name="startDate" label="Ngày vào làm" value={employee.startDate} onChange={handleChange} />
                </div>

                <div className="w-1/5">
                  <Select name="role" label="Quyền tài khoản" value={employee.role} onChange={handleChange} options={roleOptions} />
                </div>

                <div className="w-1/5">
                  <Select
                    name="status"
                    label="Trạng thái"
                    value={employee.status}
                    onChange={handleChange}
                    options={[
                      { value: "WORKING", label: "Đang làm" },
                      { value: "PROBATION", label: "Thử việc" },
                      { value: "ON_LEAVE", label: "Nghỉ phép" },
                      { value: "RESIGNED", label: "Đã nghỉ" }
                    ]}
                  />
                </div>
              </div>
            </div>
          )}

          {/* FINANCE */}
          <div className="bg-green-50 p-4 border-[1px] border-[#162F47] rounded-2xl shadow-2xl">
            <div className="border-b-[1px] border-[#162F47]">
              <h3 className="font-semibold mb-3">Thông tin tài chính</h3>
            </div>

            <div className="flex gap-4 pt-2">
              <div className="w-1/4">
                <Input name="bankAccount" label="Số tài khoản" value={employee.bankAccount || ""} onChange={handleChange} />
              </div>

              <div className="w-1/4 relative">
                <label className="text-xs font-semibold text-gray-500">Ngân hàng</label>
                <div
                  onClick={() => setOpenBank(!openBank)}
                  className="w-full px-3 py-2 border rounded-lg mt-1 cursor-pointer flex items-center justify-between bg-white"
                >
                  <span>{employee.bankName || "Chọn ngân hàng"}</span>
                </div>
                {openBank && (
                  <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white border rounded shadow">
                    {banks.map((bank) => (
                      <div
                        key={bank.id}
                        onClick={() => {
                          setEmployee((prev) => ({ ...prev, bankName: bank.shortName }));
                          setOpenBank(false);
                        }}
                        className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <img src={bank.logo} className="w-6 h-6" />
                        <span>{bank.shortName}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-1/4">
                <Input name="taxCode" label="Mã số thuế" value={employee.taxCode || ""} onChange={handleChange} />
              </div>

              <div className="w-1/4">
                <Input name="socialInsuranceNumber" label="Số BHXH" value={employee.socialInsuranceNumber || ""} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* EMERGENCY */}
          <div className="bg-yellow-50 p-4 border-[1px] border-[#162F47] rounded-2xl shadow-2xl">
            <div className="border-b-[1px] border-[#162F47]">
              <h3 className="font-semibold mb-3">Liên hệ khẩn cấp</h3>
            </div>

            <div className="flex gap-4 pt-2">
              <div className="w-1/3">
                <Input name="emergencyContactName" label="Tên liên hệ" value={employee.emergencyContactName || ""} onChange={handleChange} />
              </div>

              <div className="w-1/3">
                <Input name="emergencyContactPhone" label="SĐT liên hệ" value={employee.emergencyContactPhone || ""} onChange={handleChange} />
              </div>

              <div className="w-1/3">
                <Input name="emergencyContactRelationship" label="Mối quan hệ" value={employee.emergencyContactRelationship || ""} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* ACTION */}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate("/employees")} className="px-4 py-2 border rounded-lg">
              Hủy
            </button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              {saving ? "Đang tạo..." : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// COMPONENT
const Input = ({ label, ...props }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500">{label}</label>
    <input {...props} className="w-full px-3 py-2 border rounded-lg mt-1" />
  </div>
);

const Select = ({ label, options = [], ...props }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500">{label}</label>
    <select {...props} className="w-full px-3 py-2 border rounded-lg mt-1">
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default CreateNewEmployeePage;