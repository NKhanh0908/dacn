/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiFile, FiLoader } from "react-icons/fi";
import { usePayrollContext, useEmployeeContext } from "../../../context";

const PayrollManagementDetailPage = () => {
  const { payrollId } = useParams();
  const navigate = useNavigate();

  const { employees, loadingEmployees } = useEmployeeContext();
  const { detailPayroll, fetchPayrollById, loadingDetail, errorDetail } = usePayrollContext();

  const safeEmployees = Array.isArray(employees) ? employees : [];

  const handleExportExcel = () => {
    if (!detailPayroll) return;

    const employee = safeEmployees.find(
      (e) => e.employeeId === detailPayroll.employeeId
    );

    const data = [
      { "Thông tin": "Họ tên", "Giá trị": employee?.fullName || "--" },
      { "Thông tin": "Mã nhân viên", "Giá trị": detailPayroll.employeeId },
      { "Thông tin": "Phòng ban", "Giá trị": employee?.department || "--" },
      { "Thông tin": "Chức vụ", "Giá trị": employee?.position || "--" },
      {},
      { "Thông tin": "Tháng", "Giá trị": `${detailPayroll.month}/${detailPayroll.year}` },

      // ===== THU NHẬP =====
      {},
      { "Thông tin": "Lương cơ bản", "Giá trị": detailPayroll.basicSalary },
      { "Thông tin": "Phụ cấp", "Giá trị": detailPayroll.allowances },
      { "Thông tin": "Overtime", "Giá trị": detailPayroll.overtimePay },
      { "Thông tin": "Thưởng", "Giá trị": detailPayroll.bonus },
      { "Thông tin": "Thu nhập khác", "Giá trị": detailPayroll.otherIncome },
      { "Thông tin": "Tổng thu nhập", "Giá trị": detailPayroll.totalIncome },

      // ===== KHẤU TRỪ =====
      {},
      { "Thông tin": "BHXH", "Giá trị": detailPayroll.socialInsurance },
      { "Thông tin": "BHYT", "Giá trị": detailPayroll.healthInsurance },
      { "Thông tin": "BHTN", "Giá trị": detailPayroll.unemploymentInsurance },
      { "Thông tin": "Thuế TNCN", "Giá trị": detailPayroll.personalIncomeTax },
      { "Thông tin": "Tổng khấu trừ", "Giá trị": detailPayroll.totalDeductions },

      // ===== NET =====
      {},
      { "Thông tin": "Thực nhận", "Giá trị": detailPayroll.netSalary },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payroll");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, `Payroll_${detailPayroll.employeeId}_${detailPayroll.month}_${detailPayroll.year}.xlsx`);
  };

  useEffect(() => {
    if (payrollId) fetchPayrollById(payrollId);
  }, [payrollId]);

  const role = localStorage.getItem("role")?.toUpperCase();
  if (!role?.includes("ADMIN") && !role?.includes("HR")) {
    return <Navigate to="/" replace />;
  }

  if (loadingDetail || loadingEmployees) {
    return (
      <div className="flex justify-center items-center gap-2 py-10">
        <FiLoader className="animate-spin" />
        Đang tải dữ liệu...
      </div>
    );
  }

  if (errorDetail) return <div className="text-center py-10 text-red-500">{errorDetail}</div>;
  if (!detailPayroll) return <div className="text-center py-10">Không có dữ liệu</div>;

  const employee = safeEmployees.find(
    (e) => e.employeeId === detailPayroll.employeeId
  );

  return (
    <div className="overflow-y-auto h-[calc(100vh-100px)] pr-4 pb-4">
      <div className="w-full mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 border px-4 py-2 rounded-lg hover:bg-blue-50"
          >
            <FiArrowLeft /> Quay lại
          </button>

          <button 
            onClick={handleExportExcel}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            <FiFile /> Xuất Excel
          </button>
        </div>

        {/* CARD */}
        <div className="bg-white border border-gray-300 rounded-2xl shadow-xl overflow-hidden">

          {/* TITLE */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6">
            <h1 className="text-2xl font-bold">Phiếu lương</h1>
            <p className="text-sm opacity-90">
              Tháng {detailPayroll.month}/{detailPayroll.year}
            </p>
          </div>

          {/* EMPLOYEE */}
          <div className="p-6 border-b grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><b>Họ tên:</b> {employee?.fullName || "--"}</p>
              <p><b>Mã NV:</b> {detailPayroll.employeeId}</p>
            </div>
            <div>
              <p><b>Phòng ban:</b> {employee?.department || "--"}</p>
              <p><b>Chức vụ:</b> {employee?.position || "--"}</p>
            </div>
          </div>

          {/* BODY */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* THU NHẬP */}
            <div className="bg-green-50 rounded-xl p-4 border">
              <h3 className="font-semibold text-green-700 mb-3">Thu nhập</h3>

              <div className="space-y-2 text-sm">
                <Row label="Lương cơ bản" value={detailPayroll.basicSalary} />
                <Row label="Phụ cấp" value={detailPayroll.allowances} />
                <Row label="Overtime" value={detailPayroll.overtimePay} />
                <Row label="Thưởng" value={detailPayroll.bonus} />
                <Row label="Thu nhập khác" value={detailPayroll.otherIncome} />

                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Tổng thu nhập</span>
                  <span>{detailPayroll.totalIncome?.toLocaleString()} VNĐ</span>
                </div>
              </div>
            </div>

            {/* KHẤU TRỪ */}
            <div className="bg-red-50 rounded-xl p-4 border">
              <h3 className="font-semibold text-red-700 mb-3">Khấu trừ</h3>

              <div className="space-y-2 text-sm">
                <Row label="BHXH" value={detailPayroll.socialInsurance} />
                <Row label="BHYT" value={detailPayroll.healthInsurance} />
                <Row label="BHTN" value={detailPayroll.unemploymentInsurance} />
                <Row label="Thuế TNCN" value={detailPayroll.personalIncomeTax} />

                <div className="flex justify-between font-semibold border-t pt-2 text-red-600">
                  <span>Tổng khấu trừ</span>
                  <span>{detailPayroll.totalDeductions?.toLocaleString()} VNĐ</span>
                </div>
              </div>
            </div>
          </div>

          {/* NET SALARY */}
          <div className="bg-gray-100 p-6 flex justify-between items-center">
            <span className="text-lg font-semibold">Thực nhận</span>
            <span className="text-2xl font-bold text-green-600">
              {detailPayroll.netSalary?.toLocaleString()} VNĐ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// COMPONENT ROW
const Row = ({ label, value }) => (
  <div className="flex justify-between">
    <span>{label}</span>
    <span>{value?.toLocaleString()} VNĐ</span>
  </div>
);

export default PayrollManagementDetailPage;