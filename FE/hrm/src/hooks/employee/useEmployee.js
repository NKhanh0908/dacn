import { EMPLOYEE, EMPLOYEE_GET_CURRENT } from "../../config/constants";
import { useFetchById, useFetchList, useGetData } from "../../hooks";

/* Danh sách employee (có filter) */
export const useEmployeeList = (query, config = {}) => {
  return useFetchList(EMPLOYEE, query, config);
};

/* Employee theo ID */
export const useEmployeeById = (employeeId, config = {}) => {
  return useFetchById(EMPLOYEE, employeeId, config);
};

/* Employee hiện tại (hook) */
export const useCurrentEmployee = (config = {}) => {
  return useGetData(`${EMPLOYEE}/${EMPLOYEE_GET_CURRENT}`, config);
};
