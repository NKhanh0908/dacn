package com.hrm.dacn.dtos.Attendance.request;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.hrm.dacn.enums.Attendance.AttendanceStatus;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceUpdateRequest {
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime checkInTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime checkOutTime;

    private AttendanceStatus status;
    private String note;
    private Boolean isApproved;
}
