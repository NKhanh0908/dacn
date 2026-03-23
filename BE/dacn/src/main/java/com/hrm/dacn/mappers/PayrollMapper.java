package com.hrm.dacn.mappers;

import com.hrm.dacn.dtos.payroll.PayrollResponseDTO;
import com.hrm.dacn.entities.Payroll;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
@Component
public class PayrollMapper {
    public PayrollResponseDTO toDto(Payroll entity) {
        if (entity == null) return null;

        // Hàm bổ trợ để tránh unboxing null
        double basic = safeDouble(entity.getBasicSalary());
        double ot = safeDouble(entity.getOvertimePay());
        double allowance = safeDouble(entity.getAllowances());
        double bonus = safeDouble(entity.getBonus());
        double other = safeDouble(entity.getOtherIncome());

        double totalIncome = basic + ot + allowance + bonus + other;

        return PayrollResponseDTO.builder()
                .payrollId(entity.getPayrollId())
                .employeeId(entity.getEmployee() != null ? entity.getEmployee().getEmployeeId() : null)

                .month(entity.getMonth())
                .year(entity.getYear())
                .period(entity.getMonth() + "/" + entity.getYear())

                // Earnings - Trả về giá trị gốc hoặc 0.0 tùy bạn muốn
                .basicSalary(basic)
                .overtimePay(ot)
                .allowances(allowance)
                .bonus(bonus)
                .otherIncome(other)
                .totalIncome(totalIncome)

                // Deductions - Cũng nên xử lý safeDouble cho an toàn
                .socialInsurance(safeDouble(entity.getSocialInsurance()))
                .healthInsurance(safeDouble(entity.getHealthInsurance()))
                .unemploymentInsurance(safeDouble(entity.getUnemploymentInsurance()))
                .personalIncomeTax(safeDouble(entity.getPersonalIncomeTax()))
                .totalDeductions(safeDouble(entity.getTotalDeductions()))

                // Final
                .netSalary(safeDouble(entity.getNetSalary()))
                .status(entity.getStatus())

                .createdAt(entity.getCreatedAt() != null
                        ? entity.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                        : null)

                .build();
    }

    // Phương thức Helper để xử lý Null
    private double safeDouble(Double value) {
        return value != null ? value : 0.0;
    }
}