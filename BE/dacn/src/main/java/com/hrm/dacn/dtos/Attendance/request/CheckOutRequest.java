package com.hrm.dacn.dtos.Attendance.request;

import com.hrm.dacn.enums.Attendance.CheckMethod;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckOutRequest {
    private CheckMethod method = CheckMethod.BUTTON;
    private String note;
}
