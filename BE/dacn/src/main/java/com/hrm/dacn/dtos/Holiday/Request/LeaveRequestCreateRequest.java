package com.hrm.dacn.dtos.Holiday.Request;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

import com.hrm.dacn.enums.Holiday.LeaveDuration;
import com.hrm.dacn.enums.Holiday.LeaveType;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveRequestCreateRequest {
    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotNull(message = "Leave type is required")
    private LeaveType leaveType;

    @NotNull(message = "Duration is required")
    private LeaveDuration duration;

    private String reason;

    private String attachmentUrl;
}