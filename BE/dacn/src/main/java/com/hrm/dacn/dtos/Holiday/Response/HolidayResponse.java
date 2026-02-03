package com.hrm.dacn.dtos.Holiday.Response;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.hrm.dacn.enums.Holiday.HolidayType;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HolidayResponse {
    private Long id;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private HolidayType type;
    private String typeDescription;
    private Boolean isPaid;
    private Double salaryMultiplier;
    private String description;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
