package com.hrm.dacn.services.impl;

import java.time.LocalDate;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hrm.dacn.dtos.WorkSchedule.request.WorkCalendarRequest;
import com.hrm.dacn.dtos.WorkSchedule.response.WorkCalendarResponse;
import com.hrm.dacn.entities.WorkCalendar;
import com.hrm.dacn.enums.Holiday.HolidayPolicy;
import com.hrm.dacn.exceptions.CustomException;
import com.hrm.dacn.exceptions.Error;
import com.hrm.dacn.mappers.WorkCalendarMapper;
import com.hrm.dacn.repositories.WorkCalendarRepository;
import com.hrm.dacn.services.HolidayService;
import com.hrm.dacn.services.WorkCalendarService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class WorkCalendarServiceImpl implements WorkCalendarService {

    private final WorkCalendarRepository calendarRepository;
    private final WorkCalendarMapper calendarMapper;
    private final HolidayService holidayService;

    @Override
    public WorkCalendarResponse create(WorkCalendarRequest request) {

        // Mỗi năm chỉ có 1 WorkCalendar
        if (calendarRepository.existsByYear(request.getYear())) {
            throw new CustomException(Error.WORK_CALENDAR_ALREADY_EXISTS);
        }

        WorkCalendar calendar = calendarMapper.toEntity(request);

        calendar = calendarRepository.save(calendar);

        log.info("WorkCalendar created for year {}", request.getYear());

        return calendarMapper.toResponse(calendar);
    }

    @Override
    @Transactional(readOnly = true)
    public WorkCalendarResponse getByYear(Integer year) {

        WorkCalendar calendar = calendarRepository
                .findByYearAndIsActiveTrue(year)
                .orElseThrow(() -> new CustomException(Error.WORK_CALENDAR_NOT_FOUND));

        return calendarMapper.toResponse(calendar);
    }

    /**
     * =========================================================
     * CORE LOGIC – ATTENDANCE PHỤ THUỘC HÀM NÀY
     * =========================================================
     */
    @Override
    @Transactional(readOnly = true)
    public boolean isWorkingDay(LocalDate date) {

        WorkCalendar calendar = calendarRepository
                .findByYearAndIsActiveTrue(date.getYear())
                .orElseThrow(() -> new CustomException(Error.WORK_CALENDAR_NOT_FOUND));

        // 1️⃣ Check thứ có nằm trong workingDays không
        if (!calendar.getWorkingDays()
                .contains(date.getDayOfWeek())) {
            return false;
        }

        // 2️⃣ Check Holiday
        if (calendar.getHolidayPolicy() == HolidayPolicy.USE_HOLIDAY_MODULE) {

            if (holidayService.isHoliday(date)) {
                return false;
            }
        }

        return true;
    }
}
