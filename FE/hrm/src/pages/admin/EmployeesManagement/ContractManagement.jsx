/* eslint-disable react-hooks/rules-of-hooks */
// import React, { useEffect, useMemo, useState } from "react";
// import { Navigate } from "react-router-dom";
// import {
//   FiSearch,
//   FiEye,
//   FiEdit2,
//   FiTrash2,
//   FiFileText,
//   FiX,
//   FiCheckCircle,
//   FiSlash,
//   FiRefreshCw,
// } from "react-icons/fi";

// import {
//   filterContracts,
//   getContractById,
//   updateContract,
//   deleteContract,
//   signContract,
//   terminateContract,
// } from "../../../services/contract/ContractService";


// // ===== Helpers =====
// const removeVietnameseTones = (str = "") => {
//   return str
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .replace(/đ/g, "d")
//     .replace(/Đ/g, "D")
//     .toLowerCase();
// };

// const formatDate = (date) => {
//   if (!date) return "--";
//   return new Date(date).toLocaleDateString("vi-VN");
// };

// const formatCurrency = (amount) => {
//   if (amount === null || amount === undefined || amount === "") return "--";
//   return Number(amount).toLocaleString("vi-VN") + " đ";
// };

// const ContractManagement = () => {
//   const role = localStorage.getItem("role");
//   if (role !== "ADMIN" && role !== "HR") {
//     return <Navigate to="/" replace />;
//   }

//   const [contracts, setContracts] = useState([]);
//   const [filteredContracts, setFilteredContracts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Filters
//   const [keyword, setKeyword] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [contractTypeFilter, setContractTypeFilter] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   // Detail Modal
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [selectedContract, setSelectedContract] = useState(null);

//   // Edit Modal
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingContract, setEditingContract] = useState(null);

//   // Terminate Modal
//   const [showTerminateModal, setShowTerminateModal] = useState(false);
//   const [terminateData, setTerminateData] = useState({
//     terminationDate: "",
//     reason: "",
//   });

//   const STATUS_LABELS = {
//     ACTIVE: "Đang hiệu lực",
//     CANCELLED: "Đã huỷ",
//     DRAFT: "Nháp",
//     EXPIRED: "Hết hạn",
//     PENDING_SIGNATURE: "Chờ ký",
//     TERMINATED: "Đã chấm dứt",
//   };

//   const TYPE_LABELS = {
//     FIXED_TERM: "Xác định thời hạn",
//     INDEFINITE_TERM: "Không xác định thời hạn",
//     PROBATION: "Thử việc",
//   };

//   const getStatusBadge = (status) => {
//     const styles = {
//       ACTIVE: "bg-green-100 text-green-700 border-green-200",
//       CANCELLED: "bg-red-100 text-red-700 border-red-200",
//       DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
//       EXPIRED: "bg-yellow-100 text-yellow-700 border-yellow-200",
//       PENDING_SIGNATURE: "bg-blue-100 text-blue-700 border-blue-200",
//       TERMINATED: "bg-orange-100 text-orange-700 border-orange-200",
//     };

//     return (
//       <span
//         className={`px-2 py-1 rounded-full text-xs border ${
//           styles[status] || "bg-gray-100 text-gray-700 border-gray-200"
//         }`}
//       >
//         {STATUS_LABELS[status] || status}
//       </span>
//     );
//   };

//   const fetchContracts = async () => {
//     setLoading(true);
//     try {
//       const params = {
//         page: 0,
//         size: 100,
//       };

//       // Chỉ add nếu backend có hỗ trợ
//       if (statusFilter) params.status = statusFilter;
//       if (contractTypeFilter) params.contractType = contractTypeFilter;
//       if (fromDate) params.startDateFrom = fromDate;
//       if (toDate) params.startDateTo = toDate;

//       const res = await filterContracts(params);
//       const data = res?.data?.content || [];

//       setContracts(data);
//     } catch (error) {
//       console.error("Lỗi lấy danh sách hợp đồng:", error);
//       alert("Không thể tải danh sách hợp đồng");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchContracts();
//   }, [statusFilter, contractTypeFilter, fromDate, toDate]);

//   useEffect(() => {
//     let result = [...contracts];

