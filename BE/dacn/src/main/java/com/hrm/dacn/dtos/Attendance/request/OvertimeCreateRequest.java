package com.hrm.dacn.dtos.Attendance.request;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OvertimeCreateRequest {

    private LocalDate overtimeDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String reason;
}