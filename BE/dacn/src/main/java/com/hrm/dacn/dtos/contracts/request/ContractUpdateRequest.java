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

    @NotNull(message = "Contract ID must not be null")
    private Long contractId;

    @NotNull(message = "Contract type must not be null")
    private ContractType contractType;

    @NotNull(message = "Start date must not be null")
    private LocalDate startDate;

    private LocalDate endDate;

    @NotNull(message = "Basic salary must not be null")
    @Positive(message = "Basic salary must be greater than 0")
    private BigDecimal basicSalary;

    @PositiveOrZero(message = "Allowances must be zero or positive")
    private BigDecimal allowances;

    @Positive(message = "Working hours per day must be greater than 0")
    private BigDecimal workingHoursPerDay;

    @Min(value = 1, message = "Working days per week must be at least 1")
    @Max(value = 7, message = "Working days per week must not exceed 7")
    private Integer workingDaysPerWeek;

    @Min(value = 0, message = "Probation period must not be negative")
    private Integer probationPeriod;

    @Size(max = 500, message = "Job description must not exceed 500 characters")
    private String jobDescription;

    private LocalDate signedDate;

    private ContractStatus status;
}