//     if (keyword.trim()) {
//       const kw = removeVietnameseTones(keyword);
//       result = result.filter((c) => {
//         const employeeName = removeVietnameseTones(c.employeeName || "");
//         const contractCode = removeVietnameseTones(c.contractCode || "");
//         const position = removeVietnameseTones(c.position || "");
//         const title = removeVietnameseTones(c.title || "");

//         return (
//           employeeName.includes(kw) ||
//           contractCode.includes(kw) ||
//           position.includes(kw) ||
//           title.includes(kw)
//         );
//       });
//     }

//     setFilteredContracts(result);
//   }, [keyword, contracts]);

//   const handleViewDetail = async (contract) => {
//     try {
//       const res = await getContractById(contract.id);
//       setSelectedContract(res?.data || contract);
//       setShowDetailModal(true);
//     } catch (error) {
//       console.error("Lỗi lấy chi tiết hợp đồng:", error);
//       alert("Không thể lấy chi tiết hợp đồng");
//     }
//   };

//   const handleOpenEdit = (contract) => {
//     setEditingContract({
//       id: contract.id,
//       title: contract.title || "",
//       contractType: contract.contractType || "",
//       startDate: contract.startDate || "",
//       endDate: contract.endDate || "",
//       salary: contract.salary || "",
//       jobDescription: contract.jobDescription || "",
//       status: contract.status || "",
//     });
//     setShowEditModal(true);
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditingContract((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         title: editingContract.title,
//         contractType: editingContract.contractType,
//         startDate: editingContract.startDate,
//         endDate: editingContract.endDate || null,
//         salary: editingContract.salary ? Number(editingContract.salary) : null,
//         jobDescription: editingContract.jobDescription,
//         status: editingContract.status,
//       };

//       await updateContract(editingContract.id, payload);
//       alert("Cập nhật hợp đồng thành công");
//       setShowEditModal(false);
//       fetchContracts();
//     } catch (error) {
//       console.error("Lỗi cập nhật hợp đồng:", error);
//       alert(
//         error?.response?.data?.message || "Cập nhật hợp đồng thất bại"
//       );
//     }
//   };

//   const handleDelete = async (contractId) => {
//     const confirmDelete = window.confirm("Bạn có chắc muốn xoá hợp đồng này?");
//     if (!confirmDelete) return;

//     try {
//       await deleteContract(contractId);
//       alert("Xoá hợp đồng thành công");
//       fetchContracts();
//     } catch (error) {
//       console.error("Lỗi xoá hợp đồng:", error);
//       alert(error?.response?.data?.message || "Xoá hợp đồng thất bại");
//     }
//   };

//   const handleSign = async (contract) => {
//     try {
//       // ⚠️ body này cần chỉnh theo đúng ContractSignRequest của backend
//       await signContract(contract.id, {
//         signedBy: "EMPLOYER",
//       });

//       alert("Ký hợp đồng thành công");
//       fetchContracts();
//     } catch (error) {
//       console.error("Lỗi ký hợp đồng:", error);
//       alert(error?.response?.data?.message || "Ký hợp đồng thất bại");
//     }
//   };

//   const openTerminateModal = (contract) => {
//     setSelectedContract(contract);
//     setTerminateData({
//       terminationDate: "",
//       reason: "",
//     });
//     setShowTerminateModal(true);
//   };

//   const handleTerminate = async (e) => {
//     e.preventDefault();

//     if (!selectedContract) return;

//     try {
//       // ⚠️ body này cần chỉnh theo đúng ContractTerminateRequest của backend
//       await terminateContract(selectedContract.id, {
//         terminationDate: terminateData.terminationDate,
//         reason: terminateData.reason,
//       });

//       alert("Chấm dứt hợp đồng thành công");
//       setShowTerminateModal(false);
//       fetchContracts();
//     } catch (error) {
//       console.error("Lỗi chấm dứt hợp đồng:", error);
//       alert(
//         error?.response?.data?.message || "Chấm dứt hợp đồng thất bại"
//       );
//     }
//   };

//   const resetFilters = () => {
//     setKeyword("");
//     setStatusFilter("");
//     setContractTypeFilter("");
//     setFromDate("");
//     setToDate("");
//   };

//   const totalContracts = useMemo(() => filteredContracts.length, [filteredContracts]);

//   return (
//     <div className="min-h-screen bg-gray-50 px-3 md:px-6 py-6">
//       <div className="w-full max-w-screen-2xl mx-auto space-y-5">
//         {/* HEADER */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//           <div>
//             <h1 className="text-2xl font-bold">Quản lý hợp đồng</h1>
//             <p className="text-sm text-gray-500 mt-1">
//               Tổng số hợp đồng: <span className="font-semibold">{totalContracts}</span>
//             </p>
//           </div>

//           <button
//             onClick={() => {
//               resetFilters();
//               fetchContracts();
//             }}
//             className="border px-4 py-2 rounded-lg bg-white hover:bg-gray-50 flex items-center gap-2"
//           >
//             <FiRefreshCw />
//             Reset
//           </button>
//         </div>

//         {/* FILTER */}
//         <div className="bg-white p-4 rounded-xl grid md:grid-cols-5 gap-4">
//           <div className="md:col-span-2">
//             <label className="text-sm block mb-1">Tìm kiếm</label>
//             <div className="relative">
//               <FiSearch className="absolute left-3 top-3 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Tên NV / mã HĐ / chức danh..."
//                 value={keyword}
//                 onChange={(e) => setKeyword(e.target.value)}
//                 className="w-full pl-10 pr-3 py-2 border rounded-lg"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="text-sm block mb-1">Trạng thái</label>
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="w-full border p-2 rounded-lg"
//             >
//               <option value="">Tất cả</option>
//               <option value="ACTIVE">Đang hiệu lực</option>
//               <option value="PENDING_SIGNATURE">Chờ ký</option>
//               <option value="EXPIRED">Hết hạn</option>
//               <option value="TERMINATED">Đã chấm dứt</option>
//               <option value="DRAFT">Nháp</option>
//               <option value="CANCELLED">Đã huỷ</option>
//             </select>
//           </div>

//           <div>
//             <label className="text-sm block mb-1">Loại hợp đồng</label>
//             <select
//               value={contractTypeFilter}
//               onChange={(e) => setContractTypeFilter(e.target.value)}
//               className="w-full border p-2 rounded-lg"
//             >
//               <option value="">Tất cả</option>
//               <option value="FIXED_TERM">Xác định thời hạn</option>
//               <option value="INDEFINITE_TERM">Không xác định thời hạn</option>
//               <option value="PROBATION">Thử việc</option>
//             </select>
//           </div>

//           <div>
//             <label className="text-sm block mb-1">Từ ngày</label>
//             <input
//               type="date"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               className="w-full border p-2 rounded-lg"
//             />
//           </div>

//           <div>
//             <label className="text-sm block mb-1">Đến ngày</label>
//             <input
//               type="date"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               className="w-full border p-2 rounded-lg"
//             />
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="bg-white rounded-xl overflow-hidden shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[1100px]">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="text-left px-4 py-3">Mã HĐ</th>
//                   <th className="text-left px-4 py-3">Nhân viên</th>
//                   <th className="text-left px-4 py-3">Tiêu đề</th>
//                   <th className="text-left px-4 py-3">Loại</th>
//                   <th className="text-left px-4 py-3">Ngày bắt đầu</th>
//                   <th className="text-left px-4 py-3">Ngày kết thúc</th>
//                   <th className="text-left px-4 py-3">Lương</th>
//                   <th className="text-left px-4 py-3">Trạng thái</th>
//                   <th className="text-center px-4 py-3">Thao tác</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="9" className="text-center p-6">
//                       Đang tải...
//                     </td>
//                   </tr>
//                 ) : filteredContracts.length > 0 ? (
//                   filteredContracts.map((c) => (
//                     <tr key={c.id} className="border-t hover:bg-gray-50">
//                       <td className="px-4 py-3 font-medium">{c.contractCode || `HD-${c.id}`}</td>
//                       <td className="px-4 py-3">{c.employeeName || "--"}</td>
//                       <td className="px-4 py-3">{c.title || "--"}</td>
//                       <td className="px-4 py-3">
//                         {TYPE_LABELS[c.contractType] || c.contractType || "--"}
//                       </td>
//                       <td className="px-4 py-3">{formatDate(c.startDate)}</td>
//                       <td className="px-4 py-3">{formatDate(c.endDate)}</td>
//                       <td className="px-4 py-3">{formatCurrency(c.salary)}</td>
//                       <td className="px-4 py-3">{getStatusBadge(c.status)}</td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center justify-center gap-2 flex-wrap">
//                           <button
//                             onClick={() => handleViewDetail(c)}
//                             className="p-2 rounded-lg border hover:bg-gray-100"
//                             title="Xem chi tiết"
//                           >
//                             <FiEye />
//                           </button>

//                           <button
//                             onClick={() => handleOpenEdit(c)}
//                             className="p-2 rounded-lg border hover:bg-blue-50 text-blue-600"
//                             title="Chỉnh sửa"
//                           >
//                             <FiEdit2 />
//                           </button>

//                           {c.status === "PENDING_SIGNATURE" && (
//                             <button
//                               onClick={() => handleSign(c)}
//                               className="p-2 rounded-lg border hover:bg-green-50 text-green-600"
//                               title="Ký hợp đồng"
//                             >
//                               <FiCheckCircle />
//                             </button>
//                           )}

//                           {(c.status === "ACTIVE" || c.status === "PENDING_SIGNATURE") && (
//                             <button
//                               onClick={() => openTerminateModal(c)}
//                               className="p-2 rounded-lg border hover:bg-orange-50 text-orange-600"
//                               title="Chấm dứt"
//                             >
//                               <FiSlash />
//                             </button>
//                           )}

//                           <button
//                             onClick={() => handleDelete(c.id)}
//                             className="p-2 rounded-lg border hover:bg-red-50 text-red-600"
//                             title="Xoá"
//                           >
//                             <FiTrash2 />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="9" className="text-center p-6">
//                       Không có dữ liệu
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* DETAIL MODAL */}
//         {showDetailModal && selectedContract && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
//             <div className="bg-white p-5 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-5">
//                 <h2 className="font-bold text-xl flex items-center gap-2">
//                   <FiFileText />
//                   Chi tiết hợp đồng
//                 </h2>
//                 <button onClick={() => setShowDetailModal(false)}>
//                   <FiX size={22} />
//                 </button>
//               </div>

//               <div className="grid md:grid-cols-2 gap-4 text-sm">
//                 <Info label="Mã hợp đồng" value={selectedContract.contractCode || `HD-${selectedContract.id}`} />
//                 <Info label="Nhân viên" value={selectedContract.employeeName || "--"} />
//                 <Info label="Tiêu đề" value={selectedContract.title || "--"} />
//                 <Info
//                   label="Loại hợp đồng"
//                   value={TYPE_LABELS[selectedContract.contractType] || selectedContract.contractType || "--"}
//                 />
//                 <Info label="Ngày bắt đầu" value={formatDate(selectedContract.startDate)} />
//                 <Info label="Ngày kết thúc" value={formatDate(selectedContract.endDate)} />
//                 <Info label="Lương" value={formatCurrency(selectedContract.salary)} />
//                 <Info label="Trạng thái" value={STATUS_LABELS[selectedContract.status] || selectedContract.status || "--"} />
//                 <Info label="Chức vụ" value={selectedContract.position || "--"} />
//                 <Info label="Phòng ban" value={selectedContract.departmentName || "--"} />
//               </div>

//               <div className="mt-5">
//                 <p className="text-sm font-medium mb-2">Mô tả công việc</p>
//                 <div className="border rounded-xl p-3 bg-gray-50 text-sm whitespace-pre-wrap">
//                   {selectedContract.jobDescription || "Không có mô tả"}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* EDIT MODAL */}
//         {showEditModal && editingContract && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
//             <div className="bg-white p-5 rounded-2xl w-full max-w-2xl">
//               <div className="flex justify-between items-center mb-5">
//                 <h2 className="font-bold text-xl">Cập nhật hợp đồng</h2>
//                 <button onClick={() => setShowEditModal(false)}>
//                   <FiX size={22} />
//                 </button>
//               </div>

//               <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-4">
//                 <div className="md:col-span-2">
//                   <label className="text-sm block mb-1">Tiêu đề</label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={editingContract.title}
//                     onChange={handleEditChange}
//                     className="w-full border p-2 rounded-lg"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm block mb-1">Loại hợp đồng</label>
//                   <select
//                     name="contractType"
//                     value={editingContract.contractType}
//                     onChange={handleEditChange}
//                     className="w-full border p-2 rounded-lg"
//                   >
//                     <option value="FIXED_TERM">Xác định thời hạn</option>
//                     <option value="INDEFINITE_TERM">Không xác định thời hạn</option>
//                     <option value="PROBATION">Thử việc</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="text-sm block mb-1">Trạng thái</label>
//                   <select
//                     name="status"
//                     value={editingContract.status}
//                     onChange={handleEditChange}
//                     className="w-full border p-2 rounded-lg"
//                   >
//                     <option value="DRAFT">Nháp</option>
//                     <option value="PENDING_SIGNATURE">Chờ ký</option>
//                     <option value="ACTIVE">Đang hiệu lực</option>
//                     <option value="EXPIRED">Hết hạn</option>
//                     <option value="TERMINATED">Đã chấm dứt</option>
//                     <option value="CANCELLED">Đã huỷ</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="text-sm block mb-1">Ngày bắt đầu</label>
//                   <input
//                     type="date"
//                     name="startDate"
//                     value={editingContract.startDate || ""}
//                     onChange={handleEditChange}
//                     className="w-full border p-2 rounded-lg"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm block mb-1">Ngày kết thúc</label>
//                   <input
//                     type="date"
//                     name="endDate"
//                     value={editingContract.endDate || ""}
//                     onChange={handleEditChange}
//                     className="w-full border p-2 rounded-lg"
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="text-sm block mb-1">Lương</label>
//                   <input
//                     type="number"
//                     name="salary"
//                     value={editingContract.salary || ""}
//                     onChange={handleEditChange}
//                     className="w-full border p-2 rounded-lg"
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="text-sm block mb-1">Mô tả công việc</label>
//                   <textarea
//                     name="jobDescription"
//                     rows={4}
//                     value={editingContract.jobDescription || ""}
//                     onChange={handleEditChange}
//                     className="w-full border p-2 rounded-lg"
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
//                     Lưu cập nhật
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* TERMINATE MODAL */}
//         {showTerminateModal && selectedContract && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
//             <div className="bg-white p-5 rounded-2xl w-full max-w-lg">
//               <div className="flex justify-between items-center mb-5">
//                 <h2 className="font-bold text-xl">Chấm dứt hợp đồng</h2>
//                 <button onClick={() => setShowTerminateModal(false)}>
//                   <FiX size={22} />
//                 </button>
//               </div>

