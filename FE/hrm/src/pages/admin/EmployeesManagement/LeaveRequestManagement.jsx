/* eslint-disable react-hooks/rules-of-hooks */
// import React, { useEffect, useMemo, useState } from "react";
// import { Navigate } from "react-router-dom";
// import {
//   FiSearch,
//   FiCheckCircle,
//   FiXCircle,
//   FiClock,
//   FiRefreshCw,
// } from "react-icons/fi";
// import {
//   filterLeaveRequests,
//   reviewLeaveRequest,
// } from "../../../services/leave_requests/LeaveRequestsService";

// const removeVietnameseTones = (str = "") => {
//   return str
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .replace(/đ/g, "d")
//     .replace(/Đ/g, "D")
//     .toLowerCase();
// };

// const LeaveRequestManagement = () => {
//   const role = localStorage.getItem("role");
//   if (role !== "ADMIN" && role !== "HR" && role !== "MANAGER") {
//     return <Navigate to="/" replace />;
//   }

//   const [leaveRequests, setLeaveRequests] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("PENDING");
//   const [keyword, setKeyword] = useState("");
//   const [reviewingId, setReviewingId] = useState(null);

//   const fetchLeaveRequests = async () => {
//     setLoading(true);
//     try {
//       const res = await filterLeaveRequests({
//         page: 0,
//         size: 100,
//       });

//       // response thường là res.data.data hoặc res.data.data.content
//       const content =
//         res?.data?.content ||
//         res?.data?.items ||
//         res?.data?.data ||
//         res?.data ||
//         [];

//       setLeaveRequests(Array.isArray(content) ? content : []);
//     } catch (error) {
//       console.error("Lỗi lấy danh sách nghỉ phép:", error);
//       setLeaveRequests([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLeaveRequests();
//   }, []);

//   const filteredByKeyword = useMemo(() => {
//     const normalizedKeyword = removeVietnameseTones(keyword);

//     if (!normalizedKeyword) return leaveRequests;

//     return leaveRequests.filter((item) => {
//       const employeeName = removeVietnameseTones(
//         item.employeeName ||
//           item.employeeFullName ||
//           item.employee?.fullName ||
//           ""
//       );

//       return employeeName.includes(normalizedKeyword);
//     });
//   }, [keyword, leaveRequests]);

//   const pendingRequests = useMemo(() => {
//     return filteredByKeyword.filter((item) => item.status === "PENDING");
//   }, [filteredByKeyword]);

//   const processedRequests = useMemo(() => {
//     return filteredByKeyword.filter((item) =>
//       ["APPROVED", "REJECTED", "CANCELLED"].includes(item.status)
//     );
//   }, [filteredByKeyword]);

//   const currentList =
//     activeTab === "PENDING" ? pendingRequests : processedRequests;

//   const getStatusBadge = (status) => {
//     const styles = {
//       PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
//       APPROVED: "bg-green-100 text-green-700 border-green-200",
//       REJECTED: "bg-red-100 text-red-700 border-red-200",
//       CANCELLED: "bg-gray-100 text-gray-700 border-gray-200",
//     };

//     const labels = {
//       PENDING: "Chưa xử lý",
//       APPROVED: "Đã phê duyệt",
//       REJECTED: "Đã từ chối",
//       CANCELLED: "Đã hủy",
//     };

//     return (
//       <span
//         className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
//           styles[status] || "bg-gray-100 text-gray-700 border-gray-200"
//         }`}
//       >
//         {labels[status] || status}
//       </span>
//     );
//   };

//   const getLeaveTypeLabel = (type) => {
//     const labels = {
//       ANNUAL: "Nghỉ phép năm",
//       SICK: "Nghỉ ốm",
//       UNPAID: "Nghỉ không lương",
//       MATERNITY: "Nghỉ thai sản",
//       OTHER: "Khác",
//     };

//     return labels[type] || type || "--";
//   };

//   const handleApprove = async (id) => {
//     try {
//       setReviewingId(id);

//       await reviewLeaveRequest(id, {
//         action: "APPROVED",
//         note: "Đã phê duyệt",
//       });

