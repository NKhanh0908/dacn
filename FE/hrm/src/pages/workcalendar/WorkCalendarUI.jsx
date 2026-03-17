import { useState } from "react";
import { FiCalendar, FiCheckCircle, FiSearch } from "react-icons/fi";
import { useWorkCalendarContext } from "../../context";

const WorkCalendarPage = () => {

  const { calendar, loading, fetchWorkCalendar, isWorkingDay } = useWorkCalendarContext();

  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(currentYear);
  const [checkDate, setCheckDate] = useState("");
  const [checkResult, setCheckResult] = useState(null);

  /* Load lịch theo năm */
  const handleLoadCalendar = async () => {
    await fetchWorkCalendar(year);
  };

  /* Kiểm tra ngày làm việc */
  const handleCheckDate = async () => {
    if (!checkDate) return;

    const res = await isWorkingDay(checkDate);
    setCheckResult(res);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between gap-3">
        {/* Chọn năm */}
        <div className="h-40">
          <h3 className="font-semibold mb-3">
            Tìm lịch làm việc theo năm
          </h3>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border rounded-lg p-2 w-32"
            />

            <button
              onClick={handleLoadCalendar}
              className="h-10 text-lg font-bold text-[#162F47] border border-[#162F47] rounded-lg p-2 hover:bg-[#162F47] hover:text-white"
            >
              <FiSearch/>
            </button>
          </div>
        </div>

        {/* Kiểm tra ngày */}
        <div className="h-40">
          <h3 className="font-semibold mb-3">
            Kiểm tra ngày làm việc
          </h3>

          <div className="flex items-center gap-3">
            <input
              type="date"
              value={checkDate}
              onChange={(e) => setCheckDate(e.target.value)}
              className="border rounded-lg p-2"
            />

            <button
              onClick={handleCheckDate}
              className="h-10 px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <FiSearch />
            </button>
          </div>

          {checkResult !== null && (
            <div className="mt-4 flex items-center gap-2">
              <FiCheckCircle />
              {checkResult ? (
                <span className="text-green-600 font-medium">
                  Đây là ngày làm việc
                </span>
              ) : (
                <span className="text-red-600 font-medium">
                  Đây không phải ngày làm việc
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hiển thị lịch */}
      {calendar && (
        <div>
          <h3 className="font-semibold mb-3">
            Lịch làm việc năm {year}
          </h3>

          <div className="flex flex-wrap gap-3">
            {calendar.workingDays?.map((day) => (
              <span
                key={day}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-medium"
              >
                {day}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkCalendarPage;