import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { FiArrowLeft, FiSave, FiLoader } from "react-icons/fi";
import { useAttendanceContext, useEmployeeContext } from "../../../context";

const AttendanceCreatePage = () => {
  const navigate = useNavigate();
  const { addManualAttendance, loading, attendances } = useAttendanceContext();
  const { employees } = useEmployeeContext();

  const safeEmployees = Array.isArray(employees) ? employees : [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const safeAttendances = Array.isArray(attendances) ? attendances : [];

  // ================= STATE =================
  const [form, setForm] = useState({
    employeeId: "",
    attendanceDate: "",
    checkInTime: "",
    checkOutTime: "",
    status: "PRESENT",
    note: "",
    isApproved: false,
  });

  const [errors, setErrors] = useState({});
  const [isDuplicate, setIsDuplicate] = useState(false);

  // ================= CHECK TRÙNG (REALTIME) =================
  useEffect(() => {
    if (!form.employeeId || !form.attendanceDate) {
      setIsDuplicate(false);
      return;
    }

    const exist = safeAttendances.some(
      (a) =>
        a.employeeId === Number(form.employeeId) &&
        a.attendanceDate === form.attendanceDate
    );

    setIsDuplicate(exist);

    if (exist) {
      setErrors((prev) => ({
        ...prev,
        attendanceDate: "Nhân viên đã có chấm công ngày này",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        attendanceDate: "",
      }));
    }
  }, [form.employeeId, form.attendanceDate, safeAttendances]);

  // ================= FORMAT TIME =================
  const formatTime = (time) => {
    if (!time) return null;
    return time; // "08:00"
  };

  // ================= HANDLE =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // clear lỗi field
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ================= VALIDATE =================
  const validate = () => {
    const newErrors = {};

    if (!form.employeeId) {
      newErrors.employeeId = "Vui lòng chọn nhân viên";
    }

    if (!form.attendanceDate) {
      newErrors.attendanceDate = "Vui lòng chọn ngày";
    } else {
      const today = new Date().toISOString().split("T")[0];
      if (form.attendanceDate > today) {
        newErrors.attendanceDate = "Không được chọn ngày tương lai";
      }
    }

    if (!form.checkInTime) {
      newErrors.checkInTime = "Vui lòng nhập giờ vào";
    }

    if (!form.checkOutTime) {
      newErrors.checkOutTime = "Vui lòng nhập giờ ra";
    }

    if (form.checkInTime && form.checkOutTime) {
      if (form.checkInTime >= form.checkOutTime) {
        newErrors.checkOutTime = "Giờ ra phải lớn hơn giờ vào";
      }
    }

    if (isDuplicate) {
      newErrors.attendanceDate = "Nhân viên đã có chấm công ngày này";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const res = await addManualAttendance({
      employeeId: Number(form.employeeId),
      attendanceDate: form.attendanceDate,
      checkInTime: formatTime(form.checkInTime),
      checkOutTime: formatTime(form.checkOutTime),
      status: form.status,
      note: form.note,
      isApproved: form.isApproved,
    });

    if (res.success) {
      alert("Thêm chấm công thành công!");
      navigate("/attendance-management");
    } else {
      if (res.message.includes("Attendance already exists")) {
        alert("Nhân viên đã có chấm công ngày này!");
      } else {
        alert("Lỗi: " + res.message);
      }
    }
  };

  // ================= ROLE =================
  const role = localStorage.getItem("role")?.toUpperCase();
  if (!role?.includes("ADMIN") && !role?.includes("HR")) {
    return <Navigate to="/" replace />;
  }

  // ================= UI =================
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
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-300 rounded-2xl shadow-xl overflow-hidden"
        >

          {/* TITLE */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6">
            <h1 className="text-2xl font-bold">Thêm chấm công</h1>
            <p className="text-sm opacity-90">
              Nhập thông tin chấm công thủ công
            </p>
          </div>

          {/* BODY */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* LEFT */}
            <div className="space-y-4">

              {/* EMPLOYEE */}
              <div>
                <label className="text-sm font-medium">Nhân viên *</label>
                <select
                  name="employeeId"
                  value={form.employeeId}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">-- Chọn nhân viên --</option>
                  {safeEmployees.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.fullName}
                    </option>
                  ))}
                </select>
                {errors.employeeId && (
                  <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>
                )}
              </div>

              {/* DATE */}
              <div>
                <label className="text-sm font-medium">Ngày *</label>
                <input
                  type="date"
                  name="attendanceDate"
                  value={form.attendanceDate}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                  className={`w-full border rounded-lg px-3 py-2 ${
                    isDuplicate ? "border-red-500" : ""
                  }`}
                />
                {errors.attendanceDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.attendanceDate}
                  </p>
                )}
              </div>

              {/* STATUS */}
              <div>
                <label className="text-sm font-medium">Trạng thái</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="PRESENT">Có mặt</option>
                  <option value="ABSENT">Vắng</option>
                  <option value="LATE">Đi trễ</option>
                  <option value="EARLY_LEAVE">Về sớm</option>
                  <option value="ON_TIME">Đúng giờ</option>
                </select>
              </div>

            </div>

            {/* RIGHT */}
            <div className="space-y-4">

              {/* CHECK IN */}
              <div>
                <label className="text-sm font-medium">Giờ vào *</label>
                <input
                  type="time"
                  name="checkInTime"
                  value={form.checkInTime}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
                {errors.checkInTime && (
                  <p className="text-red-500 text-xs mt-1">{errors.checkInTime}</p>
                )}
              </div>

              {/* CHECK OUT */}
              <div>
                <label className="text-sm font-medium">Giờ ra *</label>
                <input
                  type="time"
                  name="checkOutTime"
                  value={form.checkOutTime}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
                {errors.checkOutTime && (
                  <p className="text-red-500 text-xs mt-1">{errors.checkOutTime}</p>
                )}
              </div>

              {/* APPROVE */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isApproved"
                  checked={form.isApproved}
                  onChange={handleChange}
                />
                <label>Duyệt chấm công</label>
              </div>

            </div>
          </div>

          {/* NOTE */}
          <div className="px-6 pb-6">
            <label className="text-sm font-medium">Ghi chú</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* FOOTER */}
          <div className="bg-gray-100 p-4 flex justify-end">
            <button
              type="submit"
              disabled={loading || isDuplicate}
              className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <FiLoader className="animate-spin" /> : <FiSave />}
              Lưu
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AttendanceCreatePage;