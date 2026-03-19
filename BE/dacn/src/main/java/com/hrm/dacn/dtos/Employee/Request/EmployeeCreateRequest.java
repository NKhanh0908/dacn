package com.hrm.dacn.dtos.Employee.Request;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "Request object for creating a new employee")
public class EmployeeCreateRequest {

    @NotBlank(message = "Full name must not be blank")
    @Size(min = 2, max = 100)
    @Schema(example = "Nguyen Van A")
    private String fullName;

    @Past
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Schema(type = "string", format = "date", example = "1995-08-20")
    private LocalDate dateOfBirth;

    @Schema(example = "MALE")
    private Gender gender;

    @Pattern(regexp = "^[0-9]{9}$|^[0-9]{12}$")
    @Schema(example = "012345678901")
    private String idCard;

    @Pattern(regexp = "^(0|\\+84)[0-9]{9,10}$")
    @Schema(example = "0912345678")
    private String phone;

    @Email
    @Schema(example = "nguyenvana@gmail.com")
    private String email;

    @Size(max = 255)
    @Schema(example = "123 Nguyen Trai, District 1, Ho Chi Minh City")
    private String address;

    @NotBlank
    @Schema(example = "IT Department")
    private String department;

    @NotBlank
    @Schema(example = "Backend Developer")
    private String position;

    @Schema(example = "1")
    private Long roleId;

    @NotNull
    @PastOrPresent
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Schema(type = "string", format = "date", example = "2024-01-15")
    private LocalDate startDate;

    @Schema(example = "WORKING")
    private EmployeeStatus status;

    @Pattern(regexp = "^[0-9]{9,20}$")
    @Schema(example = "1234567890123")
    private String bankAccount;

    @Size(max = 100)
    @Schema(example = "Vietcombank")
    private String bankName;

    @Pattern(regexp = "^[0-9]{10}$|^[0-9]{13}$")
    @Schema(example = "1234567890")
    private String taxCode;

    @Pattern(regexp = "^[0-9]{10}$")
    @Schema(example = "0123456789")
    private String socialInsuranceNumber;

    private MultipartFile image;

    @Size(max = 100)
    @Schema(example = "Tran Thi B")
    private String emergencyContactName;

    @Pattern(regexp = "^(0|\\+84)[0-9]{9,10}$")
    @Schema(example = "0987654321")
    private String emergencyContactPhone;

    @Size(max = 50)
    @Schema(example = "Mother")
    private String emergencyContactRelationship;
}