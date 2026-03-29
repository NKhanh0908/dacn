// eslint-disable react-hooks/rules-of-hooks 
import { useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiClock, FiLoader } from "react-icons/fi";
import { useAttendanceContext } from "../../../context";

const AttendanceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { attendanceDetail, fetchAttendanceById, loading } = useAttendanceContext();

  useEffect(() => {
    if (id) fetchAttendanceById(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const role = localStorage.getItem("role")?.toUpperCase();
  if (!role?.includes("ADMIN") && !role?.includes("HR")) {
    return <Navigate to="/" replace />;
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "PRESENT": return "Có mặt";
      case "ABSENT": return "Vắng";
      case "LATE": return "Đi trễ";
      case "EARLY_LEAVE": return "Về sớm";
      case "ON_TIME": return "Đúng giờ";
      case "WEEKEND": return "Cuối tuần";
      default: return status || "--";
    }
  };

  const getMethodLabel = (method) => {
    switch (method) {
      case "BIOMETRIC":
      return "Sinh trắc học";
      case "BUTTON":
      return "Chấm công máy";
      case "CARD":
      return "Thẻ";
      case "MANUAL":
      return "Nhập tay";
      default:
      return method || "--";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center gap-2 py-10">
        <FiLoader className="animate-spin" />
        Đang tải dữ liệu...
      </div>
    );
  }

  if (!attendanceDetail) {
    return <div className="text-center py-10">Không có dữ liệu</div>;
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
        </div>

        {/* CARD */}
        <div className="bg-white border border-gray-300 rounded-2xl shadow-xl overflow-hidden">

          {/* TITLE */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-6">
            <h1 className="text-2xl font-bold">Chi tiết chấm công</h1>
            <p className="text-sm opacity-90">
              Ngày {attendanceDetail.attendanceDate}
            </p>
          </div>

          {/* EMPLOYEE */}
          <div className="p-6 border-b grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><b>Họ tên:</b> {attendanceDetail.employeeName}</p>
              <p><b>Mã NV:</b> {attendanceDetail.employeeId}</p>
            </div>
            <div>
              <p><b>Trạng thái:</b> {getStatusLabel(attendanceDetail.status)}</p>
              <p><b>Duyệt yêu cầu chấm công:</b> {attendanceDetail.isApproved ? "Có duyệt" : "Không duyệt"}</p>
            </div>
          </div>

          {/* BODY */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* CHECK-IN/OUT */}
            <div className="bg-blue-50 rounded-xl p-4 border">
              <h3 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                <FiClock /> Chấm công
              </h3>

              <div className="space-y-2 text-sm">
                <Row label="Check-in" value={attendanceDetail.checkInTime} />
                <Row label="Check-out" value={attendanceDetail.checkOutTime} />
                <Row label="Phương thức vào" value={getMethodLabel(attendanceDetail.checkInMethod)} />
                <Row label="Phương thức ra" value={getMethodLabel(attendanceDetail.checkOutMethod)} />
              </div>
            </div>

            {/* TIME INFO */}
            <div className="bg-yellow-50 rounded-xl p-4 border">
              <h3 className="font-semibold text-yellow-700 mb-3">
                Thời gian làm việc
              </h3>

              <div className="space-y-2 text-sm">
                <Row label="Đi trễ" value={`${attendanceDetail.lateMinutes} phút`} />
                <Row label="Về sớm" value={`${attendanceDetail.earlyLeaveMinutes} phút`} />
                <Row label="Tăng ca" value={`${attendanceDetail.overtimeMinutes} phút`} />

                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Tổng giờ</span>
                  <span>{attendanceDetail.workHours} giờ</span>
                </div>
              </div>
            </div>
          </div>

          {/* APPROVAL */}
          <div className="bg-purple-50 p-6 border-t">
            <h3 className="font-semibold text-purple-700 mb-3">Thông tin duyệt yêu cầu chấm công</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p><b>Người duyệt:</b> {attendanceDetail.approvedByName || "--"}</p>
              </div>
              <div>
                <p><b>Thời gian duyệt:</b> {attendanceDetail.approvedAt || "--"}</p>
              </div>
              <div>
                <p><b>Nhập tay:</b> {attendanceDetail.isManualEntry ? "Có" : "Không"}</p>
              </div>
            </div>
          </div>

          {/* NOTE */}
          <div className="p-6 border-t">
            <h3 className="font-semibold mb-2">Ghi chú</h3>
            <p className="text-gray-600">
              {attendanceDetail.note || "Không có ghi chú"} 
            </p>
          </div>

          {/* FOOTER */}
          <div className="bg-gray-100 p-4 text-right text-xs text-gray-500">
            Tạo lúc: {attendanceDetail.createdAt}
          </div>
        </div>
      </div>
    </div>
  );
};

// ROW
const Row = ({ label, value }) => (
  <div className="flex justify-between">
    <span>{label}</span>
    <span>{value || "--"}</span>
  </div>
);

export default AttendanceDetailPage;