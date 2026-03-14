import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/index.css";
import { EmployeeProvider } from "./context/EmployeeContext";
import { AttendanceProvider } from "./context/AttendanceContext";
import { WorkScheduleProvider } from "./context/WorkScheduleContext";
import { AttendanceRequestProvider } from "./context/AttendanceRequestContext";
import { PayrollProvider } from "./context/PayrollContext";
import { ContractProvider } from "./context/ContractContext";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EmployeeProvider>
      <ContractProvider>
        <PayrollProvider>
          <WorkScheduleProvider>
            <AttendanceProvider>
              <AttendanceRequestProvider>
                <App />
              </AttendanceRequestProvider>
            </AttendanceProvider>
          </WorkScheduleProvider>
        </PayrollProvider>
      </ContractProvider>
    </EmployeeProvider>
  </StrictMode>,
)