import html2pdf from "html2pdf.js";
import { useParams, useNavigate } from "react-router-dom";
import { usePayrollContext } from "../../context";
import { useRef } from "react";

const PayrollDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { payrolls } = usePayrollContext();
  const payrollRef = useRef();

  const payroll = payrolls.find((p) => p.payrollId === Number(id));

  const formatMoney = (money) => {
    if (!money) return "0 VNĐ";
    return Number(money).toLocaleString("vi-VN") + " VNĐ";
  };

  const exportPDF = () => {
    const element = payrollRef.current;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Phieu_luong_${payroll.period}.pdf`,
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all"] },
    };

    html2pdf().set(opt).from(element).save();
  };

  if (!payroll) return <div className="p-10 text-center">Đang tải bảng lương...</div>;

  return (
    <div className="p-6 bg-gray-200 overflow-y-auto h-[calc(100vh-100px)] font-serif">
      {/* Toolbar */}
      <div className="max-w-[795px] mx-auto flex justify-between mb-6 no-print">
        <button
          onClick={() => navigate("/payrolls")}
          className="bg-white border px-4 py-2 rounded shadow hover:bg-gray-50"
        >
          ← Quay lại
        </button>

        <button
          onClick={exportPDF}
          className="bg-blue-700 text-white px-6 py-2 rounded shadow hover:bg-blue-800"
        >
          Tải bản PDF
        </button>
      </div>

      {/* PHIẾU LƯƠNG */}
      <div
        ref={payrollRef}
        className="max-w-[210mm] mx-auto bg-white shadow-2xl text-black"
        style={{
          fontFamily: "'Times New Roman', Times, serif",
          padding: "10mm 14mm",
          fontSize: "12pt",
          lineHeight: "1.4",
          minHeight: "297mm",
        }}
      >

        {/* Quốc hiệu */}
        <div className="text-center mb-4">
          <h2 className="font-bold uppercase text-[13pt]">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </h2>
          <p className="font-bold border-b inline-block pb-1">
            Độc lập - Tự do - Hạnh phúc
          </p>
        </div>

        {/* Ngày */}
        <div className="text-right italic mb-6">
          TP. Hồ Chí Minh, ngày {new Date().getDate()} tháng{" "}
          {new Date().getMonth() + 1} năm {new Date().getFullYear()}
        </div>

        {/* Tiêu đề */}
        <div className="text-center mb-6">
          <h1 className="font-bold text-[16pt] uppercase">
            PHIẾU LƯƠNG NHÂN VIÊN
          </h1>
          <p className="italic">Tháng {payroll.period}</p>
        </div>

        {/* Thông tin */}
        <div className="mb-6 flex items-center justify-between">
          <p>
            <b>Mã nhân viên:</b> {payroll.employeeId}
          </p>
          <p>
            <b>Ngày tạo:</b> {payroll.createdAt}
          </p>
        </div>
        
        <div className="mb-6 flex justify-between gap-4">
          {/* Bảng thu nhập */}
          <table className="w-full border border-black mb-6 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-center">Khoản thu nhập</th>
                <th className="border p-2 text-center">Số tiền</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border p-2">Lương cơ bản</td>
                <td className="border p-2 text-right">{formatMoney(payroll.basicSalary)}</td>
              </tr>

              <tr>
                <td className="border p-2">Tăng ca</td>
                <td className="border p-2 text-right">{formatMoney(payroll.overtimePay)}</td>
              </tr>

              <tr>
                <td className="border p-2">Phụ cấp</td>
                <td className="border p-2 text-right">{formatMoney(payroll.allowances)}</td>
              </tr>

              <tr>
                <td className="border p-2">Thưởng</td>
                <td className="border p-2 text-right">{formatMoney(payroll.bonus)}</td>
              </tr>

              <tr>
                <td className="border p-2">Thu nhập khác</td>
                <td className="border p-2 text-right">{formatMoney(payroll.otherIncome)}</td>
              </tr>

              <tr className="font-bold">
                <td className="border p-2">Tổng thu nhập</td>
                <td className="border p-2 text-right text-blue-700">
                  {formatMoney(payroll.totalIncome)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Bảng khấu trừ */}
          <table className="w-full border border-black mb-6 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-center">Khoản khấu trừ</th>
                <th className="border p-2 text-center">Số tiền</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border p-2">BHXH</td>
                <td className="border p-2 text-right">{formatMoney(payroll.socialInsurance)}</td>
              </tr>

              <tr>
                <td className="border p-2">BHYT</td>
                <td className="border p-2 text-right">{formatMoney(payroll.healthInsurance)}</td>
              </tr>

              <tr>
                <td className="border p-2">BHTN</td>
                <td className="border p-2 text-right">{formatMoney(payroll.unemploymentInsurance)}</td>
              </tr>

              <tr>
                <td className="border p-2">Thuế TNCN</td>
                <td className="border p-2 text-right">{formatMoney(payroll.personalIncomeTax)}</td>
              </tr>

              <tr className="font-bold">
                <td className="border p-2">Tổng khấu trừ</td>
                <td className="border p-2 text-right text-red-600">
                  {formatMoney(payroll.totalDeductions)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Lương thực nhận */}
        <div className="text-center border-t pt-4">
          <p className="text-lg font-bold">LƯƠNG THỰC NHẬN</p>
          <p className="text-2xl font-bold text-green-700">
            {formatMoney(payroll.netSalary)}
          </p>
        </div>

        {/* Ký tên */}
        <div className="grid grid-cols-2 mt-12 text-center">
          <div>
            <p className="font-bold uppercase">Người lập bảng lương</p>
            <div className="h-16"></div>
            <p>(Ký và ghi rõ họ tên)</p>
          </div>

          <div>
            <p className="font-bold uppercase">Người nhận lương</p>
            <div className="h-16"></div>
            <p>(Ký và ghi rõ họ tên)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollDetailPage;