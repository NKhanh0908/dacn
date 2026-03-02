package com.hrm.dacn.dtos.Attendance.request;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.enums.Attendance.RequestStatus;
import com.hrm.dacn.enums.Attendance.RequestType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceRequest {

    private Long id;

    private Employee employee;

    private LocalDate requestDate;

    private LocalTime checkInTime;

    private LocalTime checkOutTime;

    private RequestType requestType;

    private String reason;

    private RequestStatus status;

    private Employee reviewedBy;

    private LocalDateTime reviewedAt;

    private String reviewNote;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
