import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import DashboardLayout from "./pages/dashboard/Dashboard";
import ProfilePage from "./pages/profile/ProfilePage";
import ContractPage from "./pages/contract/ContractPage";
import ContractDetail from "./pages/contract/ContractDetail";
import AttendancePage from "./pages/attendance/AttendancePage";
import AttendanceRequestPage from "./pages/attendance_requests/AttendanceRequestsPage";
import MyPayrollPage from "./pages/payroll/PayrollPage";
import PayrollDetailPage from "./pages/payroll/PayrollDetail";

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
      }
          ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;