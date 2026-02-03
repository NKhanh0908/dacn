package com.hrm.dacn.dtos.WorkSchedule.response;

import java.time.DayOfWeek;
import java.util.Set;

import com.hrm.dacn.enums.Holiday.HolidayPolicy;

import lombok.*;

@Getter
@Setter
@Builder
public class WorkCalendarResponse {

    private Long id;

    private Integer year;

    private String name;

    private Set<DayOfWeek> workingDays;

    private HolidayPolicy holidayPolicy;

    private Boolean isActive;

    private String description;
}
