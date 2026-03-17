package com.hrm.dacn.services.impl;

import com.hrm.dacn.dtos.payroll.PayrollRequestDTO;
import com.hrm.dacn.dtos.payroll.PayrollResponseDTO;
import com.hrm.dacn.entities.Contracts;
import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.entities.Payroll;
import com.hrm.dacn.enums.Employee.EmployeeStatus;
import com.hrm.dacn.mappers.PayrollMapper;
import com.hrm.dacn.repositories.ContractRepository;
import com.hrm.dacn.repositories.EmployeeRepository;
import com.hrm.dacn.repositories.PayrollRepository;
import com.hrm.dacn.services.IEmployeeSalaryComponentService;
import com.hrm.dacn.services.ITaxDeductionService;
import com.hrm.dacn.services.PayrollService;
import com.hrm.dacn.services.PayrollSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PayrollServiceImpl implements PayrollService {

    private final PayrollRepository repository;
    private final PayrollMapper mapper;
    private final IEmployeeSalaryComponentService empSalaryService; // Inject module 2
    private final ITaxDeductionService taxService;                 // Inject module 1
    private final ContractRepository contractRepository;
    private final EmployeeRepository employeeRepository;
    @Override
    @Transactional
    public PayrollResponseDTO calculateAutoPayroll(Long employeeId) {

        // 1. Ngày cuối tháng để check hợp đồng
        LocalDate targetDate = LocalDate.now();

        // 2. Lấy hợp đồng đang hiệu lực
        Contracts contract = contractRepository
                .findActiveContract(employeeId)
                .orElseThrow(() -> new RuntimeException(
                        "Nhân viên không có hợp đồng hợp lệ tại thời điểm này"));

        Employee employee = contract.getEmployee();

        // 3. Lương & phụ cấp từ hợp đồng
        BigDecimal basicSalary = contract.getBasicSalary();
        BigDecimal allowances = contract.getAllowances() != null
                ? contract.getAllowances()
                : BigDecimal.ZERO;

        // 4. Nếu đang thử việc → nhân % lương
        if (contract.isInProbation()) {
            BigDecimal percent = BigDecimal
                    .valueOf(contract.getProbationSalaryPercentage())
                    .divide(BigDecimal.valueOf(100));
            basicSalary = basicSalary.multiply(percent);
        }

        // 5. Tính bảo hiểm (nếu có tham gia)
        BigDecimal insuranceBase = contract.getInsuranceSalary() != null
                ? contract.getInsuranceSalary()
                : basicSalary;

        BigDecimal socialInsurance = BigDecimal.ZERO;
        BigDecimal healthInsurance = BigDecimal.ZERO;
        BigDecimal unemploymentInsurance = BigDecimal.ZERO;

        if (Boolean.TRUE.equals(contract.getSocialInsurance())) {
            socialInsurance = insuranceBase.multiply(BigDecimal.valueOf(0.08));
            healthInsurance = insuranceBase.multiply(BigDecimal.valueOf(0.015));
            unemploymentInsurance = insuranceBase.multiply(BigDecimal.valueOf(0.01));
        }

        BigDecimal totalInsurance = socialInsurance
                .add(healthInsurance)
                .add(unemploymentInsurance);

        // 6. Giảm trừ gia cảnh


        BigDecimal personalDeduction = BigDecimal.valueOf(11_000_000);

        // 7. Thu nhập chịu thuế
        BigDecimal taxableIncome = basicSalary
                .add(allowances)
                .subtract(totalInsurance)
                .subtract(personalDeduction);

        if (taxableIncome.compareTo(BigDecimal.ZERO) < 0) {
            taxableIncome = BigDecimal.ZERO;
        }

        // 8. Thuế TNCN (tạm tính 5%)
        BigDecimal personalIncomeTax = taxableIncome.multiply(BigDecimal.valueOf(0.05));

        // 9. Tổng khấu trừ
        BigDecimal totalDeductions = totalInsurance.add(personalIncomeTax);

        // 10. Net salary
        BigDecimal netSalary = basicSalary
                .add(allowances)
                .subtract(totalDeductions);

        // 11. Lưu Payroll
        Payroll payroll = Payroll.builder()
                .employee(employee)
                .month(targetDate.getMonthValue())
                .year(targetDate.getYear())
                .basicSalary(basicSalary.doubleValue())
                .allowances(allowances.doubleValue())
                .overtimePay(0.0)
                .bonus(0.0)
                .otherIncome(0.0)
                .socialInsurance(socialInsurance.doubleValue())
                .healthInsurance(healthInsurance.doubleValue())
                .unemploymentInsurance(unemploymentInsurance.doubleValue())
                .personalIncomeTax(personalIncomeTax.doubleValue())
                .totalDeductions(totalDeductions.doubleValue())
                .netSalary(netSalary.doubleValue())
                .status("CALCULATED")
                .build();

        return mapper.toDto(repository.save(payroll));
    }
    @Override
    @Transactional
    public List<PayrollResponseDTO> calculateAllPayroll() {

        List<Employee> employees =
                employeeRepository.findByStatusNot(EmployeeStatus.RESIGNED);

        List<PayrollResponseDTO> payrolls = new ArrayList<>();

        for (Employee employee : employees) {
            try {
                PayrollResponseDTO payroll =
                        calculateAutoPayroll(employee.getEmployeeId());
                payrolls.add(payroll);
            } catch (Exception e) {
                System.out.println("Skip employee: " + employee.getEmployeeId());
            }
        }

        return payrolls;
    }
    @Override
    public List<PayrollResponseDTO> search(
            Long employeeId,
            Integer month,
            Integer year,
            Long companyId,
            String department
    ) {
        return repository.findAll(
                        PayrollSpecification.filter(
                                employeeId,
                                month,
                                year,
                                companyId,
                                department
                        )
                ).stream()
                .map(mapper::toDto)
                .toList();
    }
    @Override
    @Transactional
    public PayrollResponseDTO create(PayrollRequestDTO dto) {

        return null;
    }

    @Override
    public List<PayrollResponseDTO> findAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    public PayrollResponseDTO findById(Long id) {
        Payroll payroll = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found with ID: " + id));
        return mapper.toDto(payroll);
    }

    @Override
    @Transactional
    public PayrollResponseDTO update(Long id, PayrollRequestDTO dto) {
        Payroll existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found"));

        // Cập nhật giá trị mới thông qua setter (vì JPA quản lý dirty checking)

        return mapper.toDto(repository.save(existing));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if(!repository.existsById(id)) throw new RuntimeException("Not found");
        repository.deleteById(id);
    }
}