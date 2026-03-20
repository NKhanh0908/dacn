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
  WorkSchedulePage,
  LeaveRequestPage,
  EmployeesManagement,
  CreateNewEmployeePage,
  EditEmployeePage,
  EmployeeDetailPage
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
        index: true,
        element: (() => {
          const role = localStorage.getItem("role");
          return role === "EMPLOYEE"
            ? <Navigate to="/profile" />
            : <Navigate to="/" />;
        })()
      },

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
        element: <PayrollDetailPage />,
      },
      {
        path: "work-schedule",
        element: <WorkSchedulePage />,
      },
      {
        path: "leave-requests",
        element: <LeaveRequestPage />,
      },

      // ADMIN + HR
      {
        path: "employees",
        element: <EmployeesManagement />,
      },
      {
        path: "employees/create",
        element: <CreateNewEmployeePage />,
      },
      {
        path: "employees/edit/:id",
        element: <EditEmployeePage />,
      },
      {
        path: "employees/:id",
        element: <EmployeeDetailPage />,
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;