import { createContext, useContext, useState } from "react";
import { createOvertimeRequest } from "../services";

// Tạo context dùng chung cho module yêu cầu tăng ca
const OvertimeRequestContext = createContext();

export const OvertimeRequestProvider = ({ children }) => {

  const [loading, setLoading] = useState(false);

  /* Gửi yêu cầu tăng ca */
  const submitOvertimeRequest = async (data) => {
    try {
      setLoading(true);

      console.log("Submit overtime request:", data);

      const res = await createOvertimeRequest(data);

      console.log("Overtime request result:", res);

      return res;

    } catch (error) {
      console.error("Create overtime request error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <OvertimeRequestContext.Provider
      value={{
        loading,
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