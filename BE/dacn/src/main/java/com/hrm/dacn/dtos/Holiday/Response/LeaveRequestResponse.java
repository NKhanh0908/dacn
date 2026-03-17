package com.hrm.dacn.dtos.Holiday.Response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.hrm.dacn.enums.Holiday.LeaveDuration;
import com.hrm.dacn.enums.Holiday.LeaveStatus;
import com.hrm.dacn.enums.Holiday.LeaveType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequestResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private LocalDate startDate;
    private LocalDate endDate;
    private LeaveType leaveType;
    private LeaveDuration duration;
    private Double totalDays;
    private String reason;
    private String attachmentUrl;
    private LeaveStatus status;
    private Long approvedById;
    private String approvedByName;
    private LocalDateTime approvedAt;
    private String rejectReason;
    private LocalDateTime createdAt;
    private Boolean attendanceGenerated;
}