import "./sidebar.css";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="glass-container bg-white/5 backdrop-blur-sm">
      <h2 className="logo-tech">HRM</h2>
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