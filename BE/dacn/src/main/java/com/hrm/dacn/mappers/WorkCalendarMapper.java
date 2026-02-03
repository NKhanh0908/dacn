package com.hrm.dacn.mappers;

import org.springframework.stereotype.Component;

import com.hrm.dacn.dtos.WorkSchedule.request.WorkCalendarRequest;
import com.hrm.dacn.dtos.WorkSchedule.response.WorkCalendarResponse;
import com.hrm.dacn.entities.WorkCalendar;

@Component
public class WorkCalendarMapper {

    public WorkCalendar toEntity(WorkCalendarRequest request) {
        return WorkCalendar.builder()
                .year(request.getYear())
                .name(request.getName())
                .workingDays(request.getWorkingDays())
                .holidayPolicy(request.getHolidayPolicy())
                .isActive(true)
                .description(request.getDescription())
                .build();
    }

    public WorkCalendarResponse toResponse(WorkCalendar entity) {
        return WorkCalendarResponse.builder()
                .id(entity.getId())
                .year(entity.getYear())
                .name(entity.getName())
                .workingDays(entity.getWorkingDays())
                .holidayPolicy(entity.getHolidayPolicy())
                .isActive(entity.getIsActive())
                .description(entity.getDescription())
                .build();
    }
}
