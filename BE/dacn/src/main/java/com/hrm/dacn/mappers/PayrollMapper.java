package com.hrm.dacn.mappers;

import com.hrm.dacn.dtos.payroll.PayrollResponseDTO;
import com.hrm.dacn.entities.Payroll;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
@Component
public class PayrollMapper {

    public PayrollResponseDTO toDto(Payroll entity) {

        double totalIncome =
                entity.getBasicSalary()
                        + entity.getOvertimePay()
                        + entity.getAllowances()
                        + entity.getBonus()
                        + entity.getOtherIncome();

        return PayrollResponseDTO.builder()
                .payrollId(entity.getPayrollId())
                .employeeId(entity.getEmployee().getEmployeeId())

                .month(entity.getMonth())
                .year(entity.getYear())
                .period(entity.getMonth() + "/" + entity.getYear())

                // Earnings
                .basicSalary(entity.getBasicSalary())
                .overtimePay(entity.getOvertimePay())
                .allowances(entity.getAllowances())
                .bonus(entity.getBonus())
                .otherIncome(entity.getOtherIncome())
                .totalIncome(totalIncome)

                // Deductions
                .socialInsurance(entity.getSocialInsurance())
                .healthInsurance(entity.getHealthInsurance())
                .unemploymentInsurance(entity.getUnemploymentInsurance())
                .personalIncomeTax(entity.getPersonalIncomeTax())
                .totalDeductions(entity.getTotalDeductions())

                // Final
                .netSalary(entity.getNetSalary())

                .status(entity.getStatus())

                .createdAt(entity.getCreatedAt()
                        .format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")))

                .build();
    }
}