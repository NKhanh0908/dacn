import { useState } from "react";
import { useLeaveRequestContext } from "../../context";
import { FiPlus, FiCalendar, FiGrid } from "react-icons/fi";

const LeaveRequestPage = () => {
  const {
    leaveRequests,
    loading,
    page,
    totalPages,
    setPage,
    submitLeaveRequest
  } = useLeaveRequestContext();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    leaveType: "ANNUAL",
    reason: ""
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setErrors(prev => ({ 
      ...prev, 
      [e.target.name]: "" 
    }));
  };

  const validate = () => {
    const newErrors = {};
    const today = new Date();

    const from = formData.fromDate ? new Date(formData.fromDate) : null;
    const to = formData.toDate ? new Date(formData.toDate) : null;

    if (!formData.fromDate) {
      newErrors.fromDate = "Không được để trống từ ngày";
    } else if (from < today) {
      newErrors.fromDate = "Ngày bắt đầu phải là hôm nay hoặc tương lai";
    }

    if (!formData.toDate) {
      newErrors.toDate = "Không được để trống đến ngày";
    } else if (from && to < from) {
      newErrors.toDate = "Ngày kết thúc không được trước ngày bắt đầu";
    }

    if (!formData.reason || formData.reason.trim() === "") {
      newErrors.reason = "Không được để trống lý do";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      startDate: formData.fromDate,   
      endDate: formData.toDate,       
      leaveType: formData.leaveType,
      duration: "FULL_DAY",
      reason: formData.reason,
      attachmentUrl: ""
    };

    await submitLeaveRequest(payload);

    setFormData({
      fromDate: "",
      toDate: "",
      leaveType: "ANNUAL",
      reason: ""
    });
    setShowForm(false);
    setPage(0);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const leaveTypeLabels = {
    ANNUAL: "Nghỉ phép năm",
    COMPENSATORY: "Nghỉ bù",
    SICK: "Nghỉ bệnh",
    MATERNITY: "Nghỉ thai sản",
    PATERNITY: "Nghỉ thai sản (nam)",
    MARRIAGE: "Nghỉ kết hôn",
    FUNERAL: "Nghỉ tang",
    UNPAID: "Nghỉ không lương",
    OTHER: "Khác"
  };

  return (
    <div className="overflow-y-auto h-[calc(100vh-100px)] pr-4">
      <div className="w-full mx-auto pb-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mt-2 mb-6">
          <h2 className="text-2xl font-bold">
            Đơn nghỉ phép
          </h2>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 text-l font-bold text-[#162F47] border border-[#162F47] rounded-lg p-2 hover:bg-[#162F47] hover:text-white"
          >
            <FiPlus />
            Tạo đơn
          </button>
        </div>

        {/* FORM */}
        {showForm && (
          <div className="border-2 border-[#162F47] rounded-2xl p-3 shadow-2xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="border-b-[1px] border-[#162F47]">
                <h3 className="font-semibold">Thông tin đơn nghỉ phép</h3>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-4">
                  <Input label="Từ ngày" type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} error={errors.fromDate} />
                  <Input label="Đến ngày" type="date" name="toDate" value={formData.toDate} onChange={handleChange} error={errors.toDate} />
                  <div>
                    <label className="text-xs font-semibold text-gray-500">Loại nghỉ</label>
                    <select
                      name="leaveType"
                      value={formData.leaveType}
                      onChange={handleChange}
                      className="w-full px-3 py-[10px] rounded-lg mt-1 outline-none cursor-pointer bg-white border border-gray-300"
                    >
                      <option value="ANNUAL">Nghỉ phép năm</option>
                      <option value="COMPENSATORY">Nghỉ bù</option>
                      <option value="SICK">Nghỉ bệnh</option>
                      <option value="MATERNITY">Nghỉ thai sản</option>
                      <option value="PATERNITY">Nghỉ thai sản (nam)</option>
                      <option value="MARRIAGE">Nghỉ kết hôn</option>
                      <option value="FUNERAL">Nghỉ tang</option>
                      <option value="UNPAID">Nghỉ không lương</option>
                      <option value="OTHER">Khác</option>
                    </select>
                  </div>
                </div>
                <div>
                  <TextArea name="reason" label="Lý do" value={formData.reason} onChange={handleChange} error={errors.reason} />
                </div>
              </div>

              <div className="flex gap-3">
                <button className="bg-[#162F47] text-white px-4 py-2 rounded-xl hover:bg-blue-500">
                  Gửi đơn
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LIST */}
        <div className="bg-white border-2 border-[#162F47] rounded-2xl p-3 shadow-2xl mt-6">

          <div className="flex items-center gap-2 mb-6 border-b border-[#162F47] pb-2">
            <FiGrid size={20} className="text-[#162F47]" />
            <span className="text-[#162F47] font-semibold text-lg">
              Danh sách đơn
            </span>
          </div>

          {loading ? (
            <div className="p-6 text-center">Đang tải...</div>
          ) : leaveRequests.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Chưa có đơn nào
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-200 text-gray-600 text-sm">
                    <tr>
                      <th className="p-3 text-left">Từ ngày</th>
                      <th className="p-3 text-left">Đến ngày</th>
                      <th className="p-3 text-left">Loại</th>
                      <th className="p-3 text-left">Lý do</th>
                      <th className="p-3 text-left">Trạng thái</th>
                    </tr>
                  </thead>

                  <tbody>
                    {[...leaveRequests]
                      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                      .map((req) => (
                      <tr 
                        key={req.id} 
                        className="border-b hover:bg-blue-200"
                      >
                        <td className="p-3 font-medium text-gray-700 flex items-center gap-2">
                          <FiCalendar />
                          {new Date(req.startDate).toLocaleDateString("vi-VN")}
                        </td>

                        <td className="p-3 font-medium text-gray-700">
                          {new Date(req.endDate).toLocaleDateString("vi-VN")}
                        </td>

                        <td className="p-3">
                          {leaveTypeLabels[req.leaveType] || req.leaveType}
                        </td>

                        <td className="p-3">{req.reason || "-"}</td>

                        <td className="p-3">
                          <span className={`px-3 py-1 rounded text-sm ${getStatusStyle(req.status)}`}>
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="flex justify-between items-center mt-6">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                  className={`px-4 py-2 rounded-lg border text-sm
                    ${
                      page === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-blue-100"
                    }`}
                >
                  Prev
                </button>

                <div className="text-sm text-gray-500">
                  Trang {page + 1} / {totalPages}
                </div>

                <button
                  disabled={page + 1 === totalPages}
                  onClick={() => setPage(page + 1)}
                  className={`px-4 py-2 rounded-lg border text-sm
                    ${
                      page === totalPages - 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-blue-100"
                    }`}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ================= COMPONENT =================
const Input = ({ label, error, ...props }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500">{label}</label>

    <input
      {...props}
      className={`w-full px-3 py-2 border rounded-lg mt-1 outline-none ${
        error ? "border-red-500 focus:ring-2 focus:ring-red-300" : "border-gray-300"
      }`}
    />

    {error && (
      <p className="text-red-500 text-xs mt-1">{error}</p>
    )}
  </div>
);

const TextArea = ({ label, error, className = "", ...props }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500">{label}</label>

    <textarea
      {...props}
      className={`w-full px-3 py-2 h-[50px] border rounded-lg mt-1 outline-none ${
        error ? "border-red-500 focus:ring-2 focus:ring-red-300" : "border-gray-300"
      } ${className}`}
      rows={3}
    />

    {error && (
      <p className="text-red-500 text-xs mt-1">{error}</p>
    )}
  </div>
);

export default LeaveRequestPage;