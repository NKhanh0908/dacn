package com.hrm.dacn.dtos.Attendance.request;

import com.hrm.dacn.enums.Attendance.RequestStatus;

import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * DTO cho duyệt/từ chối yêu cầu
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRequestReviewRequest {
    @NotNull(message = "Status is required")
    private RequestStatus status; // APPROVED or REJECTED

    private String reviewNote;
}