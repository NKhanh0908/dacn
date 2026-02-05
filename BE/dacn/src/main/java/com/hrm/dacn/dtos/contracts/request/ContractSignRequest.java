package com.hrm.dacn.dtos.contracts.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

/**
 * DTO để ký hợp đồng
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractSignRequest {

    @NotBlank(message = "Người ký không được để trống")
    @Pattern(regexp = "EMPLOYEE|EMPLOYER", message = "Người ký phải là EMPLOYEE hoặc EMPLOYER")
    private String signedBy; // "EMPLOYEE" hoặc "EMPLOYER"

    private String signatureData; // Chữ ký số (nếu có)
    private String ipAddress; // IP address của người ký
    private String notes;
}





/**
 * DTO để tạo phụ lục hợp đồng
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class ContractAnnexCreateRequest {

    @NotNull(message = "ID hợp đồng không được để trống")
    private Long contractId;

    @NotBlank(message = "Số phụ lục không được để trống")
    private String annexNumber;

    @NotBlank(message = "Loại phụ lục không được để trống")
    private String annexType; // SALARY_ADJUSTMENT, POSITION_CHANGE, EXTENSION, etc.

    @NotNull(message = "Ngày hiệu lực không được để trống")
    private LocalDate effectiveDate;

    private LocalDate expiryDate;

    // Thay đổi lương
    @Positive(message = "Lương mới phải > 0")
    private java.math.BigDecimal newBasicSalary;

    @PositiveOrZero(message = "Phụ cấp mới phải >= 0")
    private java.math.BigDecimal newAllowances;

    // Thay đổi vị trí
    private String newPosition;
    private String newDepartment;
    private Long newWorkLocationId;

    // Thay đổi công việc
    private String newJobDescription;

    // Nội dung chi tiết
    private String content;

    @NotBlank(message = "Lý do ký phụ lục không được để trống")
    private String reason;

    private String notes;
}