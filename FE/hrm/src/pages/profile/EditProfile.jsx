import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { useEmployeeContext } from "../../context/EmployeeContext";
import { updateEmployee } from "../../services/employee/EmployeeService";

const EditProfile = ({ show, onClose }) => {
  const { employee, loading, setEmployee } = useEmployeeContext();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  // Khi mở modal → đổ data vào form
  useEffect(() => {
  if (employee && show) {
    setForm({
    phone: employee.phone || "",
    address: employee.address || "",
    email: employee.email || "",
    emergencyContactName: employee.emergencyContactName || "",
    emergencyContactPhone: employee.emergencyContactPhone || "",
    relationship: employee.relationship || "",
    bankAccount: employee.bankAccount || "",
    bankName: employee.bankName || "",
    });
  }
  }, [employee, show]);

  if (!show || loading || !employee) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await updateEmployee(employee.employeeId, form);

      setEmployee(res.data);

      onClose();
    } catch (err) {
      console.error("Update profile failed", err);
      alert("Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-4xl relative border-2 border-[#162F47] rounded-2xl p-3 shadow-2xl">
        <div className="flex items-center justify-between mb-4 border-b border-[#162F47] pb-2">
          <h2 className="text-xl font-bold">Cập nhật thông tin</h2>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <FiX size={22} />
          </button>
        </div>

        <div className="flex items-center gap-3 justify-center">
          <div className="flex flex-col gap-2 text-l w-1/2">
            <p className="flex justify-between items-center">
              <span className="font-semibold">Số điện thoại:</span>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Số điện thoại"
                className="w-full border-[1px] border-[#162F47] p-2 rounded w-[269px]"
              />
            </p>
            <p className="flex justify-between items-center">
              <span className="font-semibold">Email:</span>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border-[1px] border-[#162F47] p-2 rounded w-[269px]"
              />
            </p>
            <p className="flex justify-between items-center">
              <span className="font-semibold">Địa chỉ:</span>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Địa chỉ"
                className="w-full border-[1px] border-[#162F47] p-2 rounded w-[269px] h-24 resize-none"
              />
            </p>
          </div>

          <div className="h-60 w-[1px] border border-[#162F47]"></div>

          <div className="flex flex-col gap-2 text-l w-1/2">
            <p className="flex justify-between items-center">
              <span className="font-semibold">Người liên hệ:</span>
              <input
                name="emergencyContactName"
                value={form.emergencyContactName}
                onChange={handleChange}
                placeholder="Tên người liên hệ"
                className="w-full border-[1px] border-[#162F47] p-2 rounded w-[269px]"
              />
            </p>
            <p className="flex justify-between items-center">
              <span className="font-semibold">SĐT người liên hệ:</span>
              <input
                name="emergencyContactPhone"
                value={form.emergencyContactPhone}
                onChange={handleChange}
                placeholder="SĐT người liên hệ"
                className="w-full border-[1px] border-[#162F47] p-2 rounded w-[269px]"
              />
            </p>
            <p className="flex justify-between items-center">
              <span className="font-semibold">Mối quan hệ:</span>
              <input
                name="relationship"
                value={form.relationship}
                onChange={handleChange}
                placeholder="Mối quan hệ"
                className="w-full border-[1px] border-[#162F47] p-2 rounded w-[269px]"
              />
            </p>
            <p className="flex justify-between items-center">
              <span className="font-semibold">Tài khoản ngân hàng:</span>
              <input
                name="bankAccount"
                value={form.bankAccount}
                onChange={handleChange}
                placeholder="Tài khoản ngân hàng"
                className="w-full border-[1px] border-[#162F47] p-2 rounded w-[269px]"
              />
            </p>
            <p className="flex justify-between items-center">
              <span className="font-semibold">Tên ngân hàng:</span>
              <input
                name="bankName"
                value={form.bankName}
                onChange={handleChange}
                placeholder="Ngân hàng"
                className="w-full border-[1px] border-[#162F47] p-2 rounded w-[269px]"
              />
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center mt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-1/2 bg-[#162F47] text-white py-2 rounded hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;