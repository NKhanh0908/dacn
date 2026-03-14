import { useParams } from "react-router-dom";
import { usePayrollContext } from "../../context/PayrollContext";

const PayrollDetailPage = () => {

  const { id } = useParams();
  const { payrolls } = usePayrollContext();

  const payroll = payrolls.find(p => p.payrollId === Number(id));

  if (!payroll) return <p>Không tìm thấy bảng lương</p>;

  return (
    <div className="p-6 bg-white rounded-xl shadow">

      <h2 className="text-xl font-semibold mb-6">
        Chi tiết bảng lương tháng {payroll.period}
      </h2>

      <div className="space-y-3">

        <p>
          <b>Tổng thu nhập:</b> {payroll.totalIncome.toLocaleString()} đ
        </p>

        <p>
          <b>Khấu trừ:</b> {payroll.totalDeductions.toLocaleString()} đ
        </p>

        <p>
          <b>Lương thực nhận:</b> {payroll.netSalary.toLocaleString()} đ
        </p>

        <p>
          <b>Trạng thái:</b> {payroll.status}
        </p>

      </div>

    </div>
  );
};

export default PayrollDetailPage;