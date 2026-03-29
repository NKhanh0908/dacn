import { FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useEmployeeContext } from "../../context";

const initialForm = {
  phone: "",
  address: "",
  email: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelationship: "",
  idCard: "",
  bankAccount: "",
  bankName: "",
  bankLogo: ""
};

const EditProfile = ({ show, onClose }) => {
  const { employee, loadingEmployee, updateMyProfile } = useEmployeeContext();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [banks, setBanks] = useState([]);
  const [openBank, setOpenBank] = useState(false);
  const [errors, setErrors] = useState({});

  /*===== Lấy danh sách ngân hàng =====*/
  useEffect(() => {
    const fetchBanks = async () => {
      const res = await fetch("https://api.vietqr.io/v2/banks");
      const data = await res.json();
      setBanks(data.data || []);
    };
    fetchBanks();
  }, []);

  /*===== Khi mở Modal -> Đổ data vào form =====*/
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
        idCard: employee.idCard || "",
        bankAccount: employee.bankAccount || "",
        bankName: employee.bankName || "",
        bankLogo: bank?.logo || ""
      });
    }
  }, [employee, show, banks]);

  if (!show || loadingEmployee || !employee) return null;

  /*===== Handle Input =====*/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };

  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^(0[0-9]{9}|\+84[0-9]{9})$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
    const idCardRegex = /^[0-9]{9}$|^[0-9]{12}$/;

    // ===== REQUIRED =====
    Object.keys(form).forEach((key) => {
      if (!form[key] || form[key].trim() === "") {
        newErrors[key] = "Không được để trống";
      }
    });

    // ===== FORMAT =====
    if (form.phone && !phoneRegex.test(form.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (form.emergencyContactPhone && !phoneRegex.test(form.emergencyContactPhone)) {
      newErrors.emergencyContactPhone = "SĐT liên hệ không hợp lệ";
    }

    if (form.email && !emailRegex.test(form.email)) {
      newErrors.email = "Email phải đúng định dạng (gmail/yahoo/outlook)";
    }

    if (form.idCard && !idCardRegex.test(form.idCard)) {
      newErrors.idCard = "CMND/CCCD phải 9 hoặc 12 số";
    }

    if (form.bankAccount && !/^[0-9]{9,20}$/.test(form.bankAccount)) {
      newErrors.bankAccount = "Tài khoản ngân hàng không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /*===== Đóng modal + reset =====*/
  const handleClose = () => {
    setForm(initialForm);
    setOpenBank(false);
    onClose();
  };

  /*===== Submit =====*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      alert("Vui lòng kiểm tra lại thông tin");
      return;
    }
    setSaving(true);

    try {
      const formData = new FormData();

      // ===== field được phép sửa =====
      formData.append("phone", form.phone || "");
      formData.append("address", form.address || "");
      formData.append("email", form.email || "");
      formData.append("emergencyContactName", form.emergencyContactName || "");
      formData.append("emergencyContactPhone", form.emergencyContactPhone || "");
      formData.append("emergencyContactRelationship", form.emergencyContactRelationship || "");
      formData.append("idCard", form.idCard || "");
      formData.append("bankAccount", form.bankAccount || "");
      formData.append("bankName", form.bankName || "");

      // ===== field backend bắt buộc (do bạn dùng PUT) =====
      formData.append("fullName", employee.fullName || "");
      formData.append("dateOfBirth", employee.dateOfBirth || "");
      formData.append("gender", employee.gender || "");
      formData.append("department", employee.department || "");
      formData.append("position", employee.position || "");
      formData.append("roleId", employee.roleId || "");
      formData.append("status", employee.status || "");
      formData.append("startDate", employee.startDate || "");
      formData.append("taxCode", employee.taxCode || "");
      formData.append("socialInsuranceNumber", employee.socialInsuranceNumber || "");

      console.log("FORM DATA:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      await updateMyProfile(formData);
      handleClose();
    } catch (err) {
      console.error(err);
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
        <div className="bg-gray-200 p-4 border-[1px] border-[#162F47] rounded-2xl shadow-2xl">
          <div className="border-b-[1px] border-[#162F47]">
            <h3 className="font-semibold">Thông tin cá nhân</h3>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <Input name="phone" label="Số điện thoại" value={form.phone || ""} onChange={handleChange} error={errors.phone} />
              <Input name="email" label="Email" value={form.email || ""} onChange={handleChange} error={errors.email} />
            </div>
            <div>
              <TextArea name="address" label="Địa chỉ" value={form.address || ""} onChange={handleChange} error={errors.address} />
            </div>
          </div>
        </div>

        {/* =====================Thông tin xã hội===================== */}
        <div className="bg-blue-100 p-4 border-[1px] border-[#162F47] rounded-2xl shadow-2xl mt-6">
          <div className="border-b-[1px] border-[#162F47]">
            <h3 className="font-semibold">Thông tin xã hội</h3>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <Input name="emergencyContactName" label="Người liên hệ" value={form.emergencyContactName || ""} onChange={handleChange} error={errors.emergencyContactName} />
              <Input name="emergencyContactPhone" label="SĐT người liên hệ" value={form.emergencyContactPhone || ""} onChange={handleChange} error={errors.emergencyContactPhone} />
              <Input name="emergencyContactRelationship" label="Mối quan hệ" value={form.emergencyContactRelationship || ""} onChange={handleChange} error={errors.emergencyContactRelationship} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input name="idCard" label="CMND/CCCD" value={form.idCard || ""} onChange={handleChange} error={errors.idCard} />
              <Input name="bankAccount" label="Tài khoản ngân hàng" value={form.bankAccount || ""} onChange={handleChange} error={errors.bankAccount} />
              <div className="relative">
                <label className="text-xs font-semibold text-gray-500">
                  Ngân hàng
                </label>

                <div
                  onClick={() => setOpenBank(!openBank)}
                  className={`w-full px-3 py-2 border rounded-lg mt-1 cursor-pointer flex items-center justify-between bg-white ${
                    errors.bankName ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {form.bankLogo ? (
                      <img src={form.bankLogo} alt="bank" className="w-6 h-6 object-contain"/>
                    ) : (
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    )}
                    <span>{form.bankName || "Chọn ngân hàng"}</span>
                  </div>
                </div>

                {errors.bankName && (
                  <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>
                )}

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

        <div className="flex items-center justify-center mt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-1/2 bg-[#162F47] text-white text-xl font-semibold px-4 py-2 rounded-2xl hover:bg-blue-500"
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
};

// ================= COMPONENT =================
const Input = ({ label, error, ...props }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500">{label}</label>

    <input
      {...props}
      className={`w-full px-3 py-2 border rounded-lg mt-1 outline-none ${
        error ? "border-red-500 focus:ring-2 focus:ring-red-300" : "border-gray-300"
      }`}
    />

    {error && (
      <p className="text-red-500 text-xs mt-1">{error}</p>
    )}
  </div>
);

const TextArea = ({ label, error, className = "", ...props }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500">{label}</label>

    <textarea
      {...props}
      className={`w-full px-3 py-2 h-[50px] border rounded-lg mt-1 outline-none ${
        error ? "border-red-500 focus:ring-2 focus:ring-red-300" : "border-gray-300"
      } ${className}`}
      rows={3}
    />

    {error && (
      <p className="text-red-500 text-xs mt-1">{error}</p>
    )}
  </div>
);

export default EditProfile;