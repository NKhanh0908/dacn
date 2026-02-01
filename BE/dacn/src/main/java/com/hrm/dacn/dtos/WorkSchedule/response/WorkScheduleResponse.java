package com.hrm.dacn.dtos.WorkSchedule.response;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkScheduleResponse {
    private Long id;
    private String scheduleName;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime startTime;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime endTime;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime breakStartTime;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime breakEndTime;

    private Integer lateToleranceMinutes;
    private Integer earlyLeaveToleranceMinutes;
    private Boolean isDefault;
    private Boolean isActive;
}