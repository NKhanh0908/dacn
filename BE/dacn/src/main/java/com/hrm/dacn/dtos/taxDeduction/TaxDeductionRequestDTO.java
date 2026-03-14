package com.hrm.dacn.dtos.taxDeduction;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class TaxDeductionRequestDTO {
    private Long employId;
    private String dependentName;
    private String relationship;
    private String idCard;
    private Double amount;
    private LocalDate fromDate;
    private LocalDate toDate;
}