package com.hrm.dacn.dtos.contracts.request;

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
public class ContractCreateRequest {

    @NotBlank(message = "Contract number must not be blank")
    @Size(max = 50, message = "Contract number must not exceed 50 characters")
    private String contractNumber;

    @NotNull(message = "Employee ID must not be null")
    private Long employeeId;

    @NotNull(message = "Contract type must not be null")
    private ContractType contractType;

    @NotNull(message = "Start date must not be null")
    @PastOrPresent(message = "Start date must not be in the future")
    private LocalDate startDate;

    private LocalDate endDate; // Required only for fixed-term contracts

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
    private Integer probationPeriod; // months

    @Size(max = 500, message = "Job description must not exceed 500 characters")
    private String jobDescription;

    private LocalDate signedDate;
}
