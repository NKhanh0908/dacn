package com.hrm.dacn.dtos.contracts.request;

import com.hrm.dacn.enums.contracts.ContractStatus;
import com.hrm.dacn.enums.contracts.ContractType;
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
    private String department;
    private String jobDescription;

    private BigDecimal basicSalary;
    private BigDecimal allowances;
    private String allowanceDetails;

    private BigDecimal workingHoursPerDay;
    private Integer workingDaysPerWeek;

    private Integer probationPeriod;
    private Integer probationSalaryPercentage;

    private String salaryPaymentMethod;
    private Integer salaryPaymentDate;

    private Boolean socialInsurance;
    private BigDecimal insuranceSalary;

    private String employerRepresentative;
    private String employerPosition;

    private String confidentialityClause;
    private String technologyConfidentiality;
    private String nonCompeteClause;
    private Integer confidentialityPeriodMonths;

    private Integer noticePeriodDays;
    private String notes;
}

