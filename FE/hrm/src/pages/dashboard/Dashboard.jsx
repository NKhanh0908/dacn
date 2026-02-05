import { useEffect, useState } from "react";    
import Sidebar from "../../components/layout/Sidebar";
import BackgroundWaves from "../../components/BackgroundWaves";

import { useCurrentEmployee } from "../../hooks/employee/useEmployee";

const ProfilePage = () => {
  const { data, isLoading, error } = useCurrentEmployee();

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return <div>{data.fullName}</div>;
};


const DashboardLayout = () => { 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  if (isLoading) return <div>Loading...</div>

  return (
    <>
      <BackgroundWaves />
      <div className="min-h-screen bg-[#0d0d0d]">
        <div>
          <Sidebar />
        </div>
        <div>
          <ProfilePage />
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;