package com.hrm.dacn.dtos.contracts.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO để chấm dứt hợp đồng
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractTerminateRequest {

    private LocalDate terminationDate; // Null = hôm nay

    @NotBlank(message = "Lý do chấm dứt không được để trống")
    private String terminationReason;

    private String terminatedBy; // "EMPLOYEE" hoặc "EMPLOYER"
    private String notes;
}