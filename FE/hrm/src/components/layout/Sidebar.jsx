import { FiHome, FiSettings, FiUsers, FiUser, FiCalendar, FiFileText, FiDollarSign, FiClock } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  const menuClass =
    "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition";

  const isActive = (path) =>
    location.pathname === path
      ? "bg-white/15 text-blue-400"
      : "";

  return (
    <div className="w-[18%] h-screen text-white bg-[#162F47] rounded-br-[10px] flex flex-col">
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
        <button
          onClick={() => navigate("/")}
          className={`${menuClass} ${isActive("/")}`}
        >
          <FiHome size={18} />
          Trang chủ
        </button>

        <button
          onClick={() => navigate("/profile")}
          className={`${menuClass} ${isActive("/profile")}`}
        >
          <FiUser size={18} />
          Thông tin cá nhân
        </button>

        {/* ADMIN */}
        {role === "ADMIN" && (
          <>
            <button
              onClick={() => navigate("/employees")}
              className={`${menuClass} ${isActive("/employees")}`}
            >
              <FiUsers size={18} />
              Quản lý nhân viên
            </button>

            <button
              onClick={() => navigate("/accounts")}
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
            <button
              onClick={() => navigate("/attendance")}
              className={`${menuClass} ${isActive("/attendance")}`}
            >
              <FiCalendar size={18} />
              Chấm công
            </button>

            <button
              onClick={() => navigate("/contracts")}
              className={`${menuClass} ${isActive("/contracts")}`}
            >
              <FiFileText size={18} />
              Hợp đồng
            </button>

            <button
              onClick={() => navigate("/salary")}
              className={`${menuClass} ${isActive("/salary")}`}
            >
              <FiDollarSign size={18} />
              Lương
            </button>

            <button
              onClick={() => navigate("/work-schedule")}
              className={`${menuClass} ${isActive("/work-schedule")}`}
            >
              <FiClock size={18} />
              Ca làm việc
            </button>

            <button
              onClick={() => navigate("/leave-requests")}
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