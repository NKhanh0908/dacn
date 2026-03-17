package com.hrm.dacn.services;

import org.springframework.data.domain.Page;

import com.hrm.dacn.dtos.Holiday.Request.HolidayRequest;
import com.hrm.dacn.dtos.Holiday.Response.HolidayResponse;

import java.time.LocalDate;
import java.util.List;

public interface HolidayService {
        HolidayResponse createHoliday(HolidayRequest requestDTO,
                        Long createdByEmployeeId);

        HolidayResponse updateHoliday(Long id, HolidayRequest requestDTO);

        HolidayResponse getHolidayById(Long id);

        // Page<HolidayResponse> searchHolidays(HolidaySearch searchDTO);
        void deleteHoliday(Long id);

        List<HolidayResponse> getHolidaysByDateRange(LocalDate from,
                        LocalDate to);

        boolean isHoliday(LocalDate date);

        Double getSalaryMultiplier(LocalDate date);
}