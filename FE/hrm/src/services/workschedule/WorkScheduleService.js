import { api } from "../../config/axios";
import {
  WORK_SCHEDULE,
  WORK_SCHEDULE_DEFAULT,
  WORK_SCHEDULE_ACTIVATE,
  WORK_SCHEDULE_DEACTIVATE,
  WORK_SCHEDULE_ACTIVE
} from "../../config/constants";

/* Lấy tất cả ca */
export const getAllWorkSchedules = async () => {
  const response = await api.get(WORK_SCHEDULE);
  return response.data;
};

/* Lấy theo ID */
export const getWorkScheduleById = async (id) => {
  const response = await api.get(`${WORK_SCHEDULE}/${id}`);
  return response.data;
};

/* Tạo ca */
export const createWorkSchedule = async (data) => {
  const response = await api.post(WORK_SCHEDULE, data);
  return response.data;
};

/* Update */
export const updateWorkSchedule = async (id, data) => {
  const response = await api.put(`${WORK_SCHEDULE}/${id}`, data);
  return response.data;
};

/* Delete */
export const deleteWorkSchedule = async (id) => {
  const response = await api.delete(`${WORK_SCHEDULE}/${id}`);
  return response.data;
};

/* Set default */
export const setDefaultWorkSchedule = async (id) => {
  const response = await api.put(
    `${WORK_SCHEDULE}/${id}/${WORK_SCHEDULE_DEFAULT}`
  );
  return response.data;
};

/* Activate */
export const activateWorkSchedule = async (id) => {
  const response = await api.put(
    `${WORK_SCHEDULE}/${id}/${WORK_SCHEDULE_ACTIVATE}`
  );
  return response.data;
};

/* Deactivate */
export const deactivateWorkSchedule = async (id) => {
  const response = await api.put(
    `${WORK_SCHEDULE}/${id}/${WORK_SCHEDULE_DEACTIVATE}`
  );
  return response.data;
};

/* Lấy ca mặc định */
export const getDefaultWorkSchedule = async () => {
  // const response = await api.get("/work-schedules/default");
  const response = await api.get(`${WORK_SCHEDULE}/${WORK_SCHEDULE_DEFAULT}`);
  return response.data;
};

/* Lấy ca active */
export const getActiveWorkSchedules = async () => {
  const response = await api.get(`${WORK_SCHEDULE}/${WORK_SCHEDULE_ACTIVE}`);
  return response.data;
};