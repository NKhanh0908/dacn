import { useEffect, useState } from "react";
import { useEmployeeContext, useAttendanceContext, useWorkScheduleContext } from "../../context";
import { FiCalendar, FiClock, FiCheckCircle, FiAlertTriangle, FiPlusCircle } from "react-icons/fi";

const AttendancePage = () => {
  const {
    todayAttendance,
    monthlyAttendances,
    loading,
    handleCheckIn,
    handleCheckOut,
    statistics,
    fetchMonthlyAttendance,
  } = useAttendanceContext();
  const { defaultSchedule } = useWorkScheduleContext();
  const { employee } = useEmployeeContext();
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [time, setTime] = useState(""); 
  const today = new Date();
  const attendanceMap = {};

  monthlyAttendances?.forEach((item) => {
    attendanceMap[item.attendanceDate] = item;
  });

  const totalWorkHours = statistics?.totalWorkHours || 0;
  const overtimeHours = statistics?.totalOvertimeHours || 0;
  const lateDays = statistics?.lateDays || 0;

  const onTimeDays = (statistics?.presentDays || 0) - (statistics?.lateDays || 0);

  const formatHours = (hours) => {
    if (!hours) return "0h";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }
    return days;
  };

  const days = generateCalendar();

  const formatDate = (date) => {
    if (!date) return "-----";

    const days = [
      "Chủ nhật",
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
    ];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${dayName}, ngày ${day} tháng ${month} năm ${year}`;
  };

  useEffect(() => {
    if (!employee?.employeeId) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    fetchMonthlyAttendance(employee.employeeId, year, month);

  }, [currentDate, employee?.employeeId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");

      setTime(`${h}:${m}:${s}`);

    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-y-auto h-[calc(100vh-100px)] pr-4 pb-4">
      <div className="w-full mx-auto">

        {/* ================= HEADER ================= */}
        <div className="mt-2 mb-3">
          <h1 className="text-2xl font-bold">
            Chấm công hôm nay!!!
          </h1>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="pb-4">
          <div className="flex gap-6">
            <div className="border-2 border-[#162F47] rounded-2xl p-3 shadow-2xl w-1/2 flex flex-col items-center justify-center gap-6">
              <h2 className="text-lg font-semibold">
                {formatDate(today)}
              </h2>

              <p className="text-8xl font-bold text-[#162F47]">
                {time}
              </p>

              <div className="flex gap-4 w-full pl-20 pr-20 justify-center">
                <p className="border rounded-2xl p-3 shadow-2xl w-1/2 flex flex-col items-center">
                  <span className="text-gray-400">Giờ vào</span>
                  <span className="text-xl font-semibold text-green-600">
                    {todayAttendance?.checkInTime || "--:--"}
                  </span>
                </p>

                <p className="border rounded-2xl p-3 shadow-2xl w-1/2 flex flex-col items-center">
                  <span className="text-gray-400">Giờ ra</span>
                  <span className="text-xl font-semibold text-red-600">
                    {todayAttendance?.checkOutTime || "--:--"}
                  </span>
                </p>
              </div>

              {/* ================= CHECKIN BUTTON ================= */}
              <div className="flex gap-4 w-3/4 justify-center">
                {!todayAttendance?.checkInTime && (
                  <button
                    onClick={handleCheckIn}
                    disabled={loading}
                    className="bg-[#162F47] text-white text-xl font-semibold w-full px-4 py-2 rounded-2xl hover:bg-blue-500"
                  >
                    Chấm công vào
                  </button>
                )}

                {todayAttendance?.checkInTime &&
                  !todayAttendance?.checkOutTime && (
                    <button
                      onClick={handleCheckOut}
                      disabled={loading}
                      className="bg-red-500 text-white text-xl font-semibold w-full px-4 py-2 rounded-2xl hover:bg-red-200"
                    >
                      Chấm công ra
                    </button>
                  )}

                {todayAttendance?.checkOutTime && (
                  <span className="text-green-600 font-semibold">
                    Đã hoàn thành chấm công hôm nay
                  </span>
                )}
              </div>
            </div>


            {/* ================= RIGHT PANEL ================= */}
            <div className="w-1/2 flex flex-col gap-4">
              <div className="border-2 border-[#162F47] rounded-2xl p-5 shadow-2xl">
                <div className="flex gap-2 items-center border-b border-[#162F47] pb-2">
                  <FiCalendar size={22} className="text-[#162F47]" />
                  <p className="text-[#162F47] font-semibold text-lg">
                    Thông tin hôm nay
                  </p>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <p className="text-gray-500 flex justify-between">
                    Ca làm việc:
                    <span className="font-semibold text-black">
                      {defaultSchedule?.startTime || "--:--"} - {defaultSchedule?.endTime || "--:--"}
                    </span>
                  </p>

                  <p className="text-gray-500 flex justify-between">
                    Nghỉ trưa:
                    <span className="font-semibold text-black">
                      {defaultSchedule?.breakStartTime || "--:--"} - {defaultSchedule?.breakEndTime || "--:--"}
                    </span>
                  </p>

                  <p className="text-gray-500 flex justify-between">
                    Ngưỡng trễ:
                    <span className="font-semibold text-black">
                      {defaultSchedule?.lateToleranceMinutes} phút
                    </span>
                  </p>
                </div>
              </div>

              {/* ================= STATISTICS ================= */}
              <div className="flex gap-4 w-full">
                <div className="border-2 border-[#162F47] rounded-2xl p-3 shadow-2xl w-1/2">
                  <div className="flex items-center gap-2">
                    <FiClock size={22} className="text-[#162F47]" />
                    <p className="text-[#162F47] font-semibold">
                      Giờ làm việc tháng này
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-[#162F47] mt-2">
                    {formatHours(totalWorkHours)}
                  </p>
                </div>

                <div className="border-2 border-[#162F47] rounded-2xl p-3 shadow-2xl w-1/2">
                  <div className="flex items-center gap-2">
                    <FiCheckCircle size={22} className="text-green-600" />
                    <p className="text-[#162F47] font-semibold">
                      Ngày đúng giờ
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {onTimeDays}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <div className="border-2 border-[#162F47] rounded-2xl p-3 shadow-2xl w-1/2">
                  <div className="flex items-center gap-2">
                    <FiAlertTriangle size={22} className="text-red-600" />
                    <p className="text-[#162F47] font-semibold">
                      Ngày đi trễ
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-red-600 mt-2">
                    {lateDays}
                  </p>
                </div>

                <div className="border-2 border-[#162F47] rounded-2xl p-3 shadow-2xl w-1/2">
                  <div className="flex items-center gap-2">
                    <FiPlusCircle size={22} className="text-blue-600" />
                    <p className="text-[#162F47] font-semibold">
                      Giờ tăng ca
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {formatHours(overtimeHours)}
                  </p>
                </div>
              </div>
            </div>
          </div>


          {/* ================= MONTHLY CALENDAR ================= */}
          <div className="border-2 border-[#162F47] rounded-2xl p-5 shadow-2xl mt-6">
            <h2 className="text-lg font-semibold mb-4">
              Lịch chấm công tháng
            </h2>

            {/* month navigation */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() - 1,
                      1
                    )
                  )
                }
                className="px-3 py-1 border rounded"
              >
                ◀
              </button>

              <h2 className="text-lg font-semibold">
                Tháng {currentDate.getMonth() + 1} /
                {currentDate.getFullYear()}
              </h2>

              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() + 1,
                      1
                    )
                  )
                }
                className="px-3 py-1 border rounded"
              >
                ▶
              </button>
            </div>

            {/* calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index}></div>;
                }

                const dateStr =
                  `${currentDate.getFullYear()}-${String(
                    currentDate.getMonth() + 1
                  ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                const attendance = attendanceMap[dateStr];

                return (
                  <div
                    key={index}
                    className="border p-2 rounded-lg text-center text-sm"
                  >
                    <p className="font-semibold">{day}</p>

                    {attendance ? (
                      <>
                        <p className="text-green-600">
                          {attendance.checkInTime}
                        </p>
                        <p className="text-red-600">
                          {attendance.checkOutTime || "--:--"}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-400 text-xs">---</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;