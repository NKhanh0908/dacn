/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { FiArrowLeft, FiSave, FiLoader } from "react-icons/fi";
import { useContractContext, useEmployeeContext } from "../../../context";

const ContractCreatePage = () => {
  const navigate = useNavigate();
  const { handleCreate, contracts, loading } = useContractContext();
  const { employees } = useEmployeeContext();

  const safeEmployees = Array.isArray(employees) ? employees : [];
  const safeContracts = Array.isArray(contracts) ? contracts : [];

  // ================= STATE =================
  const [form, setForm] = useState({
    contractNumber: "",
    contractType: "FIXED_TERM",
    startDate: "",
    endDate: "",
    signedDate: "",
    employeeId: "",

    employerRepresentative: "",
    employerPosition: "",

    jobTitle: "",
    jobDescription: "",
    department: "",

    workingHoursPerDay: 8,
    workingDaysPerMonth: 26,
    overtimePolicy: "150% ngày thường, 200% cuối tuần",

    annualLeaveDays: 12,

    basicSalary: "",
    allowances: "",
    allowanceDetails: " Phụ cấp ăn trưa và đi lại",

    salaryPaymentMethod: "BANK_TRANSFER",
    salaryPaymentDate: 25,

    paidLeaveDeductionRate: 50,
    unpaidLeaveDeductionRate: 100,
    lateDeductionRate: 0.5,

    socialInsurance: true,
    insuranceSalary: "",

    probationPeriod: "2",
    probationSalaryPercentage: "85",

    terminationDate: "",
    terminationReason: "Thỏa thuận chung hai bên",

    noticePeriodDays: "30",

    fileUrl: "",
    draftFileUrl: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  // ================= AUTO CONTRACT NUMBER =================
  useEffect(() => {
    if (!safeContracts.length) return;

    const max = safeContracts.reduce((acc, c) => {
      const num = parseInt(c.contractNumber?.split("-").pop()) || 0;
      return num > acc ? num : acc;
    }, 0);

    const next = String(max + 1).padStart(3, "0");
    const year = new Date().getFullYear();

    setForm((prev) => ({
      ...prev,
      contractNumber: `HD-${year}-${next}`,
    }));
  }, [safeContracts]);

  // ================= AUTO FILL EMPLOYEE =================
  useEffect(() => {
    if (!form.employeeId) return;

    const emp = safeEmployees.find(
      (e) => e.employeeId === Number(form.employeeId)
    );

    if (!emp) return;

    setForm((prev) => ({
      ...prev,
      jobTitle: emp.position || "",
      department: emp.department || "",
    }));
  }, [form.employeeId, safeEmployees]);

  // ================= HANDLE =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ================= VALIDATE =================
  const validate = () => {
    const err = {};

    if (!form.contractNumber) err.contractNumber = "Bắt buộc";
    if (!form.employeeId) err.employeeId = "Chọn nhân viên";

    if (!form.startDate) err.startDate = "Bắt buộc";
    if (!form.endDate) err.endDate = "Bắt buộc";

    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      err.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    }

    if (form.signedDate && form.startDate && form.signedDate > form.startDate) {
      err.signedDate = "Ngày ký phải trước ngày bắt đầu";
    }

    if (!form.basicSalary || Number(form.basicSalary) <= 0) {
      err.basicSalary = "Lương phải > 0";
    }

    if (form.allowances && Number(form.allowances) < 0) {
      err.allowances = "Không hợp lệ";
    }

    if (form.insuranceSalary && Number(form.insuranceSalary) < 0) {
      err.insuranceSalary = "Không hợp lệ";
    }

    if (
      form.probationSalaryPercentage &&
      (form.probationSalaryPercentage < 0 ||
        form.probationSalaryPercentage > 100)
    ) {
      err.probationSalaryPercentage = "0 - 100%";
    }

    const urlRegex = /^(https?:\/\/)/;

    if (form.fileUrl && !urlRegex.test(form.fileUrl)) {
      err.fileUrl = "URL không hợp lệ";
    }

    if (form.draftFileUrl && !urlRegex.test(form.draftFileUrl)) {
      err.draftFileUrl = "URL không hợp lệ";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("FORM:", form);

    if (!validate()) {
      console.log("VALIDATE FAIL", errors);
      return;
    }

    console.log("PASS VALIDATE");

    const payload = {
      ...form,
      employeeId: Number(form.employeeId),
      basicSalary: Number(form.basicSalary),
      allowances: Number(form.allowances || 0),
      insuranceSalary: Number(form.insuranceSalary || 0),
    };

    console.log("PAYLOAD:", payload);

    const success = await handleCreate(payload);

    console.log("RESULT:", success);

    if (success) {
      alert("Tạo hợp đồng thành công 🎉");
      navigate("/contracts-management");
    }
  };

  const role = localStorage.getItem("role")?.toUpperCase();
  if (!role?.includes("ADMIN") && !role?.includes("HR")) {
    return <Navigate to="/" replace />;
  }

  const total =
    Number(form.basicSalary || 0) + Number(form.allowances || 0);

  // ================= UI =================
  return (
    <div className="overflow-y-auto h-[calc(100vh-100px)] pr-4 pb-4">
      <div className="w-full mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 border px-4 py-2 rounded-lg"
          >
            <FiArrowLeft /> Quay lại
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border rounded-2xl shadow-xl overflow-hidden">

          {/* TITLE */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6">
            <h1 className="text-2xl font-bold">Tạo hợp đồng</h1>
          </div>

          {/* BODY */}
          <div className="p-3 flex flex-col gap-3">

            {/* EMPLOYEE */}
            <div className="bg-gray-200 rounded-xl p-4 border">
              <h3 className="font-semibold text-gray-700 mb-3">Thông tin nhân viên</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Select
                  label="Nhân viên"
                  name="employeeId"
                  value={form.employeeId}
                  onChange={handleChange}
                  error={errors.employeeId}
                  options={safeEmployees.map((e) => ({
                    value: e.employeeId,
                    label: e.fullName,
                  }))}
                />

                <Input label="Phòng ban" value={form.department} readOnly />
                <Input label="Chức vụ" value={form.jobTitle} readOnly />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* THÔNG TIN HỢP ĐỒNG */}
              <div className="bg-blue-50 rounded-xl p-4 border">
                <h3 className="font-semibold text-blue-700 mb-3">Thông tin hợp đồng</h3>

                <div>
                  <Input label="Số hợp đồng" name="contractNumber" value={form.contractNumber} onChange={handleChange} error={errors.contractNumber} />
                  <Select
                    label="Loại hợp đồng"
                    name="contractType"
                    value={form.contractType}
                    onChange={handleChange}
                    options={[
                      { value: "PROBATION", label: "Thử việc" },
                      { value: "FIXED_TERM", label: "Ngắn hạn" },
                      { value: "INDEFINITE_TERM", label: "Dài hạn" }
                    ]}
                  />
                  <Input label="Ngày bắt đầu" type="date" name="startDate" value={form.startDate} onChange={handleChange} error={errors.startDate} />
                  <Input label="Ngày kết thúc" type="date" name="endDate" value={form.endDate} onChange={handleChange} error={errors.endDate} />
                  <Input label="Ngày ký" type="date" name="signedDate" value={form.signedDate} onChange={handleChange} error={errors.signedDate} />
                  <Input label="Người đại diện" name="employerRepresentative" value={form.employerRepresentative} onChange={handleChange} error={errors.employerRepresentative} />
                  <Input label="Chức vụ đại diện" name="employerPosition" value={form.employerPosition} onChange={handleChange} error={errors.employerPosition} />

                </div>
              </div>

              {/* THỜI GIAN LÀM VIỆC */}
              <div className="bg-yellow-50 rounded-xl p-4 border">
                <h3 className="font-semibold text-yellow-700 mb-3">Thời gian làm việc</h3>

                <div>
                  <Input label="Giờ làm việc/ ngày"  name="workingHoursPerDay" value={form.workingHoursPerDay} onChange={handleChange} error={errors.workingHoursPerDay} />
                  <Input label="Ngày làm việc/ tháng" name="workingDaysPerMonth" value={form.workingDaysPerMonth} onChange={handleChange} error={errors.workingDaysPerMonth} />
                  <Input label="Chính sách OT" name="overtimePolicy" value={form.overtimePolicy} onChange={handleChange} error={errors.overtimePolicy} />
                  <Input label="Ngày nghỉ phép năm" name="annualLeaveDays" value={form.annualLeaveDays} onChange={handleChange} error={errors.annualLeaveDays} />
                </div>
              </div>

              {/* LƯƠNG */}
              <div className="bg-green-50 rounded-xl p-4 border">
                <h3 className="font-semibold text-green-700 mb-3">Lương & phụ cấp</h3>

                <div>
                  <Input label="Lương cơ bản" name="basicSalary" value={form.basicSalary} onChange={handleChange} error={errors.basicSalary} />
                  <Input label="Phụ cấp" name="allowances" value={form.allowances} onChange={handleChange} error={errors.allowances} />
                  <Input label="Tổng lương" value={total} readOnly />
                  <Input label="Chi tiết phụ cấp" name="allowanceDetails" value={form.allowanceDetails} onChange={handleChange} error={errors.allowanceDetails} />
                  <Select
                    label="Phương thức thanh toán lương"
                    name="salaryPaymentMethod"
                    value={form.salaryPaymentMethod}
                    onChange={handleChange}
                    options={[
                      { value: "BANK_TRANSFER", label: "Chuyển khoản" },
                      { value: "CASH", label: "Tiền mặt" }
                    ]}
                  />
                  <Input label="Ngày trả lương" name="salaryPaymentDate" value={form.salaryPaymentDate} onChange={handleChange} error={errors.salaryPaymentDate} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* THỬ VIỆC */}
              <div className="bg-yellow-50 rounded-xl p-4 border">
                <h3 className="font-semibold text-yellow-700 mb-3">Thử việc</h3>

                <div>
                  <Input label="Thời gian thử việc (tháng)" name="probationPeriod" value={form.probationPeriod} onChange={handleChange} error={errors.probationPeriod} />
                  <Input label="% lương thử việc" name="probationSalaryPercentage" value={form.probationSalaryPercentage} onChange={handleChange} error={errors.probationSalaryPercentage} />
                  <Input label="Ngày kết thúc" type="date" name="terminationDate" value={form.terminationDate} onChange={handleChange} error={errors.terminationDate} />
                  <Input label="Số ngày thông báo" name="noticePeriodDays" value={form.noticePeriodDays} onChange={handleChange} error={errors.noticePeriodDays} />
                  <Input label="Lý do chấm dứt" name="terminationReason" value={form.terminationReason} onChange={handleChange} error={errors.terminationReason} />
                </div>
              </div>

              {/* BẢO HIỂM */}
              <div className="bg-purple-50 rounded-xl p-4 border">
                <h3 className="font-semibold text-purple-700 mb-3">Bảo hiểm</h3>
                
                <div>
                  <Select
                    label="Bảo hiểm xã hội"
                    name="socialInsurance"
                    value={form.socialInsurance}
                    onChange={(e) => setForm({ ...form, socialInsurance: e.target.value === "true" })}
                    options={[
                      { value: "true", label: "Có" },
                      { value: "false", label: "Không" }
                    ]}
                  />

                  <Input label="Lương đóng BH" name="insuranceSalary" value={form.insuranceSalary} onChange={handleChange} error={errors.insuranceSalary} />
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border">
                <Input label="File URL" name="fileUrl" value={form.fileUrl} onChange={handleChange} error={errors.fileUrl} />
                <Input label="Draft URL" name="draftFileUrl" value={form.draftFileUrl} onChange={handleChange} error={errors.draftFileUrl} />
              </div>
            </div>    

            {/* MÔ TẢ */}
            <div className="col-span-1 md:col-span-2 bg-gray-200 rounded-xl p-4 border">
              <TextArea label="Mô tả công việc" name="jobDescription" value={form.jobDescription} onChange={handleChange} error={errors.jobDescription} />
            </div>
          </div>

          {/* FOOTER */}
          <div className="p-4 flex justify-end bg-gray-100">
            <button type="submit" disabled={loading} className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2 rounded-lg">
              {loading ? <FiLoader className="animate-spin" /> : <FiSave />}
              Tạo
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

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

const Input = ({ label, value, type, name, onChange, error }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-lg mt-1 bg-gray-100 ${
        error ? "border-red-500" : ""
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const TextArea = ({ label, value, name, onChange, error }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500">{label}</label>

    <textarea
      name={name} 
      value={value || ""}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-lg mt-1 bg-gray-100 ${
        error ? "border-red-500" : ""
      }`}
    />

    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);


export default ContractCreatePage;