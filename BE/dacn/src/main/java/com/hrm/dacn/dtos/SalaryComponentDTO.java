package com.hrm.dacn.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryComponentDTO {
    private Long componentId;
    private String name;
    private String type;
    private Boolean isTaxable;
    private Boolean isInsuranceBase;
    private String description;
    private String status;
}