package com.hrm.dacn.dtos.Attendance.request;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.hrm.dacn.enums.Attendance.CheckMethod;
import lombok.*;

// DTO cho tạo chấm công thủ công (HR)

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceCreateRequest {
    private Long employeeId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate attendanceDate;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime checkInTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime checkOutTime;

    private CheckMethod checkInMethod = CheckMethod.MANUAL;
    private CheckMethod checkOutMethod = CheckMethod.MANUAL;
    private String note;
}