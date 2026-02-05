import { useEffect, useState } from "react";    
import Sidebar from "../../components/layout/Sidebar";
import BackgroundWaves from "../../components/BackgroundWaves";

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
      </div>
    </>
  );
}

export default DashboardLayout;