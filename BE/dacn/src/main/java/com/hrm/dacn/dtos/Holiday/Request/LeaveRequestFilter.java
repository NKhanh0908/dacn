package com.hrm.dacn.dtos.Holiday.Request;

import java.time.LocalDate;

import com.hrm.dacn.enums.Holiday.LeaveStatus;
import com.hrm.dacn.enums.Holiday.LeaveType;

import lombok.Data;
import lombok.Getter;

@Getter
@Data
public class LeaveRequestFilter {
    private LeaveStatus status;
    private LeaveType type;
    private LocalDate fromDate;
    private LocalDate toDate;
    private Long employeeId;
    private String keyword;
}