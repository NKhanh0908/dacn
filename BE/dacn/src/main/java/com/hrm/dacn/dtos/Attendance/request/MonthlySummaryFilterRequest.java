package com.hrm.dacn.dtos.Attendance.request;

import lombok.*;

/**
 * DTO cho filter tổng kết tháng
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySummaryFilterRequest {
    private Long employeeId;
    private Integer year;
    private Integer month;
    private Boolean isFinalized;
}
