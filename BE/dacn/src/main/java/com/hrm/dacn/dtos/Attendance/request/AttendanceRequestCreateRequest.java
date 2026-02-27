package com.hrm.dacn.dtos.Attendance.request;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

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

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime checkInTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime checkOutTime;

    @NotNull(message = "Request type is required")
    private RequestType requestType;

    @NotNull(message = "Reason is required")
    private String reason;
}