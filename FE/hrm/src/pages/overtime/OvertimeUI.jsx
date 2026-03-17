import { useState } from "react";
import { FiPlus, FiClock, FiCalendar } from "react-icons/fi";
import { useOvertimeRequestContext } from "../../context";

const OvertimeRequestPage = () => {

  const { submitOvertimeRequest, loading } = useOvertimeRequestContext();

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    reason: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await submitOvertimeRequest(form);

      alert("Gửi yêu cầu tăng ca thành công");

      setForm({
        date: "",
        startTime: "",
        endTime: "",
        reason: ""
      });

      setShowForm(false);

    } catch (error) {
      alert("Gửi yêu cầu thất bại");
      console.error(error);
    }
  };

  return (
    <div className="border rounded-xl p-4 bg-gray-50 h-full">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#162F47] pb-2">
        <div className="flex items-center gap-2">
          <FiClock size={22} className="text-[#162F47]" />
          <span className="font-semibold">
            Yêu cầu tăng ca
          </span>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiPlus />
          Tạo yêu cầu
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 border-2 border-[#162F47] rounded-2xl mt-2 p-4"
        >
          <div className="flex items-center gap-4">
            {/* Date */}
            <div>
              <label className="font-semibold text-sm text-gray-600">Ngày</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>

            {/* Start time */}
            <div>
              <label className="font-semibold text-sm text-gray-600">Giờ bắt đầu</label>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>

            {/* End time */}
            <div>
              <label className="font-semibold text-sm text-gray-600">Giờ kết thúc</label>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>
          </div>

          {/* Reason */}
          <div className="mt-4">
            <label className="font-semibold text-sm text-gray-600">Lý do</label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              required
              rows="3"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          {/* Button */}
          <div className="flex justify-end mt-4 gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </div>
        </form>
      )}

      {/* Empty state */}
      {!showForm && (
        <div className="text-center text-gray-400 py-8 flex flex-col items-center gap-2">
          <FiCalendar size={40} />
          <p>Nhấn "Tạo yêu cầu" để gửi yêu cầu tăng ca</p>
        </div>
      )}
    </div>
  );
};

export default OvertimeRequestPage;