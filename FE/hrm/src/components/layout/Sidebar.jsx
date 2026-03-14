import { FiHome, FiSettings, FiUsers, FiUser, FiCalendar, FiFileText, FiDollarSign, FiClock } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  const [openAttendance, setOpenAttendance] = useState(false);

  const menuClass =
    "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition";

  const subMenuClass =
    "flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/10 transition text-sm";

  const isActive = (path) =>
    location.pathname === path ? "bg-white/15 text-blue-400" : "";

  // mở submenu khi đang ở trang attendance
  useEffect(() => {
    if (location.pathname.startsWith("/attendance")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenAttendance(true);
    } else {
      setOpenAttendance(false);
    }
  }, [location.pathname]);

  const handleNavigate = (path) => {
    setOpenAttendance(false);
    navigate(path);
  };

  return (
    <div className="w-[19%] h-screen text-white bg-[#162F47] rounded-br-[10px] flex flex-col">
      {/* LOGO */}
      <h2
        className="
        mt-2 mb-5
        text-center text-[40px] font-black tracking-[5px]
        font-['Orbitron','Poppins',sans-serif]
        bg-gradient-to-r from-blue-500 to-green-500
        bg-clip-text text-transparent
        drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]
      "
      >
        HRM
      </h2>

      {/* MENU */}
      <div className="flex flex-col gap-2 px-4">
        {/* Trang chủ */}
        <button
          onClick={() => handleNavigate("/")}
          className={`${menuClass} ${isActive("/")}`}
        >
          <FiHome size={18} />
          Trang chủ
        </button>

        {/* Profile */}
        <button
          onClick={() => handleNavigate("/profile")}
          className={`${menuClass} ${isActive("/profile")}`}
        >
          <FiUser size={18} />
          Thông tin cá nhân
        </button>

        {/* ADMIN */}
        {role === "ADMIN" && (
          <>
            <button
              onClick={() => handleNavigate("/employees")}
              className={`${menuClass} ${isActive("/employees")}`}
            >
              <FiUsers size={18} />
              Quản lý nhân viên
            </button>

            <button
              onClick={() => handleNavigate("/accounts")}
              className={`${menuClass} ${isActive("/accounts")}`}
            >
              <FiSettings size={18} />
              Quản lý tài khoản
            </button>
          </>
        )}

        {/* EMPLOYEE */}
        {role === "EMPLOYEE" && (
          <>
            {/* CHẤM CÔNG */}
            <div>

              <button
                onClick={() => {
                  setOpenAttendance(true);
                  navigate("/attendance");
                }}
                className={`${menuClass} ${
                  location.pathname.startsWith("/attendance")
                    ? "bg-white/15 text-blue-400"
                    : ""
                }`}
              >
                <FiCalendar size={18} />
                Chấm công
              </button>

              {openAttendance && (
                <div className="ml-6 flex flex-col gap-1 mt-1">

                  <button
                    onClick={() => navigate("/attendance")}
                    className={`${subMenuClass} ${isActive("/attendance")}`}
                  >
                    Chấm công hôm nay
                  </button>

                  <button
                    onClick={() => navigate("/attendance-requests")}
                    className={`${subMenuClass} ${isActive("/attendance-requests")}`}
                  >
                    Đơn xin chấm công
                  </button>

                </div>
              )}
            </div>

            {/* Hợp đồng */}
            <button
              onClick={() => handleNavigate("/contracts")}
              className={`${menuClass} ${isActive("/contracts")}`}
            >
              <FiFileText size={18} />
              Hợp đồng
            </button>

            {/* Lương */}
            <button
              onClick={() => handleNavigate("/payrolls")}
              className={`${menuClass} ${isActive("/payrolls")}`}
            >
              <FiDollarSign size={18} />
              Lương
            </button>

            {/* Ca làm */}
            <button
              onClick={() => handleNavigate("/work-schedule")}
              className={`${menuClass} ${isActive("/work-schedule")}`}
            >
              <FiClock size={18} />
              Ca làm việc
            </button>

            {/* Nghỉ phép */}
            <button
              onClick={() => handleNavigate("/leave-requests")}
              className={`${menuClass} ${isActive("/leave-requests")}`}
            >
              <FiFileText size={18} />
              Đơn xin nghỉ phép
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;