//               <form onSubmit={handleTerminate} className="space-y-4">
//                 <div>
//                   <label className="text-sm block mb-1">Ngày chấm dứt</label>
//                   <input
//                     type="date"
//                     value={terminateData.terminationDate}
//                     onChange={(e) =>
//                       setTerminateData((prev) => ({
//                         ...prev,
//                         terminationDate: e.target.value,
//                       }))
//                     }
//                     className="w-full border p-2 rounded-lg"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm block mb-1">Lý do</label>
//                   <textarea
//                     rows={4}
//                     value={terminateData.reason}
//                     onChange={(e) =>
//                       setTerminateData((prev) => ({
//                         ...prev,
//                         reason: e.target.value,
//                       }))
//                     }
//                     className="w-full border p-2 rounded-lg"
//                     placeholder="Nhập lý do chấm dứt..."
//                     required
//                   />
//                 </div>

//                 <button className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700">
//                   Xác nhận chấm dứt
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const Info = ({ label, value }) => (
//   <div className="border rounded-xl p-3 bg-gray-50">
//     <p className="text-xs text-gray-500 mb-1">{label}</p>
//     <p className="font-medium">{value || "--"}</p>
//   </div>
// );

// export default ContractManagement;

import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiSlash,
  FiFileText,
} from "react-icons/fi";
import {
  filterContracts,
  getContractById,
  deleteContract,
  terminateContract,
} from "../../../services/contract/ContractService";

