package com.hrm.dacn.dtos.Employee.Request;

import lombok.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

import com.hrm.dacn.enums.EmployeeStatus;
import com.hrm.dacn.enums.Gender;

@Getter
@Builder
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeUpdateRequest {

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

    private String department;

    private String position;

    private Long roleId;

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

    private String emergencyContactName;

    private String emergencyContactPhone;

    private String emergencyContactRelationship;
}