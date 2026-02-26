import { useEffect, useState } from "react";    
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import ProfilePage from "../profile/ProfilePage";
import BackgroundWaves from "../../components/BackgroundWaves";
import "./Dashboard.css"

const DashboardLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timerId);
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <BackgroundWaves />
      <div className="main-dashboard min-h-screen bg-[#0d0d0d]">
        <Sidebar />
        <div className="header-content">
          <Header onOpenProfile={() => setShowProfile(true)} />

          <main>
            <Outlet />
          </main>
        </div>
      </div>

      <ProfilePage
        show={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </>
  );
};
export default DashboardLayout;