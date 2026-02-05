package com.hrm.dacn.dtos.WorkSchedule.request;

import java.time.DayOfWeek;
import java.util.Set;

import com.hrm.dacn.enums.Holiday.HolidayPolicy;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
public class WorkCalendarRequest {

    @NotNull
    @Min(2000)
    private Integer year;

    @NotBlank
    private String name;

    /**
     * Các thứ làm việc
     */
    @NotEmpty
    private Set<DayOfWeek> workingDays;

    @NotNull
    private HolidayPolicy holidayPolicy;

    private String description;
}
