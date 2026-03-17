import { useEffect, useState } from "react";
import { FiBell, FiUser, FiRefreshCw } from "react-icons/fi";
import { useEmployeeContext } from "../../context/EmployeeContext";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { authLogout } from "../../services/auth/AuthServices";

function useDateTime() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return now;
}

export default function Header() {
  const { employee, loading } = useEmployeeContext();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const now = useDateTime();

  if (loading || !employee) return null;

  const handleLogout = () => {
    authLogout();
    navigate("/login", { replace: true });
  };

  const formattedDate = now.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedTime = now.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (loading || !employee) return null;

  return (
    <div className="relative">
      <div className="bg-[#162F47] flex items-center justify-between pt-4 pr-4 pb-4">
        <span className="w-0.5 h-8 bg-white"></span>
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl pl-6 font-bold text-white">
            {/* Welcome, {employee.fullName} */}
          </h1>
          <div className="flex items-center gap-5 text-white">
            <div className="text-right leading-tight">
              <p className="text-sm capitalize">{formattedDate}</p>
              <p className="text-xs opacity-70">{formattedTime}</p>
            </div>
            <button className="relative hover:text-blue-400 transition">
              <FiBell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="hover:text-blue-400 transition hover:rotate-180 duration-500"
            >
              <FiRefreshCw size={20} />
            </button>
            <img src={employee.avatarUrl} 
              alt="Avatar" 
              onClick={() => setOpen(!open)} 
              className="w-9 h-9 rounded-full flex items-center justify-center
                        bg-white/10 border border-white/20
                        text-white cursor-pointer
                        hover:ring-2 hover:ring-blue-400 transition" 
            />
          </div>
        </div>
      </div>

      <div className="relative bg-[#162F47] p-4 w-7 overflow-hidden
        [mask-image:radial-gradient(circle_32px_at_100%_100%,transparent_99%,black_100%)]
        [-webkit-mask-image:radial-gradient(circle_32px_at_0%_100%,transparent_99%,black_100%)]
      ">
      </div>

      {open && (
        <div className="absolute top-16 right-6 w-64 bg-white rounded-xl shadow-lg p-4 z-50 border border-gray-600">
          <p className="font-semibold text-center">{employee.fullName}</p>
          <p className="text-sm text-gray-500 text-center">{employee.email}</p>
          
          <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"/>

          <div className="mt-4 space-y-2 flex flex-col items-center">
            <button
              onClick={handleLogout}
              className=" border border-red-500
                w-[50%] flex items-center gap-2
                text-red-500 text-sm
                hover:bg-red-50 px-2 py-2 rounded-lg
                transition
              "
            >
              <FiLogOut size={16} />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}