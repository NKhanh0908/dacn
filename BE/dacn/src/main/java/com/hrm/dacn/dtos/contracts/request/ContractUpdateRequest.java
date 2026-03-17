package com.hrm.dacn.dtos.contracts.request;

import com.hrm.dacn.enums.contracts.ContractStatus;
import com.hrm.dacn.enums.contracts.ContractType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractUpdateRequest {

    private ContractType contractType;
    private ContractStatus status;

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate signedDate;

    private String jobTitle;
    private String jobDescription;
    private String department;

    private BigDecimal basicSalary;
    private BigDecimal allowances;
    private String allowanceDetails;

    private BigDecimal workingHoursPerDay;
    private Integer workingDaysPerMonth;
    private String overtimePolicy;
    private Integer annualLeaveDays;

    private Integer probationPeriod;
    private Integer probationSalaryPercentage;

    private String salaryPaymentMethod;
    private Integer salaryPaymentDate;

    private BigDecimal paidLeaveDeductionRate;
    private BigDecimal unpaidLeaveDeductionRate;
    private BigDecimal lateDeductionRate;

    private Boolean socialInsurance;
    private BigDecimal insuranceSalary;

    private String employerRepresentative;
    private String employerPosition;

    private LocalDate terminationDate;
    private String terminationReason;
    private Integer noticePeriodDays;

    private String fileUrl;
    private String draftFileUrl;

    private String notes;
}