//       await fetchLeaveRequests();
//     } catch (error) {
//       console.error("Lỗi phê duyệt:", error);
//       alert("Phê duyệt yêu cầu thất bại!");
//     } finally {
//       setReviewingId(null);
//     }
//   };

//   const handleReject = async (id) => {
//     const reason = prompt("Nhập lý do từ chối:");
//     if (!reason) return;

//     try {
//       setReviewingId(id);

//       await reviewLeaveRequest(id, {
//         action: "REJECTED",
//         note: reason,
//       });

//       await fetchLeaveRequests();
//     } catch (error) {
//       console.error("Lỗi từ chối:", error);
//       alert("Từ chối yêu cầu thất bại!");
//     } finally {
//       setReviewingId(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 px-3 md:px-6 py-6">
//       <div className="w-full max-w-screen-2xl mx-auto space-y-5">

//         {/* HEADER */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
//               Quản lý nghỉ phép
//             </h1>
//             <p className="text-sm text-gray-500">
//               Quản lý các yêu cầu nghỉ phép của nhân viên
//             </p>
//           </div>

//           <button
//             onClick={fetchLeaveRequests}
//             className="inline-flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 rounded-lg hover:bg-gray-50"
//           >
//             <FiRefreshCw />
//             Làm mới
//           </button>
//         </div>

//         {/* SEARCH + TAB */}
//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-4">
//           <div className="relative max-w-md">
//             <FiSearch className="absolute left-3 top-3 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Tìm theo tên nhân viên..."
//               value={keyword}
//               onChange={(e) => setKeyword(e.target.value)}
//               className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//             />
//           </div>

//           <div className="flex gap-2 flex-wrap">
//             <button
//               onClick={() => setActiveTab("PENDING")}
//               className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
//                 activeTab === "PENDING"
//                   ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
//                   : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//               }`}
//             >
//               Chưa xử lý ({pendingRequests.length})
//             </button>

//             <button
//               onClick={() => setActiveTab("PROCESSED")}
//               className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
//                 activeTab === "PROCESSED"
//                   ? "bg-green-100 text-green-700 border border-green-200"
//                   : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//               }`}
//             >
//               Đã xử lý ({processedRequests.length})
//             </button>
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[1100px] text-left">
//               <thead className="bg-gray-50 border-b border-gray-100">
//                 <tr>
//                   <th className="px-4 py-3 text-sm font-semibold text-gray-600">
//                     Nhân viên
//                   </th>
//                   <th className="px-4 py-3 text-sm font-semibold text-gray-600">
//                     Loại nghỉ
//                   </th>
//                   <th className="px-4 py-3 text-sm font-semibold text-gray-600">
//                     Từ ngày
//                   </th>
//                   <th className="px-4 py-3 text-sm font-semibold text-gray-600">
//                     Đến ngày
//                   </th>
//                   <th className="px-4 py-3 text-sm font-semibold text-gray-600">
//                     Số ngày
//                   </th>
//                   <th className="px-4 py-3 text-sm font-semibold text-gray-600">
//                     Lý do
//                   </th>
//                   <th className="px-4 py-3 text-sm font-semibold text-gray-600">
//                     Trạng thái
//                   </th>
//                   <th className="px-4 py-3 text-sm font-semibold text-gray-600 text-right">
//                     Thao tác
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-50">
//                 {loading ? (
//                   <tr>
//                     <td colSpan="8" className="text-center p-8 text-gray-400">
//                       Đang tải dữ liệu...
//                     </td>
//                   </tr>
//                 ) : currentList.length > 0 ? (
//                   currentList.map((item) => (
//                     <tr key={item.id} className="hover:bg-blue-50/30 transition">
//                       <td className="px-4 py-4 font-medium text-gray-900">
//                         {item.employeeName ||
//                           item.employeeFullName ||
//                           item.employee?.fullName ||
//                           "--"}
//                       </td>

//                       <td className="px-4 py-4 text-gray-600">
//                         {getLeaveTypeLabel(item.leaveType)}
//                       </td>

//                       <td className="px-4 py-4 text-gray-600">
//                         {item.startDate || "--"}
//                       </td>

