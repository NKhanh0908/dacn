import { createContext, useContext, useState } from "react";
import { createOvertimeRequest } from "../services";

// Tạo context dùng chung cho module yêu cầu tăng ca
const OvertimeRequestContext = createContext();

export const OvertimeRequestProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* Gửi yêu cầu tăng ca */
  const submitOvertimeRequest = async (data) => {
    try {
      setLoading(true);
      setError(null); 
      console.log("Submit overtime request:", data);

      const res = await createOvertimeRequest(data);

      console.log("Overtime request result:", res);

      return res;

    } catch (err) {
      console.error("Create overtime request error:", err);

      const message =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        "Gửi yêu cầu thất bại";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OvertimeRequestContext.Provider
      value={{
        loading,
        error,
        setError, 
        submitOvertimeRequest
      }}
    >
      {children}
    </OvertimeRequestContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useOvertimeRequestContext = () => {
  return useContext(OvertimeRequestContext);
};