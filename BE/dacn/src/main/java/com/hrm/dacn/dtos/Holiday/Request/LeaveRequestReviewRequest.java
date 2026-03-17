package com.hrm.dacn.dtos.Holiday.Request;

import com.hrm.dacn.enums.Holiday.LeaveStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequestReviewRequest {

    @NotNull(message = "Status is required")
    private LeaveStatus status; // chỉ nhận APPROVED hoặc REJECTED

    @Size(max = 500)
    private String rejectReason; // bắt buộc khi status = REJECTED
}