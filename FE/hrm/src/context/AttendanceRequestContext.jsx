/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { useEmployeeContext } from "./EmployeeContext";

import {
  createAttendanceRequest,
  getMyAttendanceRequests,
  getAllAttendanceRequests,
  getPendingAttendanceRequests,
  reviewAttendanceRequest
} from "../services";

const AttendanceRequestContext = createContext();

export const AttendanceRequestProvider = ({ children }) => {
  const { employee } = useEmployeeContext();

  // ================= EMPLOYEE =================
  const [myRequests, setMyRequests] = useState([]);

  // ================= ADMIN =================
  const [allRequests, setAllRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  const [loading, setLoading] = useState(false);

  // ================= EMPLOYEE =================

  const fetchMyAttendanceRequests = async () => {
    try {
      if (!employee?.employeeId) return;

      setLoading(true);
      const res = await getMyAttendanceRequests();
      setMyRequests(res.data || []);
    } catch (error) {
      console.error("Get my attendance requests error:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitAttendanceRequest = async (data) => {
    try {
      setLoading(true);
      await createAttendanceRequest(data);

      await fetchMyAttendanceRequests();
    } catch (error) {
      console.error("Submit attendance request error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= ADMIN =================
  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      const res = await getAllAttendanceRequests();
      setAllRequests(res);
    } catch (error) {
      console.error("Get all attendance requests error:", error);
      setAllRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const res = await getPendingAttendanceRequests();
      setPendingRequests(res.data || []);
    } catch (error) {
      console.error("Get pending attendance requests error:", error);
    }
  };

  const reviewRequest = async (id, payload) => {
    try {
      setLoading(true);
      await reviewAttendanceRequest(id, payload);

      await fetchAllRequests();
      await fetchPendingRequests();
    } catch (error) {
      console.error("Review attendance request error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= EFFECT =================

  useEffect(() => {
    if (employee?.employeeId) {
      fetchMyAttendanceRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee]);

  return (
    <AttendanceRequestContext.Provider
      value={{
        // EMPLOYEE
        myRequests,
        fetchMyAttendanceRequests,
        submitAttendanceRequest,

        // ADMIN
        allRequests,
        pendingRequests,
        fetchAllRequests,
        fetchPendingRequests,
        reviewRequest,

        // COMMON
        loading
      }}
    >
      {children}
    </AttendanceRequestContext.Provider>
  );
};

export const useAttendanceRequestContext = () =>
  useContext(AttendanceRequestContext);