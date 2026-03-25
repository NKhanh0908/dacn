import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiGrid, FiCalendar, FiDollarSign } from "react-icons/fi";
import { usePayrollContext } from "../../context";

const MyPayrollPage = () => {
  const { payrolls, loading } = usePayrollContext();
  const navigate = useNavigate();

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(payrolls.length / pageSize);

  const sortedPayrolls = [...payrolls].sort(
    (a, b) => b.payrollId - a.payrollId
  );

  const paginatedPayrolls = sortedPayrolls.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const formatMoney = (money) => {
    if (!money) return "-";
    return money.toLocaleString("vi-VN") + " đ";
  };


  if (loading) return <p>Loading...</p>;

  return (
    <div className="overflow-y-auto h-[calc(100vh-100px)] pr-4 pb-4">
      <div className="bg-white border-2 border-[#162F47] rounded-2xl p-3 shadow-2xl">

        {/* Header */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#162F47] pb-2">
          <FiGrid size={20} className="text-[#162F47]" />
          <span className="text-[#162F47] font-semibold text-lg">
            Danh sách lương của tôi
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600 text-sm">
                <th className="p-3 text-left">STT</th>
                <th className="p-3 text-left">Tháng</th>
                <th className="p-3 text-left">Tổng thu nhập</th>
                <th className="p-3 text-left">Khấu trừ</th>
                <th className="p-3 text-left">Lương thực nhận</th>
              </tr>
            </thead>

            <tbody>
              {paginatedPayrolls.length > 0 ? (
                paginatedPayrolls.map((p, index) => (
                  <tr
                    key={p.payrollId}
                    onClick={() => navigate(`/payrolls/${p.payrollId}`)}
                    className="border-b hover:bg-blue-200 transition cursor-pointer"
                  >
                    <td className="p-3">{(page - 1) * pageSize + index + 1}</td>
                    <td className="p-3 flex items-center gap-2">
                      <FiCalendar />
                      {p.period}
                    </td>

                    <td className="p-3 font-medium text-gray-700">
                      {formatMoney(p.totalIncome)}
                    </td>

                    <td className="p-3 font-medium text-gray-700">
                      {formatMoney(p.totalDeductions)}
                    </td>

                    <td className="p-3 font-medium">
                      <span className="px-3 py-1 rounded bg-blue-100 text-blue-700">
                        {formatMoney(p.netSalary)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-400">
                    Không có phiếu lương nào
                  </td>
                </tr>
              )}
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
      </div>
    </div>
  );
};

export default MyPayrollPage;