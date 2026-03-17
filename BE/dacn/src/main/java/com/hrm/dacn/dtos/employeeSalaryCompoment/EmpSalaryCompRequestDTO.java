package com.hrm.dacn.dtos.employeeSalaryCompoment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmpSalaryCompRequestDTO {
    private Long employId;
    private Long componentId;
    private Double amount;
    private LocalDate effectiveFrom;
    private LocalDate effectiveTo;
}