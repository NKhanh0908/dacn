package com.hrm.dacn.dtos.Attendance.response;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.*;

/**
 * DTO cho response tổng kết tháng
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlySummaryResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private Integer year;
    private Integer month;
    private Integer totalWorkingDays;
    private Integer totalPresentDays;
    private Integer totalAbsentDays;
    private Integer totalLateDays;
    private Integer totalLateMinutes;
    private Integer totalEarlyLeaveDays;
    private Integer totalEarlyLeaveMinutes;
    private Double totalOvertimeHours;
    private Integer totalLeaveDays;
    private Integer totalBusinessTripDays;
    private Double totalWorkHours;
    private Boolean isFinalized;
    private String finalizedByName;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime finalizedAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
}