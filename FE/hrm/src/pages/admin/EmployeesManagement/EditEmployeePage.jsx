/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useEmployeeContext } from "../../../context/EmployeeContext";

const EditEmployeePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  if (role !== "ADMIN" && role !== "HR") return <Navigate to="/" replace />;

  const isAdmin = role === "ADMIN";
  
  const { employees, updateEmployee } = useEmployeeContext();
  const [employee, setEmployee] = useState(null);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState("");
  const [banks, setBanks] = useState([]);
  const [openBank, setOpenBank] = useState(false);
  const [errors, setErrors] = useState({});
  const [originalEmployee, setOriginalEmployee] = useState(null);

  // ================= LOAD DATA =================
  useEffect(() => {
    const emp = employees.find((e) => e.employeeId == id);

    if (emp) {
      const formatted = {
        ...emp,
        startDate: emp.startDate?.split("T")[0] || "",
        dateOfBirth: emp.dateOfBirth?.split("T")[0] || "",
        department: emp.department || "",
        position: emp.position || "",
        status: emp.status || "",
        gender: emp.gender || "MALE"
      };

      setPreviewAvatar(emp.avatarUrl || "");

      setEmployee(formatted);
      setOriginalEmployee(formatted);
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

  // ================= HANDLERS =================
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

    const baseOptions = positionMap[employee.department] || [];

    // 👉 nếu position từ DB chưa có trong list thì thêm vào
    const exists = baseOptions.some(
      (opt) => opt.value === employee.position
    );

    if (!exists && employee.position) {
      return [
        { value: "", label: "Chọn chức vụ" },
        ...baseOptions,
        {
          value: employee.position,
          label: employee.position 
        }
      ];
    }

    return [{ value: "", label: "Chọn chức vụ" }, ...baseOptions];
  })();

  const validate = () => {
    const newErrors = {};

    const phoneRegex = /^(0[0-9]{9}|\+84[0-9]{9})$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
    const idCardRegex = /^[0-9]{9}$|^[0-9]{12}$/;
    
    const isChanged = (field) => {
      return employee[field] !== originalEmployee[field];
    };

    // ===== FORMAT =====
    if (isChanged("phone") &&  employee.phone && !phoneRegex.test(employee.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (isChanged("emergencyContactPhone") && employee.emergencyContactPhone && !phoneRegex.test(employee.emergencyContactPhone)) {
      newErrors.emergencyContactPhone = "SĐT liên hệ không hợp lệ";
    }

    if (isChanged("email") && employee.email && !emailRegex.test(employee.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (isChanged("idCard") && employee.idCard && !idCardRegex.test(employee.idCard)) {
      newErrors.idCard = "CMND/CCCD phải 9 hoặc 12 số";
    }

    if (isChanged("bankAccount") && employee.bankAccount && !/^[0-9]{9,20}$/.test(employee.bankAccount)) {
      newErrors.bankAccount = "Tài khoản ngân hàng không hợp lệ";
    }

    // ===== AGE >= 18 =====
    if (employee.dateOfBirth) {
      const dob = new Date(employee.dateOfBirth);
      const today = new Date();

      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      if (age < 18) {
        newErrors.dateOfBirth = "Nhân viên phải đủ 18 tuổi";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      alert("Vui lòng kiểm tra lại thông tin");
      return;
    }

    setSaving(true);

    try {
      let imageUrl = employee.avatarUrl || "";

      // ===== Upload ảnh nếu có =====
      if (avatarFile) {
        const formUpload = new FormData();
        formUpload.append("file", avatarFile);
        formUpload.append("upload_preset", "YOUR_PRESET");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
          {
            method: "POST",
            body: formUpload
          }
        );

        const data = await res.json();
        imageUrl = data.secure_url;
      }

      // ===== Tạo payload giống EditProfile =====
      const formData = new FormData();

      // ===== Field cho phép sửa =====
      formData.append("fullName", employee.fullName || "");
      formData.append("dateOfBirth", employee.dateOfBirth || "");
      formData.append("gender", employee.gender || "");
      formData.append("idCard", employee.idCard || "");
      formData.append("phone", employee.phone || "");
      formData.append("email", employee.email || "");
      formData.append("address", employee.address || "");
      formData.append("bankAccount", employee.bankAccount || "");
      formData.append("bankName", employee.bankName || "");
      formData.append("taxCode", employee.taxCode || "");
      formData.append("socialInsuranceNumber", employee.socialInsuranceNumber || "");
      formData.append("emergencyContactName", employee.emergencyContactName || "");
      formData.append("emergencyContactPhone", employee.emergencyContactPhone || "");
      formData.append("emergencyContactRelationship", employee.emergencyContactRelationship || "");

      // ===== Field admin =====
      if (isAdmin) {
        formData.append("department", employee.department || "");
        formData.append("position", employee.position || "");
        formData.append("roleId", employee.roleId || "");
        formData.append("startDate", employee.startDate || "");
        formData.append("status", employee.status || "");
      }

      // ===== Avatar (QUAN TRỌNG) =====
      formData.append("avatarUrl", imageUrl || "");

      // ===== Debug =====
      console.log("FORM DATA:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      await updateEmployee(employee.employeeId, formData);

      navigate("/employees");
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại!");
    } finally {
      setSaving(false);
    }
  };
  if (!employee) return <div className="p-6">Loading...</div>;

  return (
    <div className="overflow-y-auto h-[calc(100vh-100px)] pr-4 pb-4">
      <div className="w-full mx-auto">

        {/* ================= HEADER ================= */}
        <div className="mt-2 mb-3">
          <h1 className="text-2xl font-bold">
            Chỉnh sửa nhân viên
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* ================= PERSONAL ================= */}
          <div className="bg-gray-200 p-4 border-[1px] border-[#162F47] rounded-2xl shadow-2xl">
            <div className="border-b-[1px] border-[#162F47]">
              <h3 className="font-semibold">Thông tin cá nhân</h3>
            </div>

            <div className="flex gap-4 pt-2">
              <div className="flex flex-col justify-center items-center gap-6 w-1/6">
                <img src={previewAvatar || "https://via.placeholder.com/150"} alt="Avatar" className="w-32 h-32 object-cover rounded-full border"/>
                <input type="file" accept="image/*" onChange={handleAvatarChange} id="avatarUpload" className="hidden" />
                <label htmlFor="avatarUpload" className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                  Chọn ảnh đại diện
                </label>
              </div>
              
              <div className="flex flex-col gap-2 w-5/6">
                <div className="flex gap-4">
                  <div className="w-1/2 space-y-2">
                    <Input name="fullName" label="Họ tên" value={employee.fullName} onChange={handleChange} error={errors.fullName} />
                    <Input type="date" name="dateOfBirth" label="Ngày sinh" value={employee.dateOfBirth} onChange={handleChange} error={errors.dateOfBirth} />
                    <Select
                      name="gender"
                      label="Giới tính"
                      value={employee.gender || "MALE"}
                      onChange={handleChange}
                      options={[
                        { value: "MALE", label: "Nam" },
                        { value: "FEMALE", label: "Nữ" }
                      ]}
                    />
                  </div>

                  <div className="w-1/2 space-y-2">
                    <Input name="email" label="Email" value={employee.email} onChange={handleChange} error={errors.email} />
                    <Input name="phone" label="SĐT" value={employee.phone} onChange={handleChange} error={errors.phone} />
                    <Input name="idCard" label="CMND/CCCD" value={employee.idCard || ""} onChange={handleChange} error={errors.idCard} />
                  </div>
                </div>

                <TextArea name="address" label="Địa chỉ" value={employee.address || ""} onChange={handleChange} error={errors.address} />
              </div>
            </div>
          </div>

          {/* ================= WORK (ADMIN ONLY) ================= */}
          {isAdmin && (
            <div className="bg-blue-100 p-4 border-[1px] border-[#162F47] rounded-2xl shadow-2xl">
              <div className="border-b-[1px] border-[#162F47]">
                <h3 className="font-semibold">Thông tin công việc</h3>
              </div>

              <div className="flex gap-4 pt-2">
                <div className="w-1/4">
                  <Select
                    name="department"
                    label="Phòng ban"
                    value={employee?.department || ""}
                    onChange={(e) => {
                      handleChange({
                        target: { name: "department", value: e.target.value }
                      });

                      handleChange({
                        target: { name: "position", value: "" }
                      });
                    }}
                    options={departmentOptions}
                  />
                </div>

                <div className="w-1/4">
                  <Select
                    name="position"
                    label="Chức vụ"
                    value={employee?.position || ""}
                    onChange={handleChange}
                    options={positionOptions}
                    disabled={!employee?.department}
                  />
                </div>

                <div className="w-1/4">
                  <Input type="date" name="startDate" label="Ngày vào làm" value={employee.startDate} onChange={handleChange} error={errors.startDate} />
                </div>

                <div className="w-1/4">
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

          {/* ================= FINANCE (ADMIN ONLY) ================= */}
          {(isAdmin || role === "HR") && (
            <div className="bg-green-50 p-4 border-[1px] border-[#162F47] rounded-2xl shadow-2xl">
              <div className="border-b-[1px] border-[#162F47]">
                <h3 className="font-semibold mb-3">Thông tin tài chính</h3>
              </div>

              <div className="flex gap-4 pt-2">
                <div className="w-1/4">
                  <Input name="bankAccount" label="Số tài khoản" value={employee.bankAccount || ""} onChange={handleChange} error={errors.bankAccount} />
                </div>

                <div className="w-1/4 relative">
                  <label className="text-xs font-semibold text-gray-500">
                    Ngân hàng
                  </label>

                  <div
                    onClick={() => setOpenBank(!openBank)}
                    className="w-full px-3 py-2 border rounded-lg mt-1 cursor-pointer flex items-center justify-between bg-white"
                  >
                    <div className="flex items-center gap-2">
                      {banks.find(b => b.shortName === employee.bankName)?.logo ? (
                        <img
                          src={banks.find(b => b.shortName === employee.bankName)?.logo}
                          alt="bank"
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gray-200 rounded" />
                      )}

                      <span>
                        {employee.bankName || "Chọn ngân hàng"}
                      </span>
                    </div>
                  </div>

                  {openBank && (
                    <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white border rounded shadow">
                      {banks.map((bank) => (
                        <div
                          key={bank.id}
                          onClick={() => {
                            setEmployee((prev) => ({
                              ...prev,
                              bankName: bank.shortName
                            }));
                            setOpenBank(false);
                          }}
                          className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <img
                            src={bank.logo}
                            alt={bank.shortName}
                            className="w-6 h-6 object-contain"
                          />
                          <span>{bank.shortName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-1/4">
                  <Input name="taxCode" label="Mã số thuế" value={employee.taxCode || ""} onChange={handleChange} error={errors.taxCode} />
                </div>

                <div className="w-1/4"> 
                  <Input name="socialInsuranceNumber" label="Số BHXH" value={employee.socialInsuranceNumber || ""} onChange={handleChange} error={errors.socialInsuranceNumber} />
                </div>
              </div>
            </div>
          )}

          {/* ================= EMERGENCY ================= */}
          <div className="bg-yellow-50 p-4 border-[1px] border-[#162F47] rounded-2xl shadow-2xl">
            <div className="border-b-[1px] border-[#162F47]">
              <h3 className="font-semibold mb-3">Liên hệ khẩn cấp</h3>
            </div>

            <div className="flex gap-4 pt-2">
              <div className="w-1/3">
                <Input name="emergencyContactName" label="Tên liên hệ" value={employee.emergencyContactName || ""} onChange={handleChange} error={errors.emergencyContactName} />
              </div>

              <div className="w-1/3">
                <Input name="emergencyContactPhone" label="SĐT liên hệ" value={employee.emergencyContactPhone || ""} onChange={handleChange} error={errors.emergencyContactPhone} />
              </div>

              <div className="w-1/3">
                <Input name="emergencyContactRelationship" label="Mối quan hệ" value={employee.emergencyContactRelationship || ""} onChange={handleChange} error={errors.emergencyContactRelationship} />
              </div>
            </div>
          </div>

          {/* ================= ACTION ================= */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/employees")}
              className="px-4 py-2 border rounded-lg"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {saving ? "Đang lưu..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ================= COMPONENT =================
const Input = ({ label, error, ...props }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500">{label}</label>

    <input
      {...props}
      className={`w-full px-3 py-2 border rounded-lg mt-1 outline-none ${
        error ? "border-red-500 focus:ring-2 focus:ring-red-300" : "border-gray-300"
      }`}
    />

    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const Select = ({ label, options = [], value, ...props }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500">{label}</label>
    <select
      {...props}
      value={value || ""} 
      className="w-full px-3 py-2 border rounded-lg mt-1"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const TextArea = ({ label, error, className = "", ...props }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500">{label}</label>

    <textarea
      {...props}
      className={`w-full px-3 py-2 border rounded-lg mt-1 outline-none ${
        error ? "border-red-500 focus:ring-2 focus:ring-red-300" : "border-gray-300"
      } ${className}`}
      rows={3}
    />

    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default EditEmployeePage;