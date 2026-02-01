package com.hrm.dacn.dtos.Attendance.request;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.hrm.dacn.enums.Attendance.AttendanceStatus;
import lombok.*;

// * DTO cho filter chấm công

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceFilterRequest {
    private Long employeeId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    private AttendanceStatus status;
    private Boolean isApproved;
    private Boolean isManualEntry;
}