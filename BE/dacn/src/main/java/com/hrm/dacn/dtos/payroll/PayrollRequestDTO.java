package com.hrm.dacn.dtos.payroll;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollRequestDTO {
    private Long employId;

    // ... các trường input khác cần thiết để tính toán
}