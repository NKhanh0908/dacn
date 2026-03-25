/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  FiMoreVertical,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiStar,
  FiGrid
} from "react-icons/fi";
import { WorkCalendarManagementPage, HolidayManagementPage } from "../../index";
import { useWorkScheduleContext } from "../../../context";

const filters = ["Tất cả", "Mặc định", "Active", "Inactive"];

const WorkScheduleManagementPage = () => {
  const role = localStorage.getItem("role")?.toUpperCase();
  if (!role?.includes("ADMIN") && !role?.includes("HR")) {
    return <Navigate to="/" replace />;
  }

  const navigate = useNavigate();

  const {
    workSchedules,
    activateSchedule,
    deactivateSchedule,
    removeWorkSchedule,
    setDefaultWorkSchedule,
    loading
  } = useWorkScheduleContext();

  const [filterType, setFilterType] = useState("Tất cả");
  const [activeMenu, setActiveMenu] = useState(null);

  // ================= SAFE =================
  const safeSchedules = Array.isArray(workSchedules) ? workSchedules : [];

  // ================= FILTER =================
  const filteredSchedules = safeSchedules.filter((s) => {
    const matchName = true; 

    const isDefault = s?.isDefault;
    const isActive = s?.isActive;

    if (filterType === "Mặc định") return isDefault && matchName;
    if (filterType === "Active") return isActive && matchName;
    if (filterType === "Inactive") return !isActive && matchName;

    return matchName;
  });

  // ================= ACTION =================
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa ca này?")) return;
    await removeWorkSchedule(id);
  };

  const handleToggleStatus = async (schedule) => {
    if (schedule.isActive) {
      await deactivateSchedule(schedule.id);
    } else {
      await activateSchedule(schedule.id);
    }
  };

  const handleSetDefault = async (id) => {
    await setDefaultWorkSchedule(id);
  };

  // ================= UI =================
  return (
    <div className="overflow-y-auto h-[calc(100vh-100px)] pr-4 pb-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Quản lý ca làm việc
          </h1>
        </div>
      </div>

      {/* WORK SCHEDULES */}
      <div className="bg-gray-200 p-4 border-[1px] border-[#162F47] rounded-xl shadow-2xl mb-4">
        <div className="flex items-center gap-2 border-b border-[#162F47] pb-2">
          <FiGrid size={20} className="text-[#162F47]" />
          <span className="text-[#162F47] font-semibold text-lg">
            Quản lý lịch làm việc
          </span>
        </div>

        {/* FILTER */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mt-4 mb-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          >
            {filters.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>

          <button
            onClick={() => navigate("/work-schedule-management/create")}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            <FiPlus /> Tạo lịch làm việc
          </button>
        </div>

        {/* GRID */}
        {loading ? (
          <div className="text-center py-10">Đang tải...</div>
        ) : filteredSchedules.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Không có dữ liệu
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSchedules.map((schedule) => {
              const isDefault = schedule.isDefault;
              const isActive = schedule.isActive;

              return (
                <div
                  key={schedule.id}
                  className="bg-white rounded-xl shadow-sm border p-5 relative"
                >
                  {/* MENU */}
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() =>
                        setActiveMenu(
                          activeMenu === schedule.id ? null : schedule.id
                        )
                      }
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <FiMoreVertical />
                    </button>

                    {activeMenu === schedule.id && (
                      <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-xl z-20 overflow-hidden">

                        <button
                          onClick={() => navigate(`/work-schedule-management/edit/${schedule.id}`)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-blue-50 text-blue-600"
                        >
                          <FiEdit2 size={14} /> Chỉnh sửa
                        </button>

                        <button
                          onClick={() => handleToggleStatus(schedule)}
                          className={`w-full flex items-center gap-2 px-4 py-2 text-sm ${
                            isActive
                              ? "hover:bg-red-50 text-red-600"
                              : "hover:bg-green-50 text-green-600"
                          }`}
                        >
                          {isActive ? (
                            <>
                              <FiXCircle size={14} /> Vô hiệu
                            </>
                          ) : (
                            <>
                              <FiCheckCircle size={14} /> Kích hoạt
                            </>
                          )}
                        </button>

                        {!isDefault && isActive && (
                          <button
                            disabled={isDefault}
                            onClick={() => handleSetDefault(schedule.id)}
                            className={`w-full flex items-center gap-2 px-4 py-2 text-sm ${
                              isDefault
                                ? "bg-gray-300 cursor-not-allowed"
                                : "text-yellow-600 hover:bg-yellow-100"
                            }`}
                          >
                            <FiStar size={14} /> Mặc định
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(schedule.id)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-50 text-red-600"
                        >
                          <FiTrash2 size={14} /> Xóa
                        </button>

                      </div>
                    )}
                  </div>

                  {/* INFO */}
                  <div className="mb-4">
                    <h3 className="font-bold text-lg">
                      {schedule.scheduleName}
                    </h3>

                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs px-2  rounded ${
                          isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {isActive ? "Đang active" : "Đã tắt"}
                      </span>

                      {isDefault && 
                        <p className="flex items-center gap-1">
                          <FiStar size={14} className="text-yellow-500" />
                          <span className="text-yellow-600 text-xs font-semibold">
                            Mặc định
                          </span>
                        </p> 
                      }
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-2">
                      <p className="text-gray-500 flex justify-between">
                        Thời gian:
                        <span className="font-semibold text-black">
                          {schedule?.startTime || "--:--"} - {schedule?.endTime || "--:--"}
                        </span>
                      </p>

                      <p className="text-gray-500 flex justify-between">
                        Nghỉ trưa:
                        <span className="font-semibold text-black">
                          {schedule?.breakStartTime || "--:--"} - {schedule?.breakEndTime || "--:--"}
                        </span>
                      </p>

                      <p className="text-gray-500 flex justify-between">
                        Ngưỡng trễ:
                        <span className="font-semibold text-black">
                          {schedule?.lateToleranceMinutes} phút
                        </span>
                      </p>

                      <p className="text-gray-500 flex justify-between">
                        Ngưỡng sớm:
                        <span className="font-semibold text-black">
                          {schedule?.earlyLeaveToleranceMinutes} phút
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* WORK CALENDAR */}
      <div className="mb-4">
        <WorkCalendarManagementPage />
      </div>

      {/* HOLIDAYS */}
      <div>
        <HolidayManagementPage />
      </div>
    </div>
  );
};

export default WorkScheduleManagementPage;