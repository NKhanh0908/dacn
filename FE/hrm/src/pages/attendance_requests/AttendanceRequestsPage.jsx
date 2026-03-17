import { useState } from "react";
import { useAttendanceRequestContext } from "../../context/AttendanceRequestContext";
import { FiPlus, FiClock, FiCalendar, FiGrid } from "react-icons/fi";

const AttendanceRequestPage = () => {

  const {
    myRequests,
    loading,
    submitAttendanceRequest
  } = useAttendanceRequestContext();

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    requestDate: "",
    checkInTime: "",
    checkOutTime: "",
    requestType: "FORGOT_CHECK_IN",
    reason: ""
  });

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(myRequests.length / pageSize);

  const paginatedRequests = myRequests.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      requestDate: formData.requestDate,
      checkInTime: formData.checkInTime,
      checkOutTime: formData.checkOutTime,
      requestType: formData.requestType,
      reason: formData.reason
    };

    console.log("Submit payload:", payload);

    await submitAttendanceRequest(payload);

    setFormData({
      requestDate: "",
      checkInTime: "",
      checkOutTime: "",
      requestType: "FORGOT_CHECK_IN",
      reason: ""
    });

    setShowForm(false);

    // quay về trang đầu
    setPage(1);
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

  return (
    <div className="overflow-y-auto h-[calc(100vh-100px)] pr-4">
      <div className="w-full mx-auto pb-4">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center mt-2 mb-6">
          <h2 className="text-2xl font-bold">
            Yêu cầu chấm công
          </h2>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 text-l font-bold text-[#162F47] border border-[#162F47] rounded-lg p-2 hover:bg-[#162F47] hover:text-white"
          >
            <FiPlus />
            Tạo yêu cầu
          </button>
        </div>

        {/* FORM */}
        {showForm && (
          <div className="border-2 border-[#162F47] rounded-2xl p-3 shadow-2xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-[#162F47] pb-2">
                <span className="text-[#162F47] font-semibold text-lg">
                  Thông tin yêu cầu
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-1/4">
                  <label className="font-semibold w-1/2">Ngày</label>
                  <input
                    type="date"
                    name="requestDate"
                    value={formData.requestDate}
                    onChange={handleChange}
                    className="w-full border-[1px] border-[#162F47] p-2 rounded"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 w-1/4">
                  <label className="font-semibold w-1/2">Check In</label>
                  <input
                    type="time"
                    name="checkInTime"
                    value={formData.checkInTime || ""}
                    onChange={handleChange}
                    className="w-full border-[1px] border-[#162F47] p-2 rounded"
                  />
                </div>

                <div className="flex items-center gap-2 w-1/4">
                  <label className="font-semibold w-1/2">Check Out</label>
                  <input
                    type="time"
                    name="checkOutTime"
                    value={formData.checkOutTime || ""}
                    onChange={handleChange}
                    className="w-full border-[1px] border-[#162F47] p-2 rounded"
                  />
                </div>

                <div className="flex items-center gap-2 w-1/4">
                  <label className="font-semibold w-1/2">Loại yêu cầu</label>
                  <select
                    name="requestType"
                    value={formData.requestType}
                    onChange={handleChange}
                    className="w-full border-[1px] border-[#162F47] p-2 rounded"
                  >
                    <option value="FORGOT_CHECK_IN">Quên check in</option>
                    <option value="FORGOT_CHECK_OUT">Quên check out</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold">Lý do</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full border-[1px] border-[#162F47] p-2 rounded"
                  rows="3"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-[#162F47] text-white px-4 py-2 rounded-xl hover:opacity-90 disabled:opacity-50"
                >
                  Gửi yêu cầu
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LIST */}
        <div className="bg-white border-2 border-[#162F47] rounded-2xl p-3 shadow-2xl mt-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b border-[#162F47] pb-2">
            <div className="flex items-center gap-2">
              <FiGrid size={20} className="text-[#162F47]" />
              <span className="text-[#162F47] font-semibold text-lg">Danh sách yêu cầu</span>
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-center">Đang tải...</div>
          ) : myRequests.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Chưa có yêu cầu nào
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-200 text-gray-600 text-sm">
                    <tr>
                      <th className="p-3 text-left">Ngày</th>
                      <th className="p-3 text-left">Check In</th>
                      <th className="p-3 text-left">Check Out</th>
                      <th className="p-3 text-left">Lý do</th>
                      <th className="p-3 text-left">Trạng thái</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedRequests.map((req) => (
                      <tr 
                        key={req.id} 
                        className="border-b hover:bg-blue-200 transition"
                      >
                        <td className="p-3 flex items-center gap-2">
                          <FiCalendar />
                          {new Date(req.requestDate).toLocaleDateString("vi-VN")}
                        </td>

                        <td className="p-3 font-medium text-gray-700">
                          <span className="flex items-center gap-2">
                            <FiClock />
                            {req.checkInTime || "-"}
                          </span>
                        </td>

                        <td className="p-3 font-medium text-gray-700">
                          <span className="flex items-center gap-2">
                            <FiClock />
                            {req.checkOutTime || "-"}
                          </span>
                        </td>

                        <td className="p-3 font-medium text-gray-700">
                          {req.reason || "-"}
                        </td>

                        <td className="p-3 font-medium text-gray-700">
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
                
                {/* PREV */}
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className={`px-4 py-2 rounded-lg border text-sm
                    ${
                      page === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-blue-100"
                    }`}
                >
                  Prev
                </button>

                {/* PAGE INFO */}
                <div className="text-sm text-gray-500">
                  Trang {page} / {totalPages}
                </div>

                {/* NEXT */}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className={`px-4 py-2 rounded-lg border text-sm
                    ${
                      page === totalPages
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

export default AttendanceRequestPage;