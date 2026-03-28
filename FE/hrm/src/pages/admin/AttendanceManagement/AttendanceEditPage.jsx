// eslint-disable react-hooks/rules-of-hooks
import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { FiArrowLeft, FiSave, FiLoader } from "react-icons/fi";
import { useAttendanceContext } from "../../../context";

const AttendanceEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { 
    attendanceDetail, 
    fetchAttendanceById, 
    editAttendance, 
    loading 
  } = useAttendanceContext();

  // ===== STATE =====
  const [form, setForm] = useState({
    checkInTime: "",
    checkOutTime: "",
    status: "PRESENT",
    note: "",
    isApproved: false
  });

  // ===== FETCH =====
  useEffect(() => {
    if (id) fetchAttendanceById(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ===== MAP DATA -> FORM =====
  useEffect(() => {
    if (!attendanceDetail) return;

    setForm({
      checkInTime: attendanceDetail.checkInTime || "",
      checkOutTime: attendanceDetail.checkOutTime || "",
      status: attendanceDetail.status || "PRESENT",
      note: attendanceDetail.note || "",
      isApproved: attendanceDetail.isApproved || false
    });
  }, [attendanceDetail]);

  const role = localStorage.getItem("role")?.toUpperCase();
  if (!role?.includes("ADMIN") && !role?.includes("HR")) {
    return <Navigate to="/" replace />;
  }

  // ===== HANDLE =====
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const formatTime = (time) => {
    if (!time) return null;

    return time.slice(0, 5);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      checkInTime: formatTime(form.checkInTime),
      checkOutTime: formatTime(form.checkOutTime),
      status: form.status,
      note: form.note,
      isApproved: form.isApproved
    };

    await editAttendance(id, payload);
    navigate(-1);
  };

  if (loading || !attendanceDetail) {
    return (
      <div className="flex justify-center items-center gap-2 py-10">
        <FiLoader className="animate-spin" />
        Đang tải dữ liệu...
      </div>
    );
  }

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
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            <FiSave /> Lưu
          </button>
        </div>

        {/* CARD */}
        <div className="bg-white border border-gray-300 rounded-2xl shadow-xl overflow-hidden">

          {/* TITLE */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6">
            <h1 className="text-2xl font-bold">Chỉnh sửa chấm công</h1>
            <p className="text-sm opacity-90">
              Ngày {attendanceDetail.attendanceDate}
            </p>
          </div>

          {/* BODY */}
          <form className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* TIME */}
            <div className="bg-blue-50 rounded-xl p-4 border">
              <h3 className="font-semibold text-blue-700 mb-3">
                Thời gian
              </h3>

              <div className="space-y-3 text-sm">
                <Input
                  label="Check-in"
                  type="time"
                  name="checkInTime"
                  value={form.checkInTime}
                  onChange={handleChange}
                />

                <Input
                  label="Check-out"
                  type="time"
                  name="checkOutTime"
                  value={form.checkOutTime}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* STATUS */}
            <div className="bg-green-50 rounded-xl p-4 border">
              <h3 className="font-semibold text-green-700 mb-3">
                Trạng thái
              </h3>

              <div className="space-y-3 text-sm">
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
                  <option value="LEAVE">Nghỉ phép</option>
                  <option value="HOLIDAY">Ngày lễ</option>
                  <option value="WEEKEND">Cuối tuần</option>
                  <option value="REMOTE_WORK">Làm từ xa</option>
                  <option value="BUSINESS_TRIP">Công tác</option>
                </select>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isApproved"
                    checked={form.isApproved}
                    onChange={handleChange}
                  />
                  Đã duyệt
                </label>
              </div>
            </div>

            {/* NOTE */}
            <div className="md:col-span-2 bg-gray-50 rounded-xl p-4 border">
              <h3 className="font-semibold mb-2">Ghi chú</h3>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                rows={3}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ===== INPUT COMPONENT =====
const Input = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="text-xs text-gray-500 mb-1">{label}</label>
    <input {...props} className="border rounded-lg px-3 py-2" />
  </div>
);

export default AttendanceEditPage;