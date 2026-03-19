package com.hrm.dacn.dtos.Employee.Request;

import lombok.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

import com.hrm.dacn.enums.Employee.EmployeeStatus;
import com.hrm.dacn.enums.Employee.Gender;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeUpdateRequest {

    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    private Gender gender;

    @Pattern(regexp = "^[0-9]{9}$|^[0-9]{12}$", message = "ID card number must be 9 or 12 digits")
    private String idCard;

    @Pattern(regexp = "^(0|\\+84)[0-9]{9,10}$", message = "Invalid phone number format")
    private String phone;

    @Email(message = "Invalid email address")
    private String email;

    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String address;

    private String department;

    private String position;

    private Long roleId;

    @PastOrPresent(message = "Start date cannot be in the future")
    private LocalDate startDate;

    private EmployeeStatus status;

    @Pattern(regexp = "^[0-9]{9,20}$", message = "Bank account number must contain 9 to 20 digits")
    private String bankAccount;

    @Size(max = 100, message = "Bank name must not exceed 100 characters")
    private String bankName;

    @Pattern(regexp = "^[0-9]{10}$|^[0-9]{13}$", message = "Tax code must be 10 or 13 digits")
    private String taxCode;

    @Pattern(regexp = "^[0-9]{10}$", message = "Social insurance number must be exactly 10 digits")
    private String socialInsuranceNumber;


    private MultipartFile image;

    // Emergency contact information
    @Size(max = 100, message = "Emergency contact name must not exceed 100 characters")
    private String emergencyContactName;

    @Pattern(regexp = "^(0|\\+84)[0-9]{9,10}$", message = "Invalid emergency contact phone number")
    private String emergencyContactPhone;

    @Size(max = 50, message = "Emergency contact relationship must not exceed 50 characters")
    private String emergencyContactRelationship;
}