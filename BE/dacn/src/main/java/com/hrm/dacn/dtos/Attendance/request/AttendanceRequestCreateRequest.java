package com.hrm.dacn.dtos.Attendance.request;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.hrm.dacn.enums.Attendance.RequestType;

import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * DTO cho tạo yêu cầu chấm công
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRequestCreateRequest {
    @NotNull(message = "Request date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate requestDate;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime checkInTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime checkOutTime;

    @NotNull(message = "Request type is required")
    private RequestType requestType;

    @NotNull(message = "Reason is required")
    private String reason;
}