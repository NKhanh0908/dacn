/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useContractContext } from "../../../context";

const formatMoney = (value) => {
  if (!value && value !== 0) return "--";
  return Number(value).toLocaleString("vi-VN") + " đ";
};

const ContractEditPage = () => {
  const role = localStorage.getItem("role");
  if (role !== "ADMIN" && role !== "HR") return <Navigate to="/" replace />;

  const { id } = useParams();
  const navigate = useNavigate();
  const { getDetail, handleUpdate } = useContractContext();

  const [form, setForm] = useState({});

  useEffect(() => {
    const fetch = async () => {
      const data = await getDetail(id);
      if (!data) return;

      setForm(data);
    };
    fetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const success = await handleUpdate(id, form);
    if (success) navigate("/contracts-management");
  };

  return (
    <div className="overflow-y-auto h-[calc(100vh-100px)] pr-4 pb-4">
      <div className="w-full mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 border px-4 py-2 rounded-lg hover:bg-blue-50"
          >
            <FiArrowLeft /> Quay lại
          </button>

          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            <FiSave /> Lưu
          </button>
        </div>

        {/* CARD */}
        <div className="bg-white border rounded-2xl shadow-xl overflow-hidden">

          {/* TITLE */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6">
            <h1 className="text-2xl font-bold">Chỉnh sửa hợp đồng</h1>
            <p className="text-sm opacity-90">{form.contractNumber}</p>
          </div>

          {/* EMPLOYEE */}
          <div className="p-6 border-b grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p><b>Nhân viên:</b> {form.employeeName}</p>
            <p><b>Phòng ban:</b> {form.department || ""}</p>
            <p><b>Chức vụ:</b> {form.jobTitle || ""}</p>

            <div className="flex items-center gap-1">
              <p><b>Trạng thái:</b></p>
              <select
                name="status"
                value={form.status || ""}
                onChange={handleChange}
                className="w-max border rounded-lg px-3 py-2"
              >
                <option value="DRAFT">Nháp</option>
                <option value="ACTIVE">Đang hiệu lực</option>
                <option value="TERMINATED">Đã chấm dứt</option>
              </select>
            </div>
          </div>

          {/* BODY */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* THÔNG TIN HỢP ĐỒNG */}
            <Section title="Thông tin hợp đồng" color="blue">

              {/* CONTRACT TYPE */}
              <div>
                <label className="text-xs font-semibold text-gray-500">Loại hợp đồng</label>
                <select
                  name="contractType"
                  value={form.contractType || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                >
                  <option value="PROBATION">Thử việc</option>
                  <option value="FIXED_TERM">Ngắn hạn</option>
                  <option value="INDEFINITE_TERM">Dài hạn</option>
                </select>
              </div>

              <Input type="date" name="Ngày bắt đầu" value={form.startDate} onChange={handleChange} />
              <Input type="date" name="Ngày kết thúc" value={form.endDate} onChange={handleChange} />
              <Input type="date" name="Ngày ký" value={form.signedDate} onChange={handleChange} />
            </Section>
    
            {/* LƯƠNG */}
            <Section title="Lương & phụ cấp" color="green">
              <Input name="Lương cơ bản" value={formatMoney(form.basicSalary)} onChange={handleChange} />
              <Input name="Phụ cấp" value={formatMoney(form.allowances)} onChange={handleChange} />
              <Input name="Tổng thu nhập" value={formatMoney(form.totalCompensation)} onChange={handleChange} />
              <Input name="Chi tiết phụ cấp" value={form.allowanceDetails} onChange={handleChange} />
            </Section>

            {/* THỜI GIAN */}
            <Section title="Thời gian làm việc" color="yellow">
              <Input name="Giờ/ngày" value={form.workingHoursPerDay} onChange={handleChange} />
              <Input name="Ngày/tháng" value={form.workingDaysPerMonth} onChange={handleChange} />
              <Input name="OT policy" value={form.overtimePolicy} onChange={handleChange} />
              <Input name="Nghỉ phép" value={form.annualLeaveDays} onChange={handleChange} />
            </Section>

            {/* BẢO HIỂM */}
            <Section title="Bảo hiểm" color="purple">
              <div>
                <label className="text-xs font-semibold text-gray-500">BHXH</label>
                <select
                  name="BHXH"
                  value={form.socialInsurance || false}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      socialInsurance: e.target.value === "true",
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                >
                  <option value="true">Có</option>
                  <option value="false">Không</option>
                </select>
              </div>

              <Input name="Lương đóng BH" value={formatMoney(form.insuranceSalary)} onChange={handleChange} />
            </Section>

            {/* THỬ VIỆC */}
            <div className="bg-gray-50 rounded-xl p-4 border col-span-1 md:col-span-2">
              <h3 className="font-semibold text-gray-700 mb-3">Thử việc</h3>

              <div className="grid grid-cols-3 gap-3">
                <Input name="Thời gian (tháng)" value={form.probationPeriod} onChange={handleChange} />
                <Input name="% lương" value={form.probationSalaryPercentage} onChange={handleChange} />
                <Input type="date" name="Ngày kết thúc" value={form.probationEndDate} onChange={handleChange} />
              </div>
            </div>

            {/* MÔ TẢ */}
            <div className="col-span-1 md:col-span-2">
              <TextArea label="Mô tả công việc" name="jobDescription" value={form.jobDescription || ""} onChange={handleChange} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= COMPONENTS ================= */
const Section = ({ title, children, color, colSpan }) => {
  const map = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    gray: "bg-gray-50 border-gray-200 text-gray-700",
  };

  return (
    <div className={`rounded-xl p-4 border ${map[color]} ${colSpan ? "col-span-1 md:col-span-2" : ""}`}>
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="grid gap-3">{children}</div>
    </div>
  );
};

const Input = ({ name, value, onChange, type = "text" }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500">{name}</label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
    />
  </div>
);

const TextArea = ({ label, ...props }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500">{label}</label>
    <textarea {...props} className="w-full px-3 py-2 border rounded-lg mt-1 bg-gray-100" />
  </div>
);

export default ContractEditPage;