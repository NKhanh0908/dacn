import { createAccount } from "../services";
import { createContext, useContext } from "react";

// Tạo context dùng chung cho module tài khoản
const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  // Hàm tạo tài khoản mới
  const handleCreateAccount = async (Data) => {
    return await createAccount(Data);
  };

  return (
    <AccountContext.Provider value={{ handleCreateAccount }}> 
        {children}
    </AccountContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
};
