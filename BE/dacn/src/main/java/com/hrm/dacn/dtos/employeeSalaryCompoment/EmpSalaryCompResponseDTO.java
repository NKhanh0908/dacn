package com.hrm.dacn.dtos.employeeSalaryCompoment;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmpSalaryCompResponseDTO {
    private Long id;
    private Long employId;
    private Long componentId;
    private String componentName; // Sẽ lấy từ bảng SalaryComponent
    private Double amount;
    private String duration; // Ghép: "From [date] to [date]"
    private String status;
}