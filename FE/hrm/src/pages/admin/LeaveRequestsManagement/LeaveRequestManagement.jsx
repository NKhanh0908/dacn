/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { FiCheckCircle, FiXCircle, FiSearch } from "react-icons/fi";
import { getLeaveRequests, reviewLeaveRequest,
} from "../../../services";

const removeVietnameseTones = (str = "") => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
};

const LeaveRequestManagement = () => {
  const role = localStorage.getItem("role");
  if (role !== "ADMIN" && role !== "HR" && role !== "MANAGER") {
    return <Navigate to="/" replace />;
  }

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("PENDING"); // PENDING | PROCESSED
  const [employeeKeyword, setEmployeeKeyword] = useState("");
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      const res = await getLeaveRequests({ page: 0, size: 100 });

      const rawData =
        res?.content || res?.items || res?.data || res || [];

      setLeaveRequests(Array.isArray(rawData) ? rawData : []);
    } catch (error) {
      console.error("Lỗi lấy danh sách nghỉ phép:", error);
      setLeaveRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const getEmployeeName = (item) => {
    return (
      item?.employeeName ||
      item?.employee?.fullName ||
      item?.employee?.name ||
      item?.employee?.employeeName ||
      "Không rõ"
    );
  };

  const getLeaveType = (item) => {
    const type = item?.leaveType || item?.type || "ANNUAL";

    const typeMap = {
      ANNUAL: "Nghỉ phép năm",
      ANNUAL_LEAVE: "Nghỉ phép năm",

      SICK: "Nghỉ ốm",
      SICK_LEAVE: "Nghỉ ốm",

      UNPAID: "Nghỉ không lương",
      UNPAID_LEAVE: "Nghỉ không lương",

      MATERNITY: "Nghỉ thai sản",
      MATERNITY_LEAVE: "Nghỉ thai sản",

      PATERNITY: "Nghỉ chăm con",
      PATERNITY_LEAVE: "Nghỉ chăm con",

      BEREAVEMENT: "Nghỉ tang",
      STUDY: "Nghỉ học",
      OTHER: "Khác",
    };

    return typeMap[type] || type;
  };
  const getReason = (item) => {
    return item?.reason || item?.description || "--";
  };

  const getStartDate = (item) => {
    return item?.startDate || item?.fromDate || "--";
  };

  const getEndDate = (item) => {
    return item?.endDate || item?.toDate || "--";
  };

  const getStatus = (item) => {
    return item?.status || "PENDING";
  };

  const filteredRequests = useMemo(() => {
    let data = [...leaveRequests];

    // chia tab
    if (activeTab === "PENDING") {
      data = data.filter((item) => getStatus(item) === "PENDING");
    } else {
      data = data.filter((item) => getStatus(item) !== "PENDING");
    }

    // tìm theo nhân viên (có hỗ trợ không dấu)
    if (employeeKeyword.trim()) {
      const keyword = removeVietnameseTones(employeeKeyword);

      data = data.filter((item) => {
        const employeeName = removeVietnameseTones(getEmployeeName(item));
        return employeeName.includes(keyword);
      });
    }

    return data;
  }, [leaveRequests, activeTab, employeeKeyword]);

  const pendingCount = leaveRequests.filter(
    (item) => getStatus(item) === "PENDING"
  ).length;

  const processedCount = leaveRequests.filter(
    (item) => getStatus(item) !== "PENDING"
  ).length;

  const handleApprove = async (id) => {
    try {
      await reviewLeaveRequest(id, {
        status: "APPROVED",
        rejectReason: null,
      });

      await fetchLeaveRequests();
      alert("Phê duyệt đơn nghỉ phép thành công");
    } catch (error) {
      console.error("Lỗi phê duyệt:", error);
      alert(
        error?.response?.data?.message ||
          "Phê duyệt thất bại. Kiểm tra lại dữ liệu backend."
      );
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }

    try {
      await reviewLeaveRequest(id, {
        status: "REJECTED",
        rejectReason: rejectReason.trim(),
      });

      setRejectingId(null);
      setRejectReason("");
      await fetchLeaveRequests();
      alert("Từ chối đơn nghỉ phép thành công");
    } catch (error) {
      console.error("Lỗi từ chối:", error);
      alert(
        error?.response?.data?.message ||
          "Từ chối thất bại. Kiểm tra lại dữ liệu backend."
      );
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
      APPROVED: "bg-green-100 text-green-700 border-green-200",
      REJECTED: "bg-red-100 text-red-700 border-red-200",
      CANCELLED: "bg-gray-100 text-gray-700 border-gray-200",
    };

    const labels = {
      PENDING: "Chưa xử lý",
      APPROVED: "Đã duyệt",
      REJECTED: "Đã từ chối",
      CANCELLED: "Đã hủy",
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

  return (
    <div className="overflow-y-auto h-[calc(100vh-100px)] pr-4 pb-4">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Quản lý nghỉ phép</h1>
            <p className="text-gray-500 mt-2">
              Quản lý và xét duyệt các yêu cầu nghỉ phép của nhân viên
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
                placeholder="Nhập tên nhân viên... (VD: luan)"
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
            <table className="w-full min-w-[1200px] text-sm">
              <thead className="bg-slate-100 sticky top-0 z-10">
                <tr className="text-slate-700">
                  <th className="text-left px-4 py-4 font-semibold">Nhân viên</th>
                  <th className="text-left px-4 py-4 font-semibold">Loại nghỉ</th>
                  <th className="text-left px-4 py-4 font-semibold">Từ ngày</th>
                  <th className="text-left px-4 py-4 font-semibold">Đến ngày</th>
                  <th className="text-left px-4 py-4 font-semibold">Lý do</th>
                  <th className="text-left px-4 py-4 font-semibold">Trạng thái</th>
                  <th className="text-left px-4 py-4 font-semibold">Lý do từ chối</th>
                  <th className="text-center px-4 py-4 font-semibold">Hành động</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center py-10 text-slate-500">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-10 text-slate-500">
                      Không có dữ liệu phù hợp
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((item) => {
                    const status = getStatus(item);

                    return (
                      <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-200 transition">
                        <td className="px-4 py-4 font-semibold text-slate-800">
                          {getEmployeeName(item)}
                        </td>
                        <td className="px-4 py-4">{getLeaveType(item)}</td>
                        <td className="px-4 py-4">{getStartDate(item)}</td>
                        <td className="px-4 py-4">{getEndDate(item)}</td>
                        <td className="px-4 py-4 max-w-[240px]">
                          <div className="truncate" title={getReason(item)}>
                            {getReason(item)}
                          </div>
                        </td>
                        <td className="px-4 py-4">{getStatusBadge(status)}</td>
                        <td className="px-4 py-4 text-sm text-red-600">
                          {item?.rejectReason || "--"}
                        </td>

                        <td className="px-4 py-4">
                          {status === "PENDING" ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleApprove(item.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
                              >
                                <FiCheckCircle />
                                Duyệt
                              </button>

                              <button
                                onClick={() => {
                                  setRejectingId(item.id);
                                  setRejectReason("");
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
                              >
                                <FiXCircle />
                                Từ chối
                              </button>
                            </div>
                          ) : (
                            <div className="text-center text-gray-400 text-sm">
                              Đã xử lý
                            </div>
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

        {/* MODAL TỪ CHỐI */}
        {rejectingId && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
            <div className="bg-white rounded-2xl w-full max-w-md p-5 space-y-4">
              <div>
                <h2 className="text-lg font-bold">Từ chối đơn nghỉ phép</h2>
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

export default LeaveRequestManagement;