//                       <td className="px-4 py-4 text-gray-600">
//                         {item.endDate || "--"}
//                       </td>

//                       <td className="px-4 py-4 text-gray-600">
//                         {item.totalDays || item.duration || "--"}
//                       </td>

//                       <td className="px-4 py-4 text-gray-600 max-w-[250px] truncate">
//                         {item.reason || "--"}
//                       </td>

//                       <td className="px-4 py-4">
//                         {getStatusBadge(item.status)}
//                       </td>

//                       <td className="px-4 py-4 text-right">
//                         {item.status === "PENDING" ? (
//                           <div className="flex justify-end gap-2">
//                             <button
//                               onClick={() => handleApprove(item.id)}
//                               disabled={reviewingId === item.id}
//                               className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-60"
//                             >
//                               <FiCheckCircle />
//                               Phê duyệt
//                             </button>

//                             <button
//                               onClick={() => handleReject(item.id)}
//                               disabled={reviewingId === item.id}
//                               className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-60"
//                             >
//                               <FiXCircle />
//                               Từ chối
//                             </button>
//                           </div>
//                         ) : (
//                           <span className="inline-flex items-center gap-1 text-gray-400 text-sm">
//                             <FiClock />
//                             Đã xử lý
//                           </span>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="text-center p-8 text-gray-400">
//                       Không có yêu cầu nghỉ phép phù hợp.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeaveRequestManagement;


import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiRefreshCw,
  FiUser,
} from "react-icons/fi";
import {
  getLeaveRequests,
  reviewLeaveRequest,
} from "../../../services/leave_requests/LeaveRequestsService";

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

      // backend trả PageDTO có thể là content/items/data
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
    return item?.leaveType || item?.type || "Nghỉ phép";
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
    <div className="min-h-screen bg-gray-50 px-3 md:px-6 py-6">
      <div className="w-full max-w-screen-2xl mx-auto space-y-5">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Quản lý nghỉ phép</h1>
            <p className="text-sm text-gray-500">
              Quản lý và xét duyệt các yêu cầu nghỉ phép của nhân viên
            </p>
          </div>

          <button
            onClick={fetchLeaveRequests}
            className="inline-flex items-center gap-2 border px-4 py-2 rounded-lg bg-white hover:bg-gray-50"
          >
            <FiRefreshCw />
            Làm mới
          </button>
        </div>

        {/* FILTER */}
        <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Tìm theo nhân viên
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nhập tên nhân viên... (VD: luan)"
                  value={employeeKeyword}
                  onChange={(e) => setEmployeeKeyword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100"
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
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-3">Nhân viên</th>
                  <th className="text-left px-4 py-3">Loại nghỉ</th>
                  <th className="text-left px-4 py-3">Từ ngày</th>
                  <th className="text-left px-4 py-3">Đến ngày</th>
                  <th className="text-left px-4 py-3">Lý do</th>
                  <th className="text-left px-4 py-3">Trạng thái</th>
                  <th className="text-left px-4 py-3">Lý do từ chối</th>
                  <th className="text-center px-4 py-3">Hành động</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center p-8 text-gray-500">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : filteredRequests.length > 0 ? (
                  filteredRequests.map((item) => {
                    const status = getStatus(item);

                    return (
                      <tr key={item.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">
                          {getEmployeeName(item)}
                        </td>
                        <td className="px-4 py-3">{getLeaveType(item)}</td>
                        <td className="px-4 py-3">{getStartDate(item)}</td>
                        <td className="px-4 py-3">{getEndDate(item)}</td>
                        <td className="px-4 py-3 max-w-[240px]">
                          <div className="truncate" title={getReason(item)}>
                            {getReason(item)}
                          </div>
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(status)}</td>
                        <td className="px-4 py-3 text-sm text-red-600">
                          {item?.rejectReason || "--"}
                        </td>

                        <td className="px-4 py-3">
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
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center p-8 text-gray-500">
                      Không có dữ liệu phù hợp
                    </td>
                  </tr>
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
    </div>
  );
};

export default LeaveRequestManagement;