const CONTRACT_TYPE_LABEL = {
  PROBATION: "Thử việc",
  FIXED_TERM: "Xác định thời hạn",
  INDEFINITE_TERM: "Không xác định thời hạn",
};

const CONTRACT_STATUS_LABEL = {
  DRAFT: "Nháp",
  PENDING_SIGNATURE: "Chờ ký",
  ACTIVE: "Đang hiệu lực",
  EXPIRED: "Hết hạn",
  TERMINATED: "Đã chấm dứt",
  CANCELLED: "Đã hủy",
};

const CONTRACT_STATUS_STYLE = {
  DRAFT: "bg-slate-100 text-slate-700 border-slate-200",
  PENDING_SIGNATURE: "bg-amber-100 text-amber-700 border-amber-200",
  ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  EXPIRED: "bg-gray-100 text-gray-700 border-gray-200",
  TERMINATED: "bg-rose-100 text-rose-700 border-rose-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

const formatDate = (value) => {
  if (!value) return "--";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("vi-VN");
};

const formatMoney = (value) => {
  if (value === null || value === undefined) return "--";
  return Number(value).toLocaleString("vi-VN") + " đ";
};

const ContractManagement = () => {
  const role = localStorage.getItem("role");
  if (role !== "ADMIN" && role !== "HR") return <Navigate to="/" replace />;

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [contractType, setContractType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [selectedContract, setSelectedContract] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const params = {
        page: 0,
        size: 100,
      };

      if (keyword.trim()) params.keyword = keyword.trim();
      if (status) params.status = status;
      if (contractType) params.contractType = contractType;
      if (fromDate) params.startDateFrom = fromDate;
      if (toDate) params.startDateTo = toDate;

      const res = await filterContracts(params);
      const data = res?.data?.content || [];
      setContracts(data);
    } catch (error) {
      console.error("Lỗi lấy danh sách hợp đồng:", error);
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const filteredContracts = useMemo(() => {
    const kw = keyword.trim().toLowerCase();

    return contracts.filter((c) => {
      const employeeName = c.employeeName?.toLowerCase() || "";
      const contractCode = c.contractCode?.toLowerCase() || "";
      const title = c.title?.toLowerCase() || "";

      const matchKeyword =
        !kw ||
        employeeName.includes(kw) ||
        contractCode.includes(kw) ||
        title.includes(kw);

      const matchStatus = !status || c.status === status;
      const matchType = !contractType || c.contractType === contractType;

      return matchKeyword && matchStatus && matchType;
    });
  }, [contracts, keyword, status, contractType]);

  const handleReset = () => {
    setKeyword("");
    setStatus("");
    setContractType("");
    setFromDate("");
    setToDate("");
    fetchContracts();
  };

  const handleViewDetail = async (id) => {
    try {
      const res = await getContractById(id);
      setSelectedContract(res?.data || null);
      setShowDetail(true);
    } catch (error) {
      console.error("Lỗi lấy chi tiết hợp đồng:", error);
      alert("Không thể lấy chi tiết hợp đồng");
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Bạn có chắc muốn xóa hợp đồng này?");
    if (!ok) return;

    try {
      await deleteContract(id);
      alert("Xóa hợp đồng thành công");
      fetchContracts();
    } catch (error) {
      console.error("Lỗi xóa hợp đồng:", error);
      alert("Không thể xóa hợp đồng");
    }
  };

  const handleTerminate = async (id) => {
    const ok = window.confirm("Bạn có chắc muốn chấm dứt hợp đồng này?");
    if (!ok) return;

    try {
      await terminateContract(id);
      alert("Chấm dứt hợp đồng thành công");
      fetchContracts();
    } catch (error) {
      console.error("Lỗi chấm dứt hợp đồng:", error);
      alert("Không thể chấm dứt hợp đồng");
    }
  };

  return (
    <div className="h-full flex flex-col gap-5">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Quản lý hợp đồng</h1>
          <p className="text-slate-500 mt-1">
            Tổng số hợp đồng:{" "}
            <span className="font-semibold text-slate-700">
              {filteredContracts.length}
            </span>
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2.5 rounded-xl hover:bg-slate-50 shadow-sm"
        >
          <FiRefreshCw />
          Reset
        </button>
      </div>

      {/* FILTER */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-2">
            <label className="text-sm font-medium text-slate-600 mb-2 block">
              Tìm kiếm
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Tên NV / mã HĐ / chức danh..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 mb-2 block">
              Trạng thái
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full py-3 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Tất cả</option>
              <option value="PENDING_SIGNATURE">Chờ ký</option>
              <option value="ACTIVE">Đang hiệu lực</option>
              <option value="EXPIRED">Hết hạn</option>
              <option value="TERMINATED">Đã chấm dứt</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 mb-2 block">
              Loại hợp đồng
            </label>
            <select
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              className="w-full py-3 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Tất cả</option>
              <option value="PROBATION">Thử việc</option>
              <option value="FIXED_TERM">Xác định thời hạn</option>
              <option value="INDEFINITE_TERM">Không xác định thời hạn</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={fetchContracts}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-sm"
          >
            Lọc dữ liệu
          </button>
        </div>
      </div>

      {/* TABLE WRAPPER */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-full overflow-auto">
          <table className="w-full min-w-[1200px] text-sm">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr className="text-slate-700">
                <th className="text-left px-4 py-4 font-semibold">Mã HĐ</th>
                <th className="text-left px-4 py-4 font-semibold">Nhân viên</th>
                <th className="text-left px-4 py-4 font-semibold">Tiêu đề</th>
                <th className="text-left px-4 py-4 font-semibold">Loại</th>
                <th className="text-left px-4 py-4 font-semibold">Ngày bắt đầu</th>
                <th className="text-left px-4 py-4 font-semibold">Ngày kết thúc</th>
                <th className="text-left px-4 py-4 font-semibold">Lương</th>
                <th className="text-left px-4 py-4 font-semibold">Trạng thái</th>
                <th className="text-center px-4 py-4 font-semibold">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-slate-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-slate-500">
                    Không có hợp đồng nào
                  </td>
                </tr>
              ) : (
                filteredContracts.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-4 font-semibold text-slate-800">
                      {c.contractCode || `HD-${c.id}`}
                    </td>
                    <td className="px-4 py-4">{c.employeeName || "--"}</td>
                    <td className="px-4 py-4">{c.title || "--"}</td>
                    <td className="px-4 py-4">
                      {CONTRACT_TYPE_LABEL[c.contractType] || c.contractType || "--"}
                    </td>
                    <td className="px-4 py-4">{formatDate(c.startDate)}</td>
                    <td className="px-4 py-4">{formatDate(c.endDate)}</td>
                    <td className="px-4 py-4">{formatMoney(c.salary)}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs border ${
                          CONTRACT_STATUS_STYLE[c.status] ||
                          "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {CONTRACT_STATUS_LABEL[c.status] || c.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleViewDetail(c.id)}
                          className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100"
                          title="Xem chi tiết"
                        >
                          <FiEye />
                        </button>

                        <button
                          className="p-2 rounded-lg border border-blue-200 text-blue-600 bg-white hover:bg-blue-50"
                          title="Sửa"
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          onClick={() => handleTerminate(c.id)}
                          className="p-2 rounded-lg border border-orange-200 text-orange-600 bg-white hover:bg-orange-50"
                          title="Chấm dứt"
                        >
                          <FiSlash />
                        </button>

                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-2 rounded-lg border border-red-200 text-red-600 bg-white hover:bg-red-50"
                          title="Xóa"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CHI TIẾT */}
      {showDetail && selectedContract && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                  <FiFileText size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Chi tiết hợp đồng
                  </h2>
                  <p className="text-sm text-slate-500">
                    {selectedContract.contractCode || `HD-${selectedContract.id}`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDetail(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                Đóng
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
              <Info label="Mã hợp đồng" value={selectedContract.contractCode || `HD-${selectedContract.id}`} />
              <Info label="Nhân viên" value={selectedContract.employeeName} />
              <Info label="Tiêu đề" value={selectedContract.title} />
              <Info label="Loại hợp đồng" value={CONTRACT_TYPE_LABEL[selectedContract.contractType] || selectedContract.contractType} />
              <Info label="Ngày bắt đầu" value={formatDate(selectedContract.startDate)} />
              <Info label="Ngày kết thúc" value={formatDate(selectedContract.endDate)} />
              <Info label="Lương" value={formatMoney(selectedContract.salary)} />
              <Info label="Trạng thái" value={CONTRACT_STATUS_LABEL[selectedContract.status] || selectedContract.status} />
              <Info label="Mô tả công việc" value={selectedContract.jobDescription || "--"} full />
              <Info label="Ghi chú" value={selectedContract.note || "--"} full />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Info = ({ label, value, full = false }) => (
  <div className={full ? "md:col-span-2" : ""}>
    <p className="text-slate-500 mb-1">{label}</p>
    <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-slate-800">
      {value || "--"}
    </div>
  </div>
);

export default ContractManagement;