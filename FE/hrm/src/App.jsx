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
  EmployeeDetailPage,
  PayrollManagement,
  PayrollManagementDetailPage,
  WorkScheduleManagementPage,
  WorkScheduleEditPage,
  WorkScheduleCreatePage,
  WorkCalendarCreatePage,
  HolidayEditPage,
  HolidayCreatePage,
  AttendanceManagementPage,
  AttendanceManagementDetailPage,
  AttendanceManagementEditPage,
  AttendanceCreatePage,
  LeaveRequestManagement,
  OvertimeManagement,
  ContractManagement,
  ContractDetailPage,
  ContractEditPage,
  ContractCreatePage,
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
          if (role === "EMPLOYEE") 
            return <Navigate to="/profile" replace />;
            return <Navigate to="/" replace />; 
        })()
      },

      // CÁC ROUTE CÁ NHÂN (Dùng chung hoặc Employee)
      { path: "profile", element: <ProfilePage /> },

      { path: "attendance", element: <AttendancePage /> },
      { path: "attendance-requests", element: <AttendanceRequestPage /> },

      { path: "contracts", element: <ContractPage /> },
      { path: "contracts/:id", element: <ContractDetail /> },

      { path: "payrolls", element: <MyPayrollPage /> },
      { path: "payrolls/:id", element: <PayrollDetailPage /> },

      { path: "work-schedule", element: <WorkSchedulePage /> },

      { path: "leave-requests", element: <LeaveRequestPage /> },

      // CÁC ROUTE QUẢN LÝ (Admin/HR) - Đảm bảo PATH là duy nhất
      { path: "employees", element: <EmployeesManagement /> },
      { path: "employees/create", element: <CreateNewEmployeePage /> },
      { path: "employees/edit/:id", element: <EditEmployeePage /> },
      { path: "employees/:id", element: <EmployeeDetailPage /> },

      { path: "attendance-management", element: <AttendanceManagementPage/> },
      { path: "attendance-management/:id", element: <AttendanceManagementDetailPage /> },
      { path: "attendance-management/edit/:id", element: <AttendanceManagementEditPage /> },
      { path: "attendance-management/create", element: <AttendanceCreatePage /> },

      { path: "payroll-management", element: <PayrollManagement /> },
      { path: "payroll-management/:payrollId", element: <PayrollManagementDetailPage /> },

      { path: "work-schedule-management", element: <WorkScheduleManagementPage /> },
      { path: "work-schedule-management/edit/:id", element: <WorkScheduleEditPage /> },
      { path: "work-schedule-management/create", element: <WorkScheduleCreatePage /> },

      { path: "work-calendar-management/create", element: <WorkCalendarCreatePage /> },

      { path: "holiday-management/edit/:id", element: <HolidayEditPage /> },
      { path: "holiday-management/create", element: <HolidayCreatePage /> },

      { path: "leave-requests-mn", element: <LeaveRequestManagement /> },

      { path: "overtime-requests-mn", element: <OvertimeManagement /> },
      
      { path: "contracts-management", element: <ContractManagement /> },
      { path: "contracts-management/:id", element: <ContractDetailPage /> },
      { path: "contracts-management/edit/:id", element: <ContractEditPage /> },
      { path: "contracts-management/create", element: <ContractCreatePage /> },

    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;