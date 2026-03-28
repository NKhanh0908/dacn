/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { FiCheckCircle, FiXCircle, FiSearch } from "react-icons/fi";

import { useAttendanceRequestContext } from "../../../context";

const removeVietnameseTones = (str = "") =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();

const AttendanceRequestManagement = () => {
  const role = localStorage.getItem("role");
  if (role !== "ADMIN" && role !== "HR") {
    return <Navigate to="/" replace />;
  }

  const {
    allRequests,
    fetchAllRequests,
    reviewRequest,
    loading
  } = useAttendanceRequestContext();

  const [activeTab, setActiveTab] = useState("PENDING");
  const [employeeKeyword, setEmployeeKeyword] = useState("");
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchAllRequests();
  }, []);

  // Helpers
  const getEmployeeName = (item) => {
    return item?.employeeName || "Không rõ";
  };

  const getReason = (item) => {
    return item?.reason || "--";
  };

  const getDate = (item) => {
    return item?.requestDate || "--";
  };

  const getCheckIn = (item) => {
    return item?.checkInTime || "--";
  };

  const getCheckOut = (item) => {
    return item?.checkOutTime || "--";
  };

  const getStatus = (item) => {
    return item?.status || "PENDING";
  };

  // Filter
  const filteredRequests = useMemo(() => {
    let data = Array.isArray(allRequests) ? [...allRequests] : [];

    if (activeTab === "PENDING") {
      data = data.filter((item) => getStatus(item) === "PENDING");
    } else {
      data = data.filter((item) => getStatus(item) !== "PENDING");
    }

    if (employeeKeyword.trim()) {
      const keyword = removeVietnameseTones(employeeKeyword);

      data = data.filter((item) => {
        const name = removeVietnameseTones(getEmployeeName(item));
        return name.includes(keyword);
      });
    }

    return data;
  }, [allRequests, activeTab, employeeKeyword]);

  const pendingCount = allRequests.filter(
    (item) => getStatus(item) === "PENDING"
  ).length;

  const processedCount = allRequests.filter(
    (item) => getStatus(item) !== "PENDING"
  ).length;

  // Actions
  const handleApprove = async (id) => {
    try {
      await reviewRequest(id, {
        status: "APPROVED",
        rejectReason: null
      });

      await fetchAllRequests();
      alert("Duyệt yêu cầu thành công");
    } catch (err) {
      console.error(err);
      alert("Duyệt thất bại");
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }

    try {
      await reviewRequest(id, {
        status: "REJECTED",
        rejectReason: rejectReason.trim()
      });

      setRejectingId(null);
      setRejectReason("");
      await fetchAllRequests();
      alert("Từ chối thành công");
    } catch (err) {
      console.error(err);
      alert("Từ chối thất bại");
    }
  };

  // Badge
  const getStatusBadge = (status) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
      APPROVED: "bg-green-100 text-green-700 border-green-200",
      REJECTED: "bg-red-100 text-red-700 border-red-200"
    };

    const labels = {
      PENDING: "Chưa xử lý",
      APPROVED: "Đã duyệt",
      REJECTED: "Đã từ chối"
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs border ${
          styles[status] || "bg-gray-100 text-gray-700 border-gray-200"
        }`}
      >
        {labels[status] || status}
      </span>
    );
  };

  // UI
  return (
    <div className="animate-fade-in duration-300 border-[1px] border-[#162F47] rounded-xl shadow-2xl p-3 bg-gray-200">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-3">
            Quản lý yêu cầu chấm công
          </h1>
          <p className="text-gray-500 mt-2">
            Quản lý và xét duyệt các yêu cầu chấm công của nhân viên
          </p>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 border rounded-lg shadow mt-3 mb-3">
        {/* Search */}
        <div className="relative flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Tìm theo nhân viên
          </label>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Nhập tên nhân viên..."
              value={employeeKeyword}
              onChange={(e) => setEmployeeKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Tabs */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Trạng thái xử lý
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("PENDING")}
              className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                activeTab === "PENDING"
                  ? "bg-yellow-50 text-yellow-700 border-yellow-300"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              Chưa xử lý ({pendingCount})
            </button>

            <button
              onClick={() => setActiveTab("PROCESSED")}
              className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                activeTab === "PROCESSED"
                  ? "bg-green-50 text-green-700 border-green-300"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              Đã xử lý ({processedCount})
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-full overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 sticky top-0 z-10">
              <tr className="text-slate-700">
                <th className="text-left px-4 py-4">Nhân viên</th>
                <th className="text-left px-4 py-4">Ngày</th>
                <th className="text-left px-4 py-4">Thời gian</th>
                <th className="text-left px-4 py-4">Lý do</th>
                <th className="text-left px-4 py-4">Trạng thái</th>
                <th className="text-left px-4 py-4">Lý do từ chối</th>
                <th className="text-center px-4 py-4">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-10">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                filteredRequests.map((item) => {
                  const status = getStatus(item);

                  return (
                    <tr key={item.id} className="border-t hover:bg-slate-100">
                      <td className="px-4 py-4 font-semibold">
                        {getEmployeeName(item)}
                      </td>
                      <td className="px-4 py-4">{getDate(item)}</td>
                      <td className="px-4 py-4">{getCheckIn(item)} - {getCheckOut(item)}</td>
                      <td className="px-4 py-4">{getReason(item)}</td>
                      <td className="px-4 py-4">
                        {getStatusBadge(status)}
                      </td>
                      <td className="px-4 py-4 text-red-600">
                        {item?.rejectReason || "--"}
                      </td>

                      <td className="px-4 py-4">
                        {status === "PENDING" ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleApprove(item.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
                            >
                              <FiCheckCircle /> Duyệt
                            </button>

                            <button
                              onClick={() => {
                                setRejectingId(item.id);
                                setRejectReason("");
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
                            >
                              <FiXCircle /> Từ chối
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400">
                            Đã xử lý
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {rejectingId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 space-y-4">
            <div>
              <h2 className="text-lg font-bold">Từ chối yêu cầu</h2>
              <p className="text-sm text-gray-500">
                Vui lòng nhập lý do từ chối
              </p>
            </div>

            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối..."
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-red-100"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setRejectingId(null);
                  setRejectReason("");
                }}
                className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
              >
                Hủy
              </button>

              <button
                onClick={() => handleReject(rejectingId)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceRequestManagement;