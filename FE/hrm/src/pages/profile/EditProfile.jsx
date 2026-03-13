import { FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useEmployeeContext } from "../../context/EmployeeContext";
import { updateEmployee } from "../../services/employee/EmployeeService";

const EditProfile = ({ show, onClose }) => {
  const { employee, loading, setEmployee } = useEmployeeContext();
  const [form, setForm] = useState({
    phone: "",
    address: "",
    email: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    bankAccount: "",
    bankName: "",
    bankLogo: ""
  });
  const [saving, setSaving] = useState(false);
  const [banks, setBanks] = useState([]);
  const [openBank, setOpenBank] = useState(false);

  /*=====Lấy danh sách ngân hàng=====*/
  useEffect(() => {
    const fetchBanks = async () => {
      const res = await fetch("https://api.vietqr.io/v2/banks");
      const data = await res.json();
      setBanks(data.data);
    };
    fetchBanks();
  }, []);

  /*=====Khi mở Modal -> Đổ data vào form=====*/
  useEffect(() => {
    if (employee && show) {
      const bank = banks.find(
        (b) => b.shortName === employee.bankName
      );

      setForm({
        phone: employee.phone || "",
        address: employee.address || "",
        email: employee.email || "",
        emergencyContactName: employee.emergencyContactName || "",
        emergencyContactPhone: employee.emergencyContactPhone || "",
        emergencyContactRelationship: employee.emergencyContactRelationship || "",
        bankAccount: employee.bankAccount || "",
        bankName: employee.bankName || "",
        bankLogo: bank?.logo || ""
      });
    }
  }, [employee, show, banks]);

  if (!show || loading || !employee) return null;

  /*=====Handle Input Change======*/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /*=====Submit update profile=====*/
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
      {/* Form chỉnh sửa Profile */}
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-4xl relative border-2 border-[#162F47] rounded-2xl p-3 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-[#162F47] pb-2">
          <h2 className="text-xl font-bold">Cập nhật thông tin</h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* =====================Thông tin cá nhân===================== */}
        <div className="border-[1px] border-[#162F47] rounded-2xl p-2 shadow-2xl">
          <p className="text-[#162F47] font-semibold text-lg">
            Thông tin cá nhân
          </p>
          <div className="flex flex-col gap-1 mt-2 mb-2">
            <div className="flex items-center gap-3">
              <p className="flex items-center w-1/2">
                <span className="font-semibold w-2/4">
                  Số điện thoại:
                </span>
                <input
                  name="phone"
                  value={form.phone || ""}
                  onChange={handleChange}
                  placeholder="Số điện thoại"
                  className="w-full border-[1px] border-[#162F47] p-2 rounded"
                />
              </p>
              <p className="flex items-center w-1/2">
                <span className="font-semibold w-2/4">
                  Email:
                </span>
                <input
                  name="email"
                  value={form.email || ""}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full border-[1px] border-[#162F47] p-2 rounded"
                />
              </p>
            </div>

            <div className="flex items-center">
              <span className="font-semibold w-[165px]">
                Địa chỉ:
              </span>
              <textarea
                name="address"
                value={form.address || ""}
                onChange={handleChange}
                className="w-full border-[1px] border-[#162F47] p-2 rounded resize-none"
              />
            </div>
          </div>
        </div>

        {/* =====================Thông tin xã hội===================== */}
        <div className="border-[1px] border-[#162F47] rounded-2xl p-2 mt-2 shadow-2xl">
          <p className="text-[#162F47] font-semibold text-lg">
            Thông tin xã hội
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-1/2 flex flex-col gap-1">
              <p className="flex items-center">
                <span className="font-semibold w-2/3">
                  Người liên hệ:
                </span>
                <input
                  name="emergencyContactName"
                  value={form.emergencyContactName || ""}
                  onChange={handleChange}
                  placeholder="Tên người liên hệ"
                  className="w-full border-[1px] border-[#162F47] p-2 rounded w-[269px]"
                />
              </p>
              <p className="flex items-center">
                <span className="font-semibold w-2/3">
                  SĐT người liên hệ:
                </span>
                <input
                  name="emergencyContactPhone"
                  value={form.emergencyContactPhone || ""}
                  onChange={handleChange}
                  placeholder="SĐT người liên hệ"
                  className="w-full border-[1px] border-[#162F47] p-2 rounded w-[269px]"
                />
              </p>
              <p className="flex items-center">
                <span className="font-semibold w-2/3">
                  Mối quan hệ:
                </span>
                <input
                  name="emergencyContactRelationship"
                  value={form.emergencyContactRelationship || ""}
                  onChange={handleChange}
                  placeholder="Mối quan hệ"
                  className="w-full border-[1px] border-[#162F47] p-2 rounded w-[269px]"
                />
              </p>
            </div>

            <div className="h-40 w-[1px] border border-[#162F47]"></div>

            <div className="w-1/2 flex flex-col gap-1">
              <p className="flex items-center">
                <span className="font-semibold w-5/6">
                  Tài khoản ngân hàng:
                </span>
                <input
                  name="bankAccount"
                  value={form.bankAccount || ""}
                  onChange={handleChange}
                  placeholder="Tài khoản ngân hàng"
                  className="w-full border-[1px] border-[#162F47] p-2 rounded w-[269px]"
                />
              </p>
              <div className="flex items-center">
                <span className="font-semibold w-[220px]">
                  Tên ngân hàng:
                </span>
                <div className="relative w-[269px]">
                  <div
                    onClick={() => setOpenBank(!openBank)}
                    className="border border-[#162F47] p-2 rounded cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {form.bankLogo ? (
                        <img
                          src={form.bankLogo}
                          alt="bank"
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gray-200 rounded"></div>
                      )}
                      <span>
                        {form.bankName || "Chọn ngân hàng"}
                      </span>
                    </div>
                  </div>

                  {openBank && (
                    <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white border rounded shadow">
                      {banks.map((bank) => (
                        <div
                          key={bank.id}
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              bankName: bank.shortName,
                              bankLogo: bank.logo
                            }));
                            setOpenBank(false);
                          }}
                          className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <img
                            src={bank.logo}
                            alt={bank.shortName}
                            className="w-6 h-6 object-contain"
                          />
                          <span>{bank.shortName}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-1/2 bg-[#162F47] text-white py-2 rounded-xl hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;