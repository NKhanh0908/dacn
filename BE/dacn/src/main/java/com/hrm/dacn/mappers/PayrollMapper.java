package com.hrm.dacn.mappers;

import com.hrm.dacn.dtos.payroll.PayrollRequestDTO;
import com.hrm.dacn.dtos.payroll.PayrollResponseDTO;
import com.hrm.dacn.entities.Payroll;
import org.springframework.stereotype.Component;

@Component
public class PayrollMapper {



    public PayrollResponseDTO toDto(Payroll entity) {
        // Tính tổng thu nhập nhanh để hiển thị
        double totalIncome = entity.getBasicSalary() + entity.getBonus() + entity.getAllowances();

        return PayrollResponseDTO.builder()
                .payrollId(entity.getPayrollId())
                .employId(entity.getEmployee().getEmployeeId())
                .period(entity.getMonth() + "/" + entity.getYear())
                .totalIncome(totalIncome)
                .totalDeductions(entity.getTotalDeductions())
                .netSalary(entity.getNetSalary())
                .status(entity.getStatus())
                .build();
    }
}