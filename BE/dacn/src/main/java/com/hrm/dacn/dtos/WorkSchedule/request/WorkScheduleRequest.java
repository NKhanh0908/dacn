package com.hrm.dacn.dtos.WorkSchedule.request;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkScheduleRequest {

    @NotNull(message = "Schedule name is required")
    private String scheduleName;

    @NotNull(message = "Start time is required")
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime endTime;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime breakStartTime;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime breakEndTime;

    @Min(value = 0, message = "Late tolerance must be >= 0")
    private Integer lateToleranceMinutes = 0;

    @Min(value = 0, message = "Early leave tolerance must be >= 0")
    private Integer earlyLeaveToleranceMinutes = 0;

    private Boolean isDefault = false;
    private Boolean isActive = true;
}