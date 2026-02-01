package com.hrm.dacn.dtos.contracts.request;

import com.hrm.dacn.enums.contracts.ContractType;
import jakarta.persistence.Column;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractCreateRequest {

    private String contractNumber;
    private ContractType contractType;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate signedDate;

    private Long companyId;
    private String employerRepresentative;
    private String employerPosition;

    private Long employeeId;

    private String jobTitle;
    private String department;
    private String jobDescription;

    private BigDecimal workingHoursPerDay;
    private Integer workingDaysPerWeek;
    private String workSchedule;
    private String overtimePolicy;
    private Integer annualLeaveDays;

    private BigDecimal basicSalary;
    private String salaryPaymentMethod;
    private Integer salaryPaymentDate;
    private BigDecimal allowances;
    private String allowanceDetails;

    private String confidentialityClause;
    private String technologyConfidentiality;
    private String nonCompeteClause;
    private Integer confidentialityPeriodMonths;

    private Integer probationPeriod;
    private Integer probationEndDate;

    private Boolean socialInsurance;
    private BigDecimal insuranceSalary;

    private Integer noticePeriodDays;
    private String notes;
}
