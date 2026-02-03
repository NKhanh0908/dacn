package com.hrm.dacn.mappers;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import com.hrm.dacn.dtos.Holiday.Request.HolidayRequest;
import com.hrm.dacn.dtos.Holiday.Response.HolidayResponse;
import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.entities.Holiday;
import com.hrm.dacn.enums.Holiday.HolidayType;

import lombok.Builder;

@Component
@Builder
public class HolidayMapper {

    public Holiday toEntity(HolidayRequest request, Employee createdBy) {

        HolidayType type = request.getType();

        Boolean isPaid = request.getIsPaid() != null
                ? request.getIsPaid()
                : type.getDefaultPaid();

        Double salaryMultiplier = request.getSalaryMultiplier() != null
                ? request.getSalaryMultiplier()
                : type.getDefaultSalaryMultiplier();

        LocalDate endDate = request.getEndDate() != null
                ? request.getEndDate()
                : request.getStartDate();

        return Holiday.builder()
                .name(request.getName())
                .startDate(request.getStartDate())
                .endDate(endDate)
                .type(type)
                .isPaid(isPaid)
                .salaryMultiplier(salaryMultiplier)
                .description(request.getDescription())
                .createdBy(null)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public HolidayResponse toResponseDTO(Holiday holiday) {
        if (holiday == null) {
            return null;
        }

        return HolidayResponse.builder()
                .id(holiday.getId())
                .name(holiday.getName())
                .startDate(holiday.getStartDate())
                .endDate(holiday.getEndDate())
                .type(holiday.getType())
                .isPaid(holiday.getIsPaid())
                .salaryMultiplier(holiday.getSalaryMultiplier())
                .description(holiday.getDescription())
                .build();
    }
}
