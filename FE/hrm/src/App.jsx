import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import DashboardLayout from "./pages/dashboard/Dashboard";
// import Error from "./pages/error/Error";

const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    // errorElement: <Error />,
  },
  {
    path: "/",
    element: isAuthenticated() ? <DashboardLayout /> : <Navigate to="/login" />,
    // errorElement: <Error />,
    // children: [
    //   { path: "employee", element: <Employee /> },
    //   { path: "department", element: <Department /> },
    // ]
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
