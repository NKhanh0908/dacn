package com.hrm.dacn.dtos.Employee.Response;

import lombok.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.hrm.dacn.enums.Employee.EmployeeStatus;
import com.hrm.dacn.enums.Employee.Gender;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class EmployeeResponse {

    private Long employeeId;
    private String fullName;
    private LocalDate dateOfBirth;
    private Integer age;
    private Gender gender;
    private String genderDisplay;
    private String idCard;
    private String phone;
    private String email;
    private String address;
    private String department;
    private String position;
    private Long roleId;
    private String roleName;
    private LocalDate startDate;
    private Integer yearsOfService;
    private EmployeeStatus status;
    private String statusDisplay;
    private String bankAccount;
    private String bankName;
    private String taxCode;
    private String socialInsuranceNumber;
    private String avatarUrl;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String emergencyContactRelationship;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}