package com.hrm.dacn.dtos.Attendance.request;

import jakarta.validation.constraints.*;
import lombok.*;

/**
 * DTO cho tạo/cập nhật tổng kết tháng
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySummaryRequest {
    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Year is required")
    @Min(value = 2020, message = "Year must be >= 2020")
    @Max(value = 2100, message = "Year must be <= 2100")
    private Integer year;

    @NotNull(message = "Month is required")
    @Min(value = 1, message = "Month must be >= 1")
    @Max(value = 12, message = "Month must be <= 12")
    private Integer month;
}
