// /* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { FiSave, FiXCircle } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useWorkCalendarContext } from "../../../context";

const DAYS = [
  { value: "MONDAY", label: "Thứ 2" },
  { value: "TUESDAY", label: "Thứ 3" },
  { value: "WEDNESDAY", label: "Thứ 4" },
  { value: "THURSDAY", label: "Thứ 5" },
  { value: "FRIDAY", label: "Thứ 6" },
  { value: "SATURDAY", label: "Thứ 7" },
  { value: "SUNDAY", label: "Chủ nhật" }
];

const WorkCalendarCreatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { createCalendar, creating, error, setError } = useWorkCalendarContext();

  const currentYear = new Date().getFullYear();

  const [form, setForm] = useState({
    year: currentYear + 1,
    name: "",
    description: "",
    holidayPolicy: "USE_HOLIDAY_MODULE",
    workingDays: []
  });

  const [errors, setErrors] = useState({});

  // ================= LOAD YEAR =================
  useEffect(() => {
    if (location.state?.year) {
      setForm((prev) => ({
        ...prev,
        year: location.state.year
      }));
    }
  }, [location.state]);

  // ================= CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setError?.(null);
  };

  // ================= CHECKBOX =================
  const handleCheckbox = (day) => {
    setForm((prev) => {
      const exists = prev.workingDays.includes(day);

      const updated = exists
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day];

      return { ...prev, workingDays: updated };
    });

    setErrors((prev) => ({ ...prev, workingDays: "" }));
  };

  // ================= VALIDATE =================
  const validate = () => {
    const newErrors = {};

    if (!form.year) {
      newErrors.year = "Không được để trống năm";
    } else if (isNaN(form.year)) {
      newErrors.year = "Năm không hợp lệ";
    } else if (Number(form.year) < currentYear) {
      newErrors.year = "Không được nhỏ hơn năm hiện tại";
    }

    if (!form.name.trim()) {
      newErrors.name = "Không được để trống tên lịch";
    }

    if (form.workingDays.length === 0) {
      newErrors.workingDays = "Chọn ít nhất 1 ngày làm việc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        year: Number(form.year),
        name: form.name,
        description: form.description,
        holidayPolicy: form.holidayPolicy,
        workingDays: form.workingDays
      };

      await createCalendar(payload);

      alert("Tạo lịch thành công");
      navigate("/work-schedule-management");

    } catch (err) {
      console.error(err);
    }
  };

  // ================= UI =================
  return (
    <div className="overflow-y-auto h-[calc(100vh-100px)] pr-4 pb-4">
      <div className="w-full mx-auto">

        {/* HEADER */}
        <div className="mt-2 mb-3">
          <h1 className="text-2xl font-bold">
            Tạo lịch làm việc
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* INFO */}
          <div className="bg-gray-200 p-4 border border-[#162F47] rounded-2xl shadow-2xl">
            <div className="border-b border-[#162F47] mb-2">
              <h3 className="font-semibold">Thông tin chung</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Input label="Năm" name="year" type="number" value={form.year} onChange={handleChange} error={errors.year} />
                <Input label="Tên lịch" name="name" value={form.name} onChange={handleChange} error={errors.name} />
              </div>

              <div>
                <Input label="Mô tả" name="description" value={form.description} onChange={handleChange} />

                <Select
                  label="Chính sách ngày lễ"
                  name="holidayPolicy"
                  value={form.holidayPolicy}
                  onChange={handleChange}
                  options={[
                    { value: "USE_HOLIDAY_MODULE", label: "Dùng module ngày lễ" },
                    { value: "IGNORE_HOLIDAY", label: "Bỏ qua ngày lễ" }
                  ]}
                />
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500">Ngày làm việc</h3>
                <div className="grid lg:grid-cols-3 gap-1 mt-1">
                  {DAYS.map((day) => (
                    <label
                      key={day.value}
                      className={`flex items-center gap-3 px-3 py-2 border rounded-xl cursor-pointer transition
                      ${
                        form.workingDays.includes(day.value)
                          ? "bg-blue-100 border-blue-400 text-blue-700"
                          : "bg-white border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.workingDays.includes(day.value)}
                        onChange={() => handleCheckbox(day.value)}
                        className="accent-blue-600 w-4 h-4"
                      />

                      <span className="text-sm font-medium">
                        {day.label}
                      </span>
                    </label>
                  ))}
                </div>

                {errors.workingDays && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.workingDays}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* BUTTON */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border rounded-lg"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
            >
              <FiSave />
              {creating ? "Đang tạo..." : "Lưu"}
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="flex items-center gap-2 text-red-600">
              <FiXCircle />
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

// ================= INPUT =================
const Input = ({ label, error, ...props }) => (
  <div className="flex flex-col">
    <label className="text-xs font-semibold text-gray-500">{label}</label>

    <input
      {...props}
      className={`w-full px-3 py-2 border rounded-lg mt-1 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />

    <p className="text-red-500 text-xs mt-1 h-[16px]">
      {error || ""}
    </p>
  </div>
);

// ================= SELECT =================
const Select = ({ label, options = [], ...props }) => (
  <div className="flex flex-col">
    <label className="text-xs font-semibold text-gray-500">{label}</label>

    <select
      {...props}
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

export default WorkCalendarCreatePage;