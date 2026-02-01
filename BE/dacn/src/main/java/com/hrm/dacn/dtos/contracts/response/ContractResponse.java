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

    // =========================
    // BASIC
    // =========================
    private Long contractId;
    private String contractNumber;

    // =========================
    // COMPANY / EMPLOYEE
    // =========================
    private Long companyId;
    private String companyName;

    private Long employeeId;
    private String employeeName;

    // =========================
    // CONTRACT INFO
    // =========================
    private ContractType contractType;
    private String contractTypeDisplay;

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate signedDate;

    private String jobTitle;
    private String department;
    private String jobDescription;

    // =========================
    // SALARY
    // =========================
    private BigDecimal basicSalary;
    private BigDecimal allowances;
    private BigDecimal totalCompensation;

    private String salaryPaymentMethod;
    private Integer salaryPaymentDate;

    // =========================
    // WORKING
    // =========================
    private BigDecimal workingHoursPerDay;
    private Integer workingDaysPerWeek;

    private Integer probationPeriod;
    private Integer probationSalaryPercentage;

    // =========================
    // INSURANCE
    // =========================
    private Boolean socialInsurance;
    private BigDecimal insuranceSalary;

    // =========================
    // STATUS
    // =========================
    private ContractStatus status;
    private String statusDisplay;
    private Boolean active;

    // =========================
    // AUDIT
    // =========================
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
