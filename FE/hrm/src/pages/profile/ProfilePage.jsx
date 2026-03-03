import { useEmployeeContext } from "../../context/EmployeeContext";
import { FiUser } from "react-icons/fi";


const ProfilePage = () => {
  const { employee, loading } = useEmployeeContext();

  if (loading || !employee) return null;

  return (
    <div className="overflow-y-auto h-[calc(100vh-100px)]">
      <div className="w-full mx-auto">

        <div className="flex items-center justify-between mt-2 mb-6 mr-4">
          <h1 className="text-2xl  font-bold">
            Welcome, {employee.fullName}
          </h1>
          <button>
            <span className="text-l font-bold text-[#162F47] border border-[#162F47] rounded-lg p-2 hover:bg-[#162F47] hover:text-white">Cập nhật</span>
          </button>
        </div>

        <div className="border-2 border-[#162F47] rounded-2xl p-3 shadow-2xl">
          <div className="flex items-center gap-2 border-b border-[#162F47] pb-2">
            <FiUser size={22} className="text-[#162F47]" />
            <span className="text-[#162F47] font-semibold text-lg">Thông tin cá nhân</span>
          </div>

          <div className="flex items-center justify-center gap-20">
            <div className="flex gap-4 mt-4 items-center w-1/2">
              <img
                src={employee.avatarUrl}
                alt="Avatar"
                className="w-40 h-40"
              />

              <div className="flex flex-col gap-2 text-l w-full">
                <p className="flex justify-between">
                  <span className="font-semibold">Mã nhân viên:</span>{" "}
                  <span className="font-bold">{employee.employeeId}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">Họ tên:</span>{" "}
                  <span className="font-bold">{employee.fullName}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">Ngày sinh:</span>{" "}
                  <span className="font-bold">{employee.dateOfBirth}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">Giới tính:</span>{" "}
                  <span className="font-bold">{employee.genderDisplay}</span>
                </p>
              </div>
            </div>

            <div className="h-40 w-[1px] border border-[#162F47]"></div>

            <div className="flex gap-4 mt-4 items-center w-1/2">
              <div className="flex flex-col gap-2 text-l w-full"> 
                <p className="flex justify-between">
                  <span className="font-semibold">Số điện thoại:</span>{" "}
                  <span className="font-bold">{employee.phone}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">Địa chỉ:</span>{" "}
                  <span className="font-bold w-[400px] text-right">{employee.address}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">Email:</span>{" "}
                  <span className="font-bold">{employee.email}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">Trạng thái:</span>{" "}
                  <span className="font-bold">{employee.statusDisplay}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-2 border-[#162F47] rounded-2xl p-3 shadow-2xl mt-6">
          <div className="flex items-center gap-2 border-b border-[#162F47] pb-2">
            <FiUser size={22} className="text-[#162F47]" />
            <span className="text-[#162F47] font-semibold text-lg">Thông tin làm việc</span>
          </div>

          <div className="flex items-center justify-center mt-4 gap-20">
            <div className="flex gap-20 items-center justify-center w-full">
              <div className="flex flex-col gap-2 text-l w-1/3">
                <p className="flex justify-between">
                  <span className="font-semibold">Phòng ban:</span>{" "}
                  <span className="font-bold">{employee.department}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">Chức vụ:</span>{" "}
                  <span className="font-bold">{employee.position}</span>
                </p>
              </div>

              <div className="h-20 w-[1px] border border-[#162F47]"></div>

              <div className="flex flex-col gap-2 text-l w-1/3">
                <p className="flex justify-between">
                  <span className="font-semibold">Vai trò:</span>{" "}
                  <span className="font-bold">{employee.roleName}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">Ngày vào làm:</span>{" "}
                  <span className="font-bold">{employee.startDate}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-2 border-[#162F47] rounded-2xl p-3 shadow-2xl mt-6">
          <div className="flex items-center gap-2 border-b border-[#162F47] pb-2">
            <FiUser size={22} className="text-[#162F47]" />
            <span className="text-[#162F47] font-semibold text-lg">Thông tin xã hội</span>
          </div>

          <div className="flex items-center justify-center mt-4 gap-20">
            <div className="flex gap-20 items-center justify-center w-full">
              <div className="flex flex-col gap-2 text-l w-1/3">
                <p className="flex justify-between">
                  <span className="font-semibold">Tên người liên hệ:</span>{" "}
                  <span className="font-bold">{employee.emergencyContactName}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">SĐT người liên hệ:</span>{" "}
                  <span className="font-bold">{employee.emergencyContactPhone}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">Mối quan hệ:</span>{" "}
                  <span className="font-bold">{employee.emergencyContactRelationship}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">Số bảo hiểm xã hội:</span>{" "}
                  <span className="font-bold">{employee.socialInsuranceNumber}</span>
                </p>
              </div>

              <div className="h-[120px] w-[1px] border border-[#162F47]"></div>

              <div className="flex flex-col gap-2 text-l w-1/3">
                <p className="flex justify-between">
                  <span className="font-semibold">Mã card:</span>{" "}
                  <span className="font-bold">{employee.idCard}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">Tài khoản ngân hàng:</span>{" "}
                  <span className="font-bold">{employee.bankAccount}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">Ngân hàng:</span>{" "}
                  <span className="font-bold">{employee.bankName}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">Mã tax:</span>{" "}
                  <span className="font-bold">{employee.taxCode}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {/* <div className="flex flex-row gap-6">

          <div className="space-y-3 text-sm w-1/2 pl-4">
            <p>

            <p>
              <span className="opacity-70"></span>{" "}
              {employee.socialInsuranceNumber}
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ProfilePage;
