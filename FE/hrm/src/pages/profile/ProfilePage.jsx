import { useEmployeeContext } from "../../context/EmployeeContext";
import { FiX } from "react-icons/fi";

const ProfilePage = ({ show, onClose }) => {
  const { employee, loading } = useEmployeeContext();

  if (!show || loading || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-[420px] rounded-2xl bg-[#162F47] text-white p-6 shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Thông tin cá nhân
          </h2>
          <button onClick={onClose} className="text-white/70 hover:text-red-400 transition">
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 text-sm">
          <p>
            <span className="opacity-70">Họ tên:</span>{" "}
            {employee.fullName}
          </p>
          <p>
            <span className="opacity-70">Ngày sinh:</span>{" "}
            {employee.dateOfBirth}
          </p>
          <p>
            <span className="opacity-70">Tuổi:</span>{" "}
            {employee.age}
          </p>
          <p>
            <span className="opacity-70">Giới tính:</span>{" "}
            {employee.genderDisplay}
          </p>
          <p>
            <span className="opacity-70">Mã card:</span>{" "}
            {employee.idCard}
          </p>
          <p>
            <span className="opacity-70">Email:</span>{" "}
            {employee.email}
          </p>
          <p>
            <span className="opacity-70">Vai trò:</span>{" "}
            {employee.roleId}
          </p>
          <p>
            <span className="opacity-70">Phòng ban:</span>{" "}
            {employee.department}
          </p>
          <p>
            <span className="opacity-70">Chức vụ:</span>{" "}
            {employee.position}
          </p>
          <p>
            <span className="opacity-70">Số điện thoại:</span>{" "}
            {employee.phone}
          </p>
          <p>
            <span className="opacity-70">Địa chỉ:</span>{" "}
            {employee.address}
          </p>
          <p>
            <span className="opacity-70">Ngày vào làm:</span>{" "}
            {employee.startDate}
          </p>
          <p>
            <span className="opacity-70">Trạng thái:</span>{" "}
            {employee.statusDisplay}
          </p>
          <p>
            <span className="opacity-70">Tài khoản ngân hàng:</span>{" "}
            {employee.bankAccount}
          </p>
          <p>
            <span className="opacity-70">Ngân hàng:</span>{" "}
            {employee.bankName}
          </p>
          <p>
            <span className="opacity-70">Mã tax:</span>{" "}
            {employee.taxCode}
          </p>
          <p>
            <span className="opacity-70">Số bảo hiểm xã hội:</span>{" "}
            {employee.socialInsuranceNumber}
          </p>
          <p>
            <span className="opacity-70">Tên người liên hệ:</span>{" "}
            {employee.emergencyContactName}
          </p>
          <p>
            <span className="opacity-70">SĐT người liên hệ:</span>{" "}
            {employee.emergencyContactPhone}
          </p>
          <p>
            <span className="opacity-70">Mối quan hệ:</span>{" "}
            {employee.emergencyContactRelationship}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 text-right">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm bg-blue-500 hover:bg-blue-600 transition">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
