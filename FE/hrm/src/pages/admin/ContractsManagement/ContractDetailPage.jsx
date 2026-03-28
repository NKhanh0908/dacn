/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { FiArrowLeft, FiEdit2, FiCheck, FiX, FiDownload } from "react-icons/fi";
import html2pdf from "html2pdf.js";

import { useContractContext } from "../../../context";

const formatDate = (value) => {
  if (!value) return "--";
  return new Date(value).toLocaleDateString("vi-VN");
};

const formatMoney = (value) => {
  if (!value && value !== 0) return "--";
  return Number(value).toLocaleString("vi-VN") + " đ";
};

const ContractDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  if (!role?.includes("ADMIN") && !role?.includes("HR")) {
    return <Navigate to="/" replace />;
  }

  const { getDetail, handleSign, handleTerminate } = useContractContext();
  const [data, setData] = useState(null);
  const pdfRef = useRef();

  useEffect(() => {
    if (id) fetchDetail();
    // eslint-disable-next-line
  }, [id]);

  const fetchDetail = async () => {
    const res = await getDetail(id);
    if (!res) {
      alert("Không tìm thấy hợp đồng");
      navigate("/contracts-management");
      return;
    }
    setData(res);
  };

  // ================= EXPORT PDF =================
  const handleExportPDF = () => {
    const element = pdfRef.current;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Hop_dong_${data.employeeName}.pdf`,
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all"] }
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleSignContract = async () => {
    await handleSign(id);
    fetchDetail();
  };

  const handleCancelContract = async () => {
    await handleTerminate(id, {
      terminationReason: "Hủy từ hệ thống",
    });
    fetchDetail();
  };

  if (!data) return <div className="p-6">Đang tải...</div>;

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

          <div className="flex gap-2">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <FiDownload /> Xuất PDF
            </button>

            <button
              onClick={() => navigate(`/contracts-management/edit/${id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              <FiEdit2 /> Sửa hợp đồng
            </button>

            {data.status === "PENDING_SIGNATURE" && (
              <button
                onClick={handleSignContract}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                <FiCheck /> Ký hợp đồng
              </button>
            )}

            {data.status === "ACTIVE" && (
              <button
                onClick={handleCancelContract}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                <FiX /> Hủy hợp đồng
              </button>
            )}
          </div>
        </div>

        {/* CARD */}
        <div className="bg-white border rounded-2xl shadow-xl overflow-hidden">

          {/* TITLE */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6">
            <h1 className="text-2xl font-bold">Chi tiết hợp đồng</h1>
            <p className="text-sm opacity-90">{data.contractNumber}</p>
          </div>

          {/* EMPLOYEE INFO */}
          <div className="p-6 border-b grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p><b>Nhân viên:</b> {data.employeeName}</p>
            <p><b>Phòng ban:</b> {data.department}</p>
            <p><b>Chức vụ:</b> {data.jobTitle}</p>
            <p><b>Trạng thái:</b> {data.status}</p>
          </div>

          {/* BODY */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* THÔNG TIN HỢP ĐỒNG */}
            <div className="bg-blue-50 rounded-xl p-4 border">
              <h3 className="font-semibold text-blue-700 mb-3">Thông tin hợp đồng</h3>

              <div className="grid grid-cols-1 gap-3">
                <Input label="Loại hợp đồng" value={data.contractType} readOnly />
                <Input label="Ngày bắt đầu" value={formatDate(data.startDate)} readOnly />
                <Input label="Ngày kết thúc" value={formatDate(data.endDate)} readOnly />
                <Input label="Ngày ký" value={formatDate(data.signedDate)} readOnly />
              </div>
            </div>

            {/* LƯƠNG */}
            <div className="bg-green-50 rounded-xl p-4 border">
              <h3 className="font-semibold text-green-700 mb-3">Lương & phụ cấp</h3>

              <div className="grid grid-cols-1 gap-3">
                <Input label="Lương cơ bản" value={formatMoney(data.basicSalary)} readOnly />
                <Input label="Phụ cấp" value={formatMoney(data.allowances)} readOnly />
                <Input label="Tổng thu nhập" value={formatMoney(data.totalCompensation)} readOnly />
                <Input label="Chi tiết phụ cấp" value={data.allowanceDetails} readOnly />
              </div>
            </div>

            {/* THỜI GIAN LÀM VIỆC */}
            <div className="bg-yellow-50 rounded-xl p-4 border">
              <h3 className="font-semibold text-yellow-700 mb-3">Thời gian làm việc</h3>

              <div className="grid grid-cols-1 gap-3">
                <Input label="Giờ/ngày" value={data.workingHoursPerDay} readOnly />
                <Input label="Ngày/tháng" value={data.workingDaysPerMonth} readOnly />
                <Input label="OT policy" value={data.overtimePolicy} readOnly />
                <Input label="Nghỉ phép" value={data.annualLeaveDays} readOnly />
              </div>
            </div>

            {/* BẢO HIỂM */}
            <div className="bg-purple-50 rounded-xl p-4 border">
              <h3 className="font-semibold text-purple-700 mb-3">Bảo hiểm</h3>

              <div className="grid grid-cols-1 gap-3">
                <Input label="Có BHXH" value={data.socialInsurance ? "Có" : "Không"} readOnly />
                <Input label="Lương đóng BH" value={formatMoney(data.insuranceSalary)} readOnly />
              </div>
            </div>

            {/* THỬ VIỆC */}
            <div className="bg-gray-50 rounded-xl p-4 border col-span-1 md:col-span-2">
              <h3 className="font-semibold text-gray-700 mb-3">Thử việc</h3>

              <div className="grid grid-cols-3 gap-3">
                <Input label="Thời gian (tháng)" value={data.probationPeriod} readOnly />
                <Input label="% lương" value={data.probationSalaryPercentage} readOnly />
                <Input label="Ngày kết thúc" value={formatDate(data.probationEndDate)} readOnly />
              </div>
            </div>

            {/* MÔ TẢ */}
            <div className="col-span-1 md:col-span-2">
              <Input label="Mô tả công việc" value={data.jobDescription} readOnly />
            </div>

          </div>

          {/* FOOTER */}
          <div className="bg-gray-100 p-4 text-sm text-gray-600 flex justify-between">
            <span>Tạo lúc: {formatDate(data.createdAt)}</span>
            <span>Cập nhật: {formatDate(data.updatedAt)}</span>
          </div>

        </div>

        {/* ================= HIDDEN PDF TEMPLATE ================= */}
        <div className="hidden">
          <div 
          className="max-w-[210mm] mx-auto bg-white shadow-2xl text-black" 
          ref={pdfRef}
          style={{ 
              fontFamily: "'Times New Roman', Times, serif",
              padding: "6mm 11mm", 
              fontSize: "11pt",      
              lineHeight: "1.25",    
              minHeight: "297mm",
              boxSizing: "border-box",
          }}
        >
          {/* Quốc hiệu tiêu ngữ */}
          <div className="flex flex-col items-center text-center">
            <h2 className="font-bold text-[13pt] uppercase tracking-tight">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
            <h3 className="font-bold text-[12pt] border-b border-black pb-2">Độc lập - Tự do - Hạnh phúc</h3>
          </div>

          {/* Dòng Ngày tháng năm (Góc phải dưới Quốc hiệu) */}
          <div className="text-right italic text-[12pt]">
            {data.workLocation || "TP. Hồ Chí Minh"}, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
          </div>

          {/* Tên hợp đồng */}
          <div className="text-center mb-6">
            <h1 className="font-bold text-[16pt] uppercase mb-1">HỢP ĐỒNG LAO ĐỘNG</h1>
            <p className="italic text-[11pt]">Số: {data.contractNumber}/HĐLĐ-{new Date().getFullYear()}</p>
          </div>

          {/* Nội dung hợp đồng */}
          <div className="text-[12pt] space-y-2">
            
            {/* Bên A */}
            <div>
              <p className="uppercase font-bold">Bên A: NGƯỜI SỬ DỤNG LAO ĐỘNG (Bên thuê)</p>
              <div className="pl-4">
                <p>- Đại diện: {data.managerName || "...................................."}</p>
                <p>- Chức vụ: Giám đốc</p>
                <p>- Tổ chức: <strong>{data.companyName}</strong></p>
                <p>- Địa chỉ: {data.companyAddress || "...................................................................."}</p>
              </div>
            </div>

            {/* Bên B */}
            <div className="mb-6">
              <p className="uppercase font-bold">Bên B: NGƯỜI LAO ĐỘNG (Bên được thuê)</p>
              <div className="pl-4">
                <p>- Ông/Bà: <strong>{data.employeeName.toUpperCase()}</strong></p>
                <p>- Ngày sinh: {formatDate(data.birthday) ||  "......................."}</p>
                <p>- Số CCCD: {data.idCard || "......................."}</p>
                <p>- Địa chỉ: {data.address || "...................................................................."}</p>
              </div>
            </div>

            <p className="italic">Hai bên thỏa thuận ký kết hợp đồng với các điều khoản sau đây:</p>

            {/* Các điều khoản chính */}
            <div className="space-y-2 text-justify">
              <p>
                <span className="font-bold">Điều 1: Công việc và thời hạn hợp đồng.</span><br />
                - Vị trí chuyên môn: {data.jobTitle}.<br />
                - Loại hợp đồng: {data.contractType}.<br />
                  - Thời hạn: Từ ngày {formatDate(data.startDate)} đến {formatDate(data.endDate)}.<br />
                  - Mô tả công việc: {data.jobDescription || "Trụ sở công ty và các nơi theo phân công"}.<br/>
                  - Địa điểm làm việc: Trụ sở công ty và các nơi theo phân công.
              </p>

              <section>
                <span className="font-bold">Điều 2: Chế độ làm việc và lương thưởng.</span>
                <p><strong>1. Chế độ làm việc:</strong></p>
                <ul className="ml-5">
                  <li>- Thời gian: {data.workingHoursPerDay}h/ngày ({data.workingDaysPerMonth} ngày/tháng).</li>
                  <li>- Chế độ nghỉ ngơi: Theo quy định của pháp luật và quy chế công ty.</li>
                </ul>
                <p><strong>2. Lương thưởng:</strong></p>
                <ul className="ml-5">
                  <li>- Mức lương chính: <span className="font-bold text-red-700">{formatMoney(data.basicSalary)}</span></li>
                  <li><p>- Phụ cấp: {formatMoney(data.allowances)} ({data.allowanceDetails})</p></li> 
                  <li>- Hình thức trả lương: {data.salaryPaymentMethod} vào ngày {data.salaryPaymentDate} hàng tháng.</li>
                  <li>- Chế độ bảo hiểm: {data.socialInsurance ? "Được đóng BHXH, BHYT theo quy định" : "Theo thỏa thuận riêng"}.</li>
                  <li>- Chính sách khấu trừ lương:
                  <ul className="ml-5">
                    <li>+ Nghỉ có phép: -{data.paidLeaveDeductionRate}%.</li>
                    <li>+ Nghỉ không phép: -{data.unpaidLeaveDeductionRate}%.</li>
                    <li>+ Đi trễ: -{data.lateDeductionRate}%.</li>
                  </ul>
                </li>
                </ul>
              </section>

              <p>
                <span className="font-bold">Điều 3: Quyền và nghĩa vụ.</span><br />
                Người lao động có trách nhiệm hoàn thành công việc được giao, tuân thủ nội quy công ty. Người sử dụng lao động có trách nhiệm thanh toán lương đúng hạn và đóng bảo hiểm {data.socialInsurance ? "đầy đủ" : "theo thỏa thuận"} cho nhân viên.
              </p>
            </div>
          </div>

          {/* Chữ ký */}
          <div className="mt-8 grid grid-cols-2 text-center">
            <div>
              <p className="font-bold uppercase">Người lao động</p>
              <p className="italic text-sm">(Ký và ghi rõ họ tên)</p>
              <div className="h-16"></div>
              <p className="font-bold">{data.employeeName}</p>
            </div>
            <div>
              <p className="font-bold uppercase">Người sử dụng lao động</p>
              <p className="italic text-sm">(Ký tên, đóng dấu)</p>
              <div className="h-16 text-red-500 flex items-center justify-center opacity-50">
                {data.status === "SIGNED" && <span className="border-4 border-red-500 p-2 rotate-12 uppercase font-bold">Đã ký kết</span>}
              </div>
              <p className="font-bold">Đại diện Công ty</p>
            </div>
          </div>
        </div>
        </div>

      </div>
    </div>
  );
};
const Input = ({ label, value }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500">{label}</label>
    <input
      value={value || "--"}
      readOnly
      className="w-full px-3 py-2 border rounded-lg mt-1 bg-gray-100"
    />
  </div>
);

export default ContractDetailPage;