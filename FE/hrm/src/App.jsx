import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import {
  Login, 
  DashboardLayout, 
  ProfilePage, 
  ContractPage, 
  ContractDetail, 
  AttendancePage, 
  AttendanceRequestPage, 
  MyPayrollPage,
  PayrollDetailPage,
  WorkSchedulePage
} from "./pages/index";

const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: isAuthenticated() ? <DashboardLayout /> : <Navigate to="/login" />,
    children: [
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "attendance",
        element: <AttendancePage />,
      },
      {
        path: "attendance-requests",
        element: <AttendanceRequestPage />,
      },
      {
        path: "contracts",
        element: <ContractPage />,
      },
      {
        path: "contracts/:id",
        element: <ContractDetail />,
      },
      {
        path: "payrolls",
        element: <MyPayrollPage />,
      },
      {
        path: "payrolls/:id",
        element: <PayrollDetailPage />
      },
      {
        path: "work-schedule",
        element: <WorkSchedulePage />
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;