package com.hrm.dacn.dtos.WorkSchedule.request;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkScheduleRequest {

    @NotNull
    private String scheduleName;

    @NotNull
    @Schema(type = "string", format = "time", example = "08:30")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime startTime;

    @NotNull
    @Schema(type = "string", format = "time", example = "17:30")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime endTime;

    @Schema(type = "string", format = "time", example = "12:00")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime breakStartTime;

    @Schema(type = "string", format = "time", example = "13:00")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime breakEndTime;

    @Min(0)
    private Integer lateToleranceMinutes = 0;

    @Min(0)
    private Integer earlyLeaveToleranceMinutes = 0;

    private Boolean isDefault = false;
    private Boolean isActive = true;
}