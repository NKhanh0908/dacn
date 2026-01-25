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

    private Long contractId;
    private String contractNumber;

    private Long employeeId;
    private String employeeName;

    private ContractType contractType;
    private String contractTypeDisplay;

    private LocalDate startDate;
    private LocalDate endDate;

    private BigDecimal basicSalary;
    private BigDecimal allowances;
    private BigDecimal totalCompensation;

    private BigDecimal workingHoursPerDay;
    private Integer workingDaysPerWeek;

    private Integer probationPeriod;
    private String jobDescription;

    private LocalDate signedDate;

    private ContractStatus status;
    private String statusDisplay;

    private Boolean active;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
