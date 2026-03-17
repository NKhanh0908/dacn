import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  EmployeeProvider,
  AttendanceProvider,
  WorkScheduleProvider,
  AttendanceRequestProvider,
  PayrollProvider,
  ContractProvider,
  HolidayProvider,
  LeaveRequestProvider,
  WorkCalendarProvider,
  OvertimeRequestProvider,
} from "./context";
import "./styles/index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <EmployeeProvider>
      <ContractProvider>
        <PayrollProvider>
          <WorkScheduleProvider>
            <HolidayProvider>
              <LeaveRequestProvider>
                <WorkCalendarProvider>
                  <OvertimeRequestProvider>
                    <AttendanceProvider>
                      <AttendanceRequestProvider>
                        <App />
                      </AttendanceRequestProvider>
                    </AttendanceProvider>
                  </OvertimeRequestProvider>
                </WorkCalendarProvider>
              </LeaveRequestProvider>
            </HolidayProvider>
          </WorkScheduleProvider>
        </PayrollProvider>
      </ContractProvider>
    </EmployeeProvider>
  </StrictMode>
);