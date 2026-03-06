import { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { useParams, useNavigate } from "react-router-dom";
import { getContractById } from "../../services/contract/ContractService";

const ContractDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const contractRef = useRef();

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const res = await getContractById(id);
        setContract(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchContract();
  }, [id]);

  const exportPDF = () => {
    const element = contractRef.current;
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Hop_dong_Lao_dong_${contract.employeeName}.pdf`,
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all"] }
    };
    html2pdf().set(opt).from(element).save();
  };

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString("vi-VN") : "...");
  const formatMoney = (money) => (money ? Number(money).toLocaleString("vi-VN") + " VNĐ" : "0 VNĐ");

  if (!contract) return <div className="p-10 text-center">Đang tải hợp đồng...</div>;

  return (
    <div className="p-6 bg-gray-200 overflow-y-auto h-[calc(100vh-100px)] font-serif">
      {/* Thanh công cụ */}
      <div className="max-w-[795px] mx-auto flex justify-between items-center mb-6 no-print">
        <button 
          onClick={() => navigate("/contracts")} 
          className="bg-white border border-gray-300 px-4 py-2 rounded shadow-sm hover:bg-gray-50 transition"
        >
          ← Quay lại
        </button>
        <button 
          onClick={exportPDF} 
          className="bg-blue-700 text-white px-6 py-2 rounded shadow hover:bg-blue-800 transition font-sans"
        >
          Tải xuống bản PDF
        </button>
      </div>

      {/* VÙNG IN HỢP ĐỒNG (KHỔ A4) */}
      <div 
        className="max-w-[210mm] mx-auto bg-white shadow-2xl text-black" 
        ref={contractRef}
        style={{ 
            fontFamily: "'Times New Roman', Times, serif",
            padding: "8mm 12mm", 
            fontSize: "11pt",      
            lineHeight: "1.25",    
            minHeight: "297mm",
            boxSizing: "border-box",
        }}
      >
        {/* Quốc hiệu tiêu ngữ */}
        <div className="flex flex-col items-center text-center mb-2">
          <h2 className="font-bold text-[13pt] uppercase tracking-tight">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
          <h3 className="font-bold text-[12pt] border-b border-black pb-2 mb-1">Độc lập - Tự do - Hạnh phúc</h3>
        </div>

        {/* Dòng Ngày tháng năm (Góc phải dưới Quốc hiệu) */}
        <div className="text-right italic text-[12pt] mb-4">
           {contract.workLocation || "TP. Hồ Chí Minh"}, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
        </div>

        {/* Tên hợp đồng */}
        <div className="text-center mb-6">
          <h1 className="font-bold text-[16pt] uppercase mb-1">HỢP ĐỒNG LAO ĐỘNG</h1>
          <p className="italic text-[11pt]">Số: {contract.contractNumber}/HĐLĐ-{new Date().getFullYear()}</p>
        </div>

        {/* Nội dung hợp đồng */}
        <div className="text-[12pt] space-y-2">
          
          {/* Bên A */}
          <div>
            <p className="uppercase font-bold">Bên A: NGƯỜI SỬ DỤNG LAO ĐỘNG (Bên thuê)</p>
            <div className="pl-4">
              <p>- Đại diện: {contract.managerName || "...................................."}</p>
              <p>- Chức vụ: Giám đốc</p>
              <p>- Tổ chức: <strong>{contract.companyName}</strong></p>
              <p>- Địa chỉ: {contract.companyAddress || "...................................................................."}</p>
            </div>
          </div>

          {/* Bên B */}
          <div className="mb-6">
            <p className="uppercase font-bold">Bên B: NGƯỜI LAO ĐỘNG (Bên được thuê)</p>
            <div className="pl-4">
              <p>- Ông/Bà: <strong>{contract.employeeName.toUpperCase()}</strong></p>
              <p>- Ngày sinh: {formatDate(contract.birthday) ||  "......................."}</p>
              <p>- Số CCCD: {contract.idCard || "......................."}</p>
              <p>- Địa chỉ: {contract.address || "...................................................................."}</p>
            </div>
          </div>

          <p className="italic">Hai bên thỏa thuận ký kết hợp đồng với các điều khoản sau đây:</p>

          {/* Các điều khoản chính */}
          <div className="space-y-2 text-justify">
            <p>
              <span className="font-bold">Điều 1: Công việc và thời hạn hợp đồng.</span><br />
              - Vị trí chuyên môn: {contract.jobTitle}.<br />
              - Loại hợp đồng: {contract.contractType}.<br />
                - Thời hạn: Từ ngày {formatDate(contract.startDate)} đến {formatDate(contract.endDate)}.<br />
                - Mô tả công việc: {contract.jobDescription || "Trụ sở công ty và các nơi theo phân công"}.<br/>
                - Địa điểm làm việc: Trụ sở công ty và các nơi theo phân công.
            </p>

            <section>
              <span className="font-bold">Điều 2: Chế độ làm việc và lương thưởng.</span>
              <p><strong>1. Chế độ làm việc:</strong></p>
              <ul className="ml-5">
                <li>- Thời gian: {contract.workingHoursPerDay}h/ngày ({contract.workingDaysPerWeek} ngày/tuần).</li>
                <li>- Chế độ nghỉ ngơi: Theo quy định của pháp luật và quy chế công ty.</li>
              </ul>
              <p><strong>2. Lương thưởng:</strong></p>
              <ul className="ml-5">
                <li>- Mức lương chính: <span className="font-bold text-red-700">{formatMoney(contract.basicSalary)}</span></li>
                <li><p>- Phụ cấp: {formatMoney(contract.allowances)} ({contract.allowanceDetails})</p></li> 
                <li>- Hình thức trả lương: {contract.salaryPaymentMethod} vào ngày {contract.salaryPaymentDate} hàng tháng.</li>
                <li>- Chế độ bảo hiểm: {contract.socialInsurance ? "Được đóng BHXH, BHYT theo quy định" : "Theo thỏa thuận riêng"}.</li>
              </ul>
            </section>

            <p>
              <span className="font-bold">Điều 3: Quyền và nghĩa vụ.</span><br />
              Người lao động có trách nhiệm hoàn thành công việc được giao, tuân thủ nội quy công ty. Người sử dụng lao động có trách nhiệm thanh toán lương đúng hạn và đóng bảo hiểm {contract.socialInsurance ? "đầy đủ" : "theo thỏa thuận"} cho nhân viên.
            </p>
          </div>
        </div>

        {/* Chữ ký */}
        <div className="mt-8 grid grid-cols-2 text-center">
          <div>
            <p className="font-bold uppercase">Người lao động</p>
            <p className="italic text-sm">(Ký và ghi rõ họ tên)</p>
            <div className="h-16"></div>
            <p className="font-bold">{contract.employeeName}</p>
          </div>
          <div>
            <p className="font-bold uppercase">Người sử dụng lao động</p>
            <p className="italic text-sm">(Ký tên, đóng dấu)</p>
            <div className="h-16 text-red-500 flex items-center justify-center opacity-50">
               {contract.status === "SIGNED" && <span className="border-4 border-red-500 p-2 rotate-12 uppercase font-bold">Đã ký kết</span>}
            </div>
            <p className="font-bold">Đại diện Công ty</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;