package com.hrm.dacn.dtos.contracts.request;

import com.hrm.dacn.enums.contracts.ContractType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractCreateRequest {

    // =========================
    // BASIC
    // =========================

    @Schema(example = "HD-2025-001")
    private String contractNumber;

    @Schema(example = "FIXED_TERM")
    private ContractType contractType;

    @Schema(example = "2025-01-01")
    private LocalDate startDate;

    @Schema(example = "2026-01-01")
    private LocalDate endDate;

    @Schema(example = "2024-12-20")
    private LocalDate signedDate;

    // =========================
    // RELATION
    // =========================

    @Schema(example = "1001")
    private Long employeeId;

    // =========================
    // EMPLOYER
    // =========================

    @Schema(example = "Nguyen Van A")
    private String employerRepresentative;

    @Schema(example = "CEO")
    private String employerPosition;

    // =========================
    // JOB
    // =========================

    @Schema(example = "Senior Backend Developer")
    private String jobTitle;

    @Schema(example = "Develop and maintain core HRM backend services")
    private String jobDescription;

    @Schema(example = "IT Department")
    private String department;

    // =========================
    // WORKING
    // =========================

    @Schema(example = "8")
    private BigDecimal workingHoursPerDay;

    @Schema(example = "26")
    private Integer workingDaysPerMonth;

    @Schema(example = "Overtime paid 150% on weekdays, 200% on weekends")
    private String overtimePolicy;

    @Schema(example = "12")
    private Integer annualLeaveDays;

    // =========================
    // SALARY
    // =========================

    @Schema(example = "15000000")
    private BigDecimal basicSalary;

    @Schema(example = "BANK_TRANSFER")
    private String salaryPaymentMethod;

    @Schema(example = "25")
    private Integer salaryPaymentDate;

    @Schema(example = "2000000")
    private BigDecimal allowances;

    @Schema(example = "Lunch allowance and transportation allowance")
    private String allowanceDetails;

    @Schema(example = "50.00")
    private BigDecimal paidLeaveDeductionRate;

    @Schema(example = "100.00")
    private BigDecimal unpaidLeaveDeductionRate;

    @Schema(example = "0.50")
    private BigDecimal lateDeductionRate;


    // =========================
    // INSURANCE
    // =========================

    @Schema(example = "true")
    private Boolean socialInsurance;

    @Schema(example = "15000000")
    private BigDecimal insuranceSalary;

    // =========================
    // PROBATION
    // =========================

    @Schema(example = "2")
    private Integer probationPeriod;

    @Schema(example = "85")
    private Integer probationSalaryPercentage;

    // =========================
    // TERMINATION
    // =========================

    @Schema(example = "null")
    private LocalDate terminationDate;

    @Schema(example = "Mutual agreement")
    private String terminationReason;

    @Schema(example = "30")
    private Integer noticePeriodDays;

    // =========================
    // FILE
    // =========================

    @Schema(example = "https://example.com/contracts/contract-001.pdf")
    private String fileUrl;

    @Schema(example = "https://example.com/contracts/draft-001.pdf")
    private String draftFileUrl;

    // =========================
    // NOTE
    // =========================

    @Schema(example = "This contract replaces previous temporary agreement")
    private String notes;
}