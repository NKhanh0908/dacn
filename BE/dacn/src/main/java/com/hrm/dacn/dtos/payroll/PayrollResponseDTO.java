package com.hrm.dacn.dtos.payroll;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollResponseDTO {

    private Long payrollId;

    // Employee
    private Long employeeId;

    // Period
    private Integer month;
    private Integer year;
    private String period; // hiển thị dạng MM/YYYY

    // ===== Earnings =====
    private Double basicSalary;
    private Double overtimePay;
    private Double allowances;
    private Double bonus;
    private Double otherIncome;
    private Double totalIncome;

    // ===== Deductions =====
    private Double socialInsurance;
    private Double healthInsurance;
    private Double unemploymentInsurance;
    private Double personalIncomeTax;
    private Double totalDeductions;

    // ===== Deductions =====
    private Double lateDeduction;
    private Double unpaidLeaveDeduction;
    private Double dailySalaryLeave;


    // ===== Final Salary =====
    private Double netSalary;

    // Status
    private String status;

    // Created time
    private String createdAt;
}