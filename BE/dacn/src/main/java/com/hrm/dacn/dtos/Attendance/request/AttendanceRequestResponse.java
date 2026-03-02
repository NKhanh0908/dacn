package com.hrm.dacn.dtos.Attendance.request;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.hrm.dacn.enums.Attendance.RequestStatus;
import com.hrm.dacn.enums.Attendance.RequestType;

/**
 * DTO cho response yêu cầu chấm công
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceRequestResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate requestDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime checkInTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime checkOutTime;

    private RequestType requestType;
    private String reason;
    private RequestStatus status;
    private String reviewedByName;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime reviewedAt;

    private String reviewNote;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
}
