import { FiCalendar, FiFlag } from "react-icons/fi";
import HolidayPage from "../holidays/HolidaysUI";
import OvertimeRequestPage from "../overtime/OvertimeUI";
import WorkCalendarPage from "../workcalendar/WorkCalendarUI";
import { useWorkScheduleContext } from "../../context";

const WorkSchedulePage = () => {
  const { defaultSchedule } = useWorkScheduleContext();
  return (
    <div className="overflow-y-auto h-[calc(100vh-100px)] pr-4 pb-4">
      <div className="bg-white border-2 border-[#162F47] rounded-2xl p-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#162F47] pb-2">
          <FiCalendar size={20} className="text-[#162F47]" />
          <span className="text-[#162F47] font-semibold text-lg">
            Thông tin ca làm việc và ngày nghỉ
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4 w-full">
            {/* Work Schedule */}
            <div className="border rounded-xl p-4 bg-gray-50  w-1/2">
              <div className="flex items-center gap-2 border-b border-[#162F47] pb-2">
                <FiCalendar size={22} className="text-[#162F47]" />
                <span className="font-semibold">Thông tin ca làm việc</span>
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

                
                <p className="text-gray-500 flex justify-between">
                  Ngưỡng sớm:
                  <span className="font-semibold text-black">
                    {defaultSchedule?.earlyLeaveToleranceMinutes} phút
                  </span>
                </p>
              </div>
            </div>

            {/* Work Calendar */}
            <div className="border rounded-xl p-4 bg-gray-50 w-1/2">
              <div className="flex items-center gap-2 border-b border-[#162F47] pb-2">
                <FiCalendar size={22} className="text-[#162F47]" />
                <span className="font-semibold">Ngày làm việc</span>
              </div>
              <WorkCalendarPage />
            </div>
          </div>

          <div className="flex gap-4 w-full">
            {/* Holidays */}
            <div className="border rounded-xl p-4 bg-gray-50 w-1/2">
              <div className="flex items-center gap-2 border-b border-[#162F47] pb-2">
                <FiFlag size={22} className="text-[#162F47]" />
                <span className="font-semibold">Danh sách ngày nghỉ sắp tới</span>
              </div>
              <HolidayPage />
            </div>

            {/* Overtime */}
            <div className="w-1/2">
              <OvertimeRequestPage />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkSchedulePage;