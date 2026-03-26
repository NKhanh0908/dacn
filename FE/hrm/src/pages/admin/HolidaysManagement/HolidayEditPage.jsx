import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiXCircle } from "react-icons/fi";
import { useHolidayContext } from "../../../context";

const TYPE_OPTIONS = [
  { value: "NATIONAL_HOLIDAY", label: "Ngày lễ quốc gia" },
  { value: "COMPANY_HOLIDAY", label: "Ngày nghỉ công ty" }
];

const PAID_OPTIONS = [
  { value: "true", label: "Có lương" },
  { value: "false", label: "Không lương" }
];

const HolidayEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    getHolidayDetail,
    editHoliday,
    loading
  } = useHolidayContext();

  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    type: "NATIONAL_HOLIDAY",
    isPaid: true,
    salaryMultiplier: 1,
    description: ""
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  /* ================= LOAD ================= */
  useEffect(() => {
    const load = async () => {
      const data = await getHolidayDetail(id);

      if (data) {
        setForm({
          name: data.name || "",
          startDate: data.startDate || "",
          endDate: data.endDate || "",
          type: data.type || "NATIONAL_HOLIDAY",
          isPaid: data.isPaid ?? true,
          salaryMultiplier: data.salaryMultiplier || 1,
          description: data.description || ""
        });
      }
    };

    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "isPaid") {
      newValue = value === "true";

      setForm((prev) => ({
        ...prev,
        isPaid: newValue,
        salaryMultiplier: newValue ? prev.salaryMultiplier : 0
      }));

      return;
    }

    setForm({ ...form, [name]: newValue });
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  /* ================= VALIDATE ================= */
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Không được để trống tên ngày nghỉ";
    }

    if (!form.startDate) {
      newErrors.startDate = "Chọn ngày bắt đầu";
    }

    if (!form.endDate) {
      newErrors.endDate = "Chọn ngày kết thúc";
    }

    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      newErrors.endDate = "Ngày kết thúc phải >= ngày bắt đầu";
    }

    if (form.isPaid && form.salaryMultiplier <= 0) {
      newErrors.salaryMultiplier = "Hệ số phải > 0 khi có lương";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        name: form.name,
        startDate: form.startDate,
        endDate: form.endDate,
        type: form.type,
        isPaid: form.isPaid,
        salaryMultiplier: form.isPaid ? Number(form.salaryMultiplier) : 0,
        description: form.description
      };

      await editHoliday(id, payload);

      navigate("/work-schedule-management");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Cập nhật thất bại";
      setServerError(message);
    }
  };

  /* ================= CHECK PAST ================= */
  const isPast = form.startDate && form.startDate < new Date().toISOString().split("T")[0];

  /* ================= UI ================= */
  return (
    <div className="overflow-y-auto h-[calc(100vh-100px)] pr-4 pb-4">
      <div className="w-full mx-auto">

        {/* HEADER */}
        <div className="mt-2 mb-3">
          <h1 className="text-2xl font-bold">
            Chỉnh sửa ngày nghỉ
          </h1>
        </div>

        {isPast && (
          <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-lg">
            Không thể chỉnh sửa ngày nghỉ đã qua
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* INFO */}
          <div className="bg-gray-200 p-4 border rounded-2xl shadow-2xl">
            <h3 className="font-semibold mb-2">Thông tin chung</h3>

            <Input
              label="Tên ngày nghỉ"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              disabled={isPast}
            />
          </div>

          {/* DATE */}
          <div className="bg-blue-100 p-4 border rounded-2xl shadow-2xl">
            <h3 className="font-semibold mb-2">Thời gian</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Ngày bắt đầu"
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                error={errors.startDate}
                disabled={isPast}
              />

              <Input
                label="Ngày kết thúc"
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                error={errors.endDate}
                disabled={isPast}
              />
            </div>
          </div>

          {/* TYPE */}
          <div className="bg-green-50 p-4 border rounded-2xl shadow-2xl">
            <h3 className="font-semibold mb-2">Loại & lương</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Loại ngày nghỉ"
                name="type"
                value={form.type}
                onChange={handleChange}
                options={TYPE_OPTIONS}
                disabled={isPast}
              />

              <Select
                label="Trả lương"
                name="isPaid"
                value={String(form.isPaid)}
                onChange={handleChange}
                options={PAID_OPTIONS}
                disabled={isPast}
              />

              <Input
                label="Hệ số lương"
                type="number"
                name="salaryMultiplier"
                value={form.salaryMultiplier}
                onChange={handleChange}
                error={errors.salaryMultiplier}
                disabled={isPast || !form.isPaid}
              />
            </div>
          </div>

          {/* DESC */}
          <div className="bg-yellow-50 p-4 border rounded-2xl shadow-2xl">
            <h3 className="font-semibold mb-2">Mô tả</h3>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={isPast}
              className="w-full border rounded-lg p-3"
              rows={4}
            />
          </div>

          {/* BUTTON */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border rounded-lg"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={loading || isPast}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>

          {/* ERROR */}
          {serverError && (
            <div className="flex items-center gap-2 text-red-600">
              <FiXCircle />
              {serverError}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

/* ================= COMPONENT ================= */
const Input = ({ label, error, ...props }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500">
      {label}
    </label>
    <input
      {...props}
      className={`w-full px-3 py-2 border rounded-lg mt-1 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

const Select = ({ label, options = [], value, ...props }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500">
      {label}
    </label>
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

export default HolidayEditPage;