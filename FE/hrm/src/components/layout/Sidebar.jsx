import "./sidebar.css";
import { FiLogOut, FiHome, FiSettings, FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { authLogout } from "../../services/auth/AuthServices";

const Sidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    authLogout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="glass-container bg-white/5 backdrop-blur-sm">
      <h2 className="logo-tech">HRM</h2>
      {/* ===== CHỨC NĂNG CHUNG ===== */}
      <button onClick={() => navigate("/")}>
        <FiHome /> Trang chủ
      </button>

      <button onClick={() => navigate("/profile")}>
        <FiSettings /> Thông tin cá nhân
      </button>

      {/* ===== CHỈ ADMIN MỚI THẤY ===== */}
      {role === "ADMIN" && (
        <>
          <button onClick={() => navigate("/employees")}>
            <FiUsers /> Quản lý nhân viên
          </button>

          <button onClick={() => navigate("/accounts")}>
            <FiSettings /> Quản lý tài khoản
          </button>
        </>
      )}
      <button
        onClick={handleLogout}
        className="
          mx-4 mb-4 px-4 py-2
          flex items-center gap-2
          rounded-xl
          text-red-400
          hover:bg-red-400/10 hover:text-white
          transition
        "
      >
        <FiLogOut size={18} />
        <span>Đăng xuất</span>
      </button>    </div>
  )
}

export default Sidebar;