import { useState } from "react";
import { FiPlus, FiClock, FiCalendar, FiXCircle } from "react-icons/fi";
import { useOvertimeRequestContext } from "../../context";

const OvertimeRequestPage = () => {
  const { submitOvertimeRequest, loading, error, setError } = useOvertimeRequestContext();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    reason: ""
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors(prev => ({ ...prev, [name]: "" }));
    setError(null); 
  };

  const validate = () => {
    const newErrors = {};

    const today = new Date();
    const selectedDate = form.date ? new Date(form.date) : null;

    if (!form.date) {
      newErrors.date = "Không được để trống ngày";
    } else if (selectedDate < today.setHours(0, 0, 0, 0)) {
      newErrors.date = "Ngày tăng ca phải là hôm nay hoặc ngày tương lai";
    }

    if (!form.startTime) { 
      newErrors.startTime = "Không được để trống giờ bắt đầu";
    }
    
    if (!form.endTime) {
      newErrors.endTime = "Không được để trống giờ kết thúc";
    }

    if (!form.reason || form.reason.trim() === "") {
      newErrors.reason = "Không được để trống lý do";
    }

    if (form.startTime && form.endTime && form.endTime <= form.startTime) {
      newErrors.endTime = "Giờ kết thúc phải lớn hơn giờ bắt đầu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setError(null);
      const payload = {
        overtimeDate: form.date,
        startTime: `${form.startTime}:00`,
        endTime: `${form.endTime}:00`,
        reason: form.reason
      };
      await submitOvertimeRequest(payload);

      setForm({ date: "", startTime: "", endTime: "", reason: "" });
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Gửi yêu cầu thất bại");
    }
  };

  return (
    <div className="border rounded-xl p-4 bg-gray-50 h-full">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#162F47] pb-2">
        <div className="flex items-center gap-2">
          <FiClock size={22} className="text-[#162F47]" />
          <span className="font-semibold">Yêu cầu tăng ca</span>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiPlus />
          Tạo yêu cầu
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-200 border-2 border-[#162F47] rounded-2xl mt-2 p-4 flex flex-col gap-4">
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <Input label="Ngày" type="date" name="date" value={form.date} onChange={handleChange} error={errors.date} />
              <Input label="Giờ bắt đầu" type="time" name="startTime" value={form.startTime} onChange={handleChange} error={errors.startTime} />
              <Input label="Giờ kết thúc" type="time" name="endTime" value={form.endTime} onChange={handleChange} error={errors.endTime} />
            </div>
            <div>
              <TextArea label="Lý do" name="reason" value={form.reason} onChange={handleChange} error={errors.reason} />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-4 gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Hủy</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </div>

          {/* Global error */}
          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-600 font-medium">
              <FiXCircle />
              {error}
            </div>
          )}
        </form>
      )}

      {/* Empty state */}
      {!showForm && (
        <div className="text-center text-gray-400 py-8 flex flex-col items-center gap-2">
          <FiCalendar size={40} />
          <p>Nhấn "Tạo yêu cầu" để gửi yêu cầu tăng ca</p>
        </div>
      )}
    </div>
  );
};

// ================= COMPONENTS =================
const Input = ({ label, error, ...props }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500">{label}</label>
    <input
      {...props}
      className={`w-full px-3 py-2 border rounded-lg mt-1 outline-none ${error ? "border-red-500 focus:ring-2 focus:ring-red-300" : "border-gray-300"}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const TextArea = ({ label, error, className = "", ...props }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500">{label}</label>
    <textarea
      {...props}
      className={`w-full px-3 py-2 h-[50px] border rounded-lg mt-1 outline-none ${error ? "border-red-500 focus:ring-2 focus:ring-red-300" : "border-gray-300"} ${className}`}
      rows={3}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default OvertimeRequestPage;