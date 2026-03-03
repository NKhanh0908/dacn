import { useEffect, useState } from "react";    
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import ProfilePage from "../profile/ProfilePage";

const DashboardLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [setShowProfile] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timerId);
  }, []);
  return (
    <>
      {/* <BackgroundWaves /> */}
      <div className="flex min-h-screen bg-[#ffffff] relative">
        <Sidebar />
        <div className="w-[82%]">
          <Header onOpenProfile={() => setShowProfile(true)} />
          <main className="pl-7 h-[calc(100vh-100px)] overflow-y-auto">
            <Outlet />
          </main>
        </div>
        {isLoading && (
          <div className="
            fixed inset-0 z-[999]
            flex items-center justify-center
            bg-black/30 backdrop-blur-sm
          ">
            <div className="
              w-14 h-14
              border-4 border-white/30
              border-t-blue-500
              rounded-full
              animate-spin
            " />
          </div>
        )}
      </div>
    </>
  );
};
export default DashboardLayout;