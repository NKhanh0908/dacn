import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiXCircle } from "react-icons/fi";
import { useWorkScheduleContext } from "../../../context";

const STATUS_OPTIONS = [
  { value: "true", label: "Đang hoạt động" },
  { value: "false", label: "Ngưng hoạt động" }
];

const DEFAULT_OPTIONS = [
  { value: "true", label: "Mặc định" },
  { value: "false", label: "Không" }
];

const WorkScheduleEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    fetchScheduleById,
    editWorkSchedule,
    loading,
    error,
    setError
  } = useWorkScheduleContext();

  const [form, setForm] = useState({
    scheduleName: "",
    startTime: "",
    endTime: "",
    breakStartTime: "",
    breakEndTime: "",
    lateToleranceMinutes: 0,
    earlyLeaveToleranceMinutes: 0,
    isActive: true,
    isDefault: true
  });

  const [errors, setErrors] = useState({});

  // ================= LOAD DATA =================
  useEffect(() => {
    const load = async () => {
      const data = await fetchScheduleById(id);

      if (data) {
        setForm({
          scheduleName: data.scheduleName || "",
          startTime: data.startTime?.slice(0, 5) || "",
          endTime: data.endTime?.slice(0, 5) || "",
          breakStartTime: data.breakStartTime?.slice(0, 5) || "",
          breakEndTime: data.breakEndTime?.slice(0, 5) || "",
          lateToleranceMinutes: data.lateToleranceMinutes || 0,
          earlyLeaveToleranceMinutes: data.earlyLeaveToleranceMinutes || 0,
          isActive: data.isActive ?? true,
          isDefault: data.isDefault ?? true
        });
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ================= CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "isActive" || name === "isDefault") {
      newValue = value === "true";
    }

    setForm({ ...form, [name]: newValue });
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setError?.(null);
  };

  // ================= VALIDATE =================
  const validate = () => {
    const newErrors = {};

    if (!form.scheduleName.trim()) {
      newErrors.scheduleName = "Không được để trống tên ca";
    }

    if (form.lateToleranceMinutes < 0) {
      newErrors.lateToleranceMinutes = "Ngưỡng trễ không được nhỏ hơn 0";
    }

    if (form.earlyLeaveToleranceMinutes < 0) {
      newErrors.earlyLeaveToleranceMinutes = "Ngưỡng về sớm không được nhỏ hơn 0";
    }

    if (!form.startTime) newErrors.startTime = "Chọn giờ bắt đầu";
    if (!form.endTime) newErrors.endTime = "Chọn giờ kết thúc";

    if (form.endTime && form.startTime && form.endTime <= form.startTime) {
      newErrors.endTime = "Giờ kết thúc phải lớn hơn giờ bắt đầu";
    }

    if (form.breakStartTime && form.breakEndTime) {
      if (form.breakEndTime <= form.breakStartTime) {
        newErrors.breakEndTime = "Giờ nghỉ phải hợp lệ";
      }

      if (
        form.breakStartTime < form.startTime ||
        form.breakEndTime > form.endTime
      ) {
        newErrors.breakStartTime = "Giờ nghỉ phải nằm trong ca làm";
      }
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
        scheduleName: form.scheduleName,
        startTime: form.startTime,
        endTime: form.endTime,
        breakStartTime: form.breakStartTime || null,
        breakEndTime: form.breakEndTime || null,
        lateToleranceMinutes: Number(form.lateToleranceMinutes),
        earlyLeaveToleranceMinutes: Number(form.earlyLeaveToleranceMinutes),
        isActive: form.isActive,
        isDefault: form.isDefault
      };

      await editWorkSchedule(id, payload);
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
            Chỉnh sửa thông tin ca làm việc
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          {/* INFO */}
          <div className="bg-gray-200 p-4 border-[1px] border-[#162F47] rounded-2xl shadow-2xl">
            <div className="border-b-[1px] border-[#162F47]">
              <h3 className="font-semibold mb-2">Thông tin chung</h3>
            </div>

            <Input label="Tên ca" name="scheduleName" value={form.scheduleName} onChange={handleChange} error={errors.scheduleName}/>
          </div>

          {/* TIME */}
          <div className="bg-blue-100 p-4 border-[1px] border-[#162F47] rounded-2xl shadow-2xl">
            <div className="border-b-[1px] border-[#162F47]">
              <h3 className="font-semibold mb-2">Thời gian làm việc</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Giờ bắt đầu" type="time" name="startTime" value={form.startTime} onChange={handleChange} error={errors.startTime}/>
              <Input label="Giờ kết thúc" type="time" name="endTime" value={form.endTime} onChange={handleChange} error={errors.endTime}/>
              <Input label="Bắt đầu nghỉ" type="time" name="breakStartTime" value={form.breakStartTime} onChange={handleChange} error={errors.breakStartTime}/>
              <Input label="Kết thúc nghỉ" type="time" name="breakEndTime" value={form.breakEndTime} onChange={handleChange} error={errors.breakEndTime}/>
              <Input label="Ngưỡng trễ (phút)" type="number" name="lateToleranceMinutes" value={form.lateToleranceMinutes} onChange={handleChange} error={errors.lateToleranceMinutes}/>
              <Input label="Ngưỡng về sớm (phút)" type="number" name="earlyLeaveToleranceMinutes" value={form.earlyLeaveToleranceMinutes} onChange={handleChange} error={errors.earlyLeaveToleranceMinutes}/>
            </div>
          </div>

          {/* STATUS */}
          <div className="bg-green-50 p-4 border-[1px] border-[#162F47] rounded-2xl shadow-2xl">
            <div className="border-b-[1px] border-[#162F47]">
              <h3 className="font-semibold mb-2">Trạng thái</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <Select
                label="Kích hoạt"
                name="isActive"
                value={String(form.isActive)}
                onChange={handleChange}
                options={STATUS_OPTIONS}
              />

              <Select
                label="Ca mặc định"
                name="isDefault"
                value={String(form.isDefault)}
                onChange={handleChange}
                options={DEFAULT_OPTIONS}
              />
            </div>
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
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
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

// ================= COMPONENTS =================
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

export default WorkScheduleEditPage;