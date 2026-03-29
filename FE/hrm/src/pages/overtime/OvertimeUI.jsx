import { useState, useEffect, useMemo } from "react";
import {
  FiPlus,
  FiClock,
  FiCalendar,
  FiXCircle,
} from "react-icons/fi";
import { useOvertimeRequestContext } from "../../context";

const OvertimeRequestPage = () => {
  const {
    submitOvertimeRequest,
    fetchMyOvertimes,
    myOvertimes,
    loading,
    error,
    setError,
  } = useOvertimeRequestContext();

  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    reason: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchMyOvertimes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= HANDLE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setError(null);
  };

  const validate = () => {
    const newErrors = {};

    const today = new Date();
    const selectedDate = form.date ? new Date(form.date) : null;

    if (!form.date) {
      newErrors.date = "Không được để trống ngày";
    } else if (selectedDate < today.setHours(0, 0, 0, 0)) {
      newErrors.date = "Ngày phải >= hôm nay";
    }

    if (!form.startTime) newErrors.startTime = "Không được để trống";
    if (!form.endTime) newErrors.endTime = "Không được để trống";

    if (!form.reason?.trim()) {
      newErrors.reason = "Không được để trống";
    }

    if (form.startTime && form.endTime && form.endTime <= form.startTime) {
      newErrors.endTime = "Phải lớn hơn giờ bắt đầu";
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
        reason: form.reason,
      };

      await submitOvertimeRequest(payload);

      // reload list
      await fetchMyOvertimes();

      setForm({ date: "", startTime: "", endTime: "", reason: "" });
      setShowForm(false);
    } catch (err) {
      setError(err?.message || "Gửi thất bại");
    }
  };

  /* ================= FILTER ================= */

  const filteredData = useMemo(() => {
    if (statusFilter === "ALL") return myOvertimes;
    return myOvertimes.filter((item) => item.status === statusFilter);
  }, [myOvertimes, statusFilter]);

  /* ================= UI ================= */

  const getStatusBadge = (status) => {
    const map = {
      PENDING: "bg-yellow-100 text-yellow-700",
      APPROVED: "bg-green-100 text-green-700",
      REJECTED: "bg-red-100 text-red-700",
    };

    const label = {
      PENDING: "Chờ duyệt",
      APPROVED: "Đã duyệt",
      REJECTED: "Bị từ chối",
    };

    return (
      <span className={`px-2 py-1 rounded text-xs ${map[status]}`}>
        {label[status]}
      </span>
    );
  };

  return (
    <div className="border rounded-xl p-4 bg-gray-50 h-full space-y-4">
      {/* HEADER */}
      <div className="flex items-center border-b pb-2">
        <div className="flex items-center gap-2">
          <FiClock />
          <span className="font-semibold">Yêu cầu tăng ca</span>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex justify-between items-center gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="ALL">Tất cả</option>
          <option value="PENDING">Chờ duyệt</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="REJECTED">Bị từ chối</option>
        </select>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          <FiPlus /> Tạo yêu cầu
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-200 border rounded-xl p-4 flex flex-col gap-4"
        >
          <div className="grid grid-cols-3 gap-4">
            <Input label="Ngày" type="date" name="date" value={form.date} onChange={handleChange} error={errors.date} />
            <Input label="Bắt đầu" type="time" name="startTime" value={form.startTime} onChange={handleChange} error={errors.startTime} />
            <Input label="Kết thúc" type="time" name="endTime" value={form.endTime} onChange={handleChange} error={errors.endTime} />
          </div>

          <TextArea label="Lý do" name="reason" value={form.reason} onChange={handleChange} error={errors.reason} />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded">
              Hủy
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? "Đang gửi..." : "Gửi"}
            </button>
          </div>

          {error && (
            <div className="text-red-600 flex items-center gap-2">
              <FiXCircle /> {error}
            </div>
          )}
        </form>
      )}

      {/* LIST */}
      {!showForm && (
        <div className="bg-white rounded-xl border overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-400">Đang tải...</div>
          ) : filteredData.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-600 text-sm">
                  <th className="p-3 text-center">Ngày</th>
                  <th className="p-3 text-center">Giờ</th>
                  <th className="p-3 text-center">Lý do</th>
                  <th className="p-3 text-center">Trạng thái</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-blue-200 transition">
                    <td className="p-3 text-center">{item.overtimeDate || item.date}</td>
                    <td className="p-3 text-center">
                      {item.startTime} - {item.endTime}
                    </td>
                    <td className="p-3 text-center w-1/4">{item.reason}</td>
                    <td className="p-3 text-center">{getStatusBadge(item.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center py-8 text-gray-400">
              <FiCalendar size={40} />
              <p>Chưa có yêu cầu nào</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ================= COMPONENTS ================= */
const Input = ({ label, error, ...props }) => (
  <div>
    <label className="text-xs font-semibold">{label}</label>
    <input {...props} className="w-full border p-2 rounded mt-1" />
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

const TextArea = ({ label, error, ...props }) => (
  <div>
    <label className="text-xs font-semibold">{label}</label>
    <textarea {...props} className="w-full border p-2 rounded mt-1" />
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

export default OvertimeRequestPage;