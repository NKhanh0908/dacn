package com.hrm.dacn.services;

import java.time.LocalDate;

import com.hrm.dacn.dtos.WorkSchedule.request.WorkCalendarRequest;
import com.hrm.dacn.dtos.WorkSchedule.response.WorkCalendarResponse;

public interface WorkCalendarService {

    WorkCalendarResponse create(WorkCalendarRequest request);

    WorkCalendarResponse getByYear(Integer year);

    boolean isWorkingDay(LocalDate date);
}
