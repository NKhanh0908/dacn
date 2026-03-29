import { FiCalendar } from "react-icons/fi";
import { useHolidayContext } from "../../context";

const HolidayPage = () => {
  const { holidays, loading } = useHolidayContext();

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="mt-2">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-600 text-sm">
              <th className="p-3 text-left">Tên ngày nghỉ</th>
              <th className="p-3 text-left">Ngày</th>
            </tr>
          </thead>

          <tbody>
            {holidays.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-400">
                  Không có ngày nghỉ sắp tới
                </td>
              </tr>
            )}

            {holidays.map((h) => (
              <tr
                key={h.id}
                className="border-b hover:bg-blue-200 transition"
              >

                <td className="p-3 flex items-center gap-2">
                  <FiCalendar />
                  {h.description || "Ngày nghỉ không tên"}
                </td>

                <td className="p-3 font-medium text-gray-700">
                  {formatDate(h.startDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HolidayPage;