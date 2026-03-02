package com.hrm.dacn.dtos.Attendance.response;

import com.hrm.dacn.enums.Attendance.OvertimeStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor

@Getter
@Setter
@Builder
public class OvertimeResponse {

    private Long id;

    private Long employeeId;
    private String employeeName;

    private LocalDate overtimeDate;
    private LocalTime startTime;
    private LocalTime endTime;

    private String reason;

    private OvertimeStatus status;

    private LocalDateTime approvedAt;
    private Long approvedBy;
}
