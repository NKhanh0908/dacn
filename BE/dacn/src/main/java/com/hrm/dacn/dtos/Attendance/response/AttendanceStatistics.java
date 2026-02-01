package com.hrm.dacn.dtos.Attendance.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceStatistics {
    private Long employeeId;
    private String employeeName;
    private Integer totalDays;
    private Integer presentDays;
    private Integer absentDays;
    private Integer lateDays;
    private Integer totalLateMinutes;
    private Integer earlyLeaveDays;
    private Integer totalEarlyLeaveMinutes;
    private Double totalOvertimeHours;
    private Double totalWorkHours;
}