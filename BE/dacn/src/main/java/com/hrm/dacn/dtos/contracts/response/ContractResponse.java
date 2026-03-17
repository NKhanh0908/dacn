package com.hrm.dacn.dtos.contracts.response;

import com.hrm.dacn.enums.contracts.ContractStatus;
import com.hrm.dacn.enums.contracts.ContractType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ContractResponse {

    // ===== BASIC =====
    private Long contractId;
    private String contractNumber;

    // ===== COMPANY / EMPLOYEE =====
    private Long companyId;
    private String companyName;

    private Long employeeId;
    private String employeeName;

    // ===== CONTRACT INFO =====
    private ContractType contractType;
    private String contractTypeDisplay;

    private ContractStatus status;
    private String statusDisplay;

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate signedDate;

    // ===== JOB =====
    private String jobTitle;
    private String jobDescription;
    private String department;

    // ===== WORKING =====
    private BigDecimal workingHoursPerDay;
    private Integer workingDaysPerMonth;
    private String overtimePolicy;
    private Integer annualLeaveDays;

    // ===== SALARY =====
    private BigDecimal basicSalary;
    private BigDecimal allowances;
    private BigDecimal totalCompensation;
    private String allowanceDetails;

    private String salaryPaymentMethod;
    private Integer salaryPaymentDate;

    private BigDecimal paidLeaveDeductionRate;
    private BigDecimal unpaidLeaveDeductionRate;
    private BigDecimal lateDeductionRate;

    // ===== INSURANCE =====
    private Boolean socialInsurance;
    private BigDecimal insuranceSalary;

    // ===== PROBATION =====
    private Integer probationPeriod;
    private Integer probationSalaryPercentage;
    private LocalDate probationEndDate;

    // ===== TERMINATION =====
    private LocalDate terminationDate;
    private String terminationReason;
    private Integer noticePeriodDays;

    // ===== FILE =====
    private String fileUrl;
    private String draftFileUrl;

    // ===== BUSINESS FLAGS =====
    private Boolean active;
    private Boolean expired;
    private Boolean inProbation;

    // ===== AUDIT =====
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long createdBy;
    private Long updatedBy;
}