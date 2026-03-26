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
  AttendanceManagement,
  LeaveRequestManagement,
  OvertimeManagement
} from "./pages/index";

const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};

// const router = createBrowserRouter([
//   {
//     path: "/login",
//     element: <Login />,
//   },
//   {
//     path: "/",
//     element: isAuthenticated() ? <DashboardLayout /> : <Navigate to="/login" />,
//     children: [
//       {
//         index: true,
//         element: (() => {
//           const role = localStorage.getItem("role");
//           return role === "EMPLOYEE"
//             ? <Navigate to="/profile" />
//             : <Navigate to="/" />;
//         })()
//       },

//       {
//         path: "profile",
//         element: <ProfilePage />,
//       },
//       {
//         path: "attendance",
//         element: <AttendancePage />,
//       },
//       {
//         path: "attendance-requests",
//         element: <AttendanceRequestPage />,
//       },
//       {
//         path: "contracts",
//         element: <ContractPage />,
//       },
//       {
//         path: "contracts/:id",
//         element: <ContractDetail />,
//       },
//       {
//         path: "payrolls",
//         element: <MyPayrollPage />,
//       },
//       {
//         path: "payrolls/:id",
//         element: <PayrollDetailPage />,
//       },
//       {
//         path: "work-schedule",
//         element: <WorkSchedulePage />,
//       },
//       {
//         path: "leave-requests",
//         element: <LeaveRequestPage />,
//       },

//       // ADMIN + HR
//       {
//         path: "employees",
//         element: <EmployeesManagement />,
//       },
//           {
//             path: "attendances",
//             element: <AttendanceManagement />,
//           },
//       {
//         path: "leave-requests-mn",
//         element: <LeaveRequestManagement />,
//       },
//       {
//         path: "overtime-requests-mn",
//         element: <OvertimeManagement />,
//       },
//       {
//         path: "employees/create",
//         element: <CreateNewEmployeePage />,
//       },
//       {
//         path: "employees/edit/:id",
//         element: <EditEmployeePage />,
//       },
//       {
//         path: "employees/:id",
//         element: <EmployeeDetailPage />,
//       }
//     ],
//   },
// ]);

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: isAuthenticated() ? <DashboardLayout /> : <Navigate to="/login" />,
    children: [
      // ROUTE MẶC ĐỊNH: Chuyển hướng dựa trên Role
{
  index: true,
  element: (() => {
    const role = localStorage.getItem("role");
    if (role === "EMPLOYEE") return <Navigate to="/profile" replace />;
    // Cho Admin/HR vào thẳng trang nhân viên thay vì điều hướng về "/"
    return <Navigate to="/employees" replace />; 
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
      
      { path: "leave-requests-mn", element: <LeaveRequestManagement /> },
      { path: "overtime-requests-mn", element: <OvertimeManagement /> },
      { path: "attendances", element: <AttendanceManagement /> }, // Kiểm tra kỹ chính tả ở đây
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;