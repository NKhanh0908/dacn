package com.hrm.dacn.dtos.payroll;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollResponseDTO {
    private Long payrollId;
    private Long employId;
    private String period; // Ghép Month/Year
    private Double totalIncome;
    private Double totalDeductions;
    private Double netSalary;
    private String status;
}