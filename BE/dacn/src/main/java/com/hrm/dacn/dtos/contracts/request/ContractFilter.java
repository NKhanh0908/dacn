package com.hrm.dacn.dtos.contracts.request;

import com.hrm.dacn.enums.contracts.ContractStatus;
import com.hrm.dacn.enums.contracts.ContractType;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class ContractFilter {
    private String contractNumber;
    private ContractType contractType;
    private ContractStatus contractStatus;
    private Long employeeId;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

}
