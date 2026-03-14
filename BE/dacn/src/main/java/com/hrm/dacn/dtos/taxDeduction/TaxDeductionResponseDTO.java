package com.hrm.dacn.dtos.taxDeduction;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TaxDeductionResponseDTO {
    private Long deductionId;
    private String dependentName;
    private String relationship;
    private Double amount;
    private String status; // Tính toán dựa trên toDate (Còn hạn/Hết hạn)
}