package com.hrm.dacn.dtos.contracts.request;

import com.hrm.dacn.enums.contracts.ContractStatus;
import com.hrm.dacn.enums.contracts.ContractType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class ContractFilter {
    private String contractNumber;
    private String contractType;
    private String contractStatus;
    private Long employeeId;

    private LocalDate startDate;
    private LocalDate endDate;

}
