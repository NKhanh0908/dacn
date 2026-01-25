package com.hrm.dacn.dtos.Employee.Request;

import lombok.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

import com.hrm.dacn.enums.Employee.EmployeeStatus;
import com.hrm.dacn.enums.Employee.Gender;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeCreateRequest {

    @NotBlank(message = "Họ tên không được để trống")
    @Size(min = 2, max = 100, message = "Họ tên phải từ 2-100 ký tự")
    private String fullName;

    @Past(message = "Ngày sinh phải là ngày trong quá khứ")
    private LocalDate dateOfBirth;

    private Gender gender;

    @Pattern(regexp = "^[0-9]{9}$|^[0-9]{12}$", message = "CMND/CCCD phải là 9 hoặc 12 số")
    private String idCard;

    @Pattern(regexp = "^(0|\\+84)[0-9]{9,10}$", message = "Số điện thoại không hợp lệ")
    private String phone;

    @Email(message = "Email không hợp lệ")
    private String email;

    @Size(max = 255, message = "Địa chỉ không quá 255 ký tự")
    private String address;

    @NotBlank(message = "Phòng ban không được để trống")
    private String department;

    @NotBlank(message = "Chức vụ không được để trống")
    private String position;

    private Long roleId;

    @NotNull(message = "Ngày bắt đầu làm việc không được để trống")
    @PastOrPresent(message = "Ngày bắt đầu không được trong tương lai")
    private LocalDate startDate;

    private EmployeeStatus status;

    @Pattern(regexp = "^[0-9]{9,20}$", message = "Số tài khoản không hợp lệ")
    private String bankAccount;

    @Size(max = 100, message = "Tên ngân hàng không quá 100 ký tự")
    private String bankName;

    @Pattern(regexp = "^[0-9]{10}$|^[0-9]{13}$", message = "Mã số thuế phải là 10 hoặc 13 số")
    private String taxCode;

    @Pattern(regexp = "^[0-9]{10}$", message = "Số BHXH phải là 10 số")
    private String socialInsuranceNumber;

    private String avatarUrl;

    // Thông tin liên hệ khẩn cấp
    @Size(max = 100, message = "Tên người liên hệ không quá 100 ký tự")
    private String emergencyContactName;

    @Pattern(regexp = "^(0|\\+84)[0-9]{9,10}$", message = "Số điện thoại người liên hệ không hợp lệ")
    private String emergencyContactPhone;

    @Size(max = 50, message = "Mối quan hệ không quá 50 ký tự")
    private String emergencyContactRelationship;
}