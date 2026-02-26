import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import DashboardLayout from "./pages/dashboard/Dashboard";

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
    // children: [
    //   // sau này thêm employee, department...
    // ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
