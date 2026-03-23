package com.hrm.dacn.services.impl;

import com.hrm.dacn.dtos.Attendance.response.AttendanceResponse;
import com.hrm.dacn.dtos.Attendance.response.AttendanceStatistics;
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
import com.hrm.dacn.services.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
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
    private final AttendanceService attendanceService;
    @Override
    @Transactional
    public PayrollResponseDTO calculateAutoPayroll(Long employeeId) {

        LocalDate now = LocalDate.now();

        // 1. Contract
        Contracts contract = contractRepository
                .findActiveContract(employeeId)
                .orElseThrow(() -> new RuntimeException("Không có contract"));

        Employee employee = contract.getEmployee();

        // 2. Attendance tháng
        List<AttendanceResponse> attendances =
                attendanceService.getMonthlyAttendance(employeeId, now.getYear(), now.getMonthValue());

        AttendanceStatistics stats = attendanceService.getStatistics(
                employeeId,
                now.withDayOfMonth(1),
                now.withDayOfMonth(now.lengthOfMonth())
        );

        // =========================
        // 3. BASIC + ALLOWANCE
        // =========================
        BigDecimal basicSalary = contract.getBasicSalary();
        BigDecimal allowances = contract.getAllowances() != null
                ? contract.getAllowances()
                : BigDecimal.ZERO;

        // thử việc
        if (contract.isInProbation()) {
            BigDecimal percent = BigDecimal
                    .valueOf(contract.getProbationSalaryPercentage())
                    .divide(BigDecimal.valueOf(100));
            basicSalary = basicSalary.multiply(percent);
        }

        // =========================
        // 4. OT (từ Attendance)
        // =========================
        BigDecimal overtimePay = BigDecimal.ZERO;

        if (stats.getTotalOvertimeHours() > 0) {

            BigDecimal hourlySalary = basicSalary
                    .divide(BigDecimal.valueOf(contract.getWorkingDaysPerMonth()), 2, RoundingMode.HALF_UP)
                    .divide(contract.getWorkingHoursPerDay(), 2, RoundingMode.HALF_UP);

            overtimePay = hourlySalary
                    .multiply(BigDecimal.valueOf(stats.getTotalOvertimeHours()))
                    .multiply(BigDecimal.valueOf(1.5)); // OT thường
        }

        // =========================
        // 5. TRỪ NGHỈ & ABSENT
        // =========================

        int leaveDays = stats.getAbsentDays(); // ⚠️ cái này bạn đang dùng sai tên



        BigDecimal unpaidLeaveDeduction =
                contract.getUnpaidLeaveDeductionAmount(leaveDays);


        int lateTimes = stats.getLateDays();

        BigDecimal lateDeduction =
                contract.getLateDeductionAmount(lateTimes);

        // =========================
        // 7. BẢO HIỂM
        // =========================
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

        // =========================
        // 8. TAX
        // =========================
        BigDecimal personalDeduction = BigDecimal.valueOf(11_000_000);

        BigDecimal taxableIncome = basicSalary
                .add(allowances)
                .add(overtimePay)
                .subtract(totalInsurance)
                .subtract(personalDeduction);

        if (taxableIncome.compareTo(BigDecimal.ZERO) < 0) {
            taxableIncome = BigDecimal.ZERO;
        }

        BigDecimal personalIncomeTax = taxableIncome.multiply(BigDecimal.valueOf(0.05));

        // =========================
        // 9. TOTAL DEDUCTION
        // =========================
        BigDecimal totalDeductions = totalInsurance
                .add(personalIncomeTax)
                .add(unpaidLeaveDeduction)
                .add(lateDeduction);

        // =========================
        // 10. NET
        // =========================
        BigDecimal netSalary = basicSalary
                .add(allowances)
                .add(overtimePay)
                .subtract(totalDeductions);

        // =========================
        // SAVE
        // =========================
        Payroll payroll = Payroll.builder()
                .employee(employee)
                .month(now.getMonthValue())
                .year(now.getYear())
                .basicSalary(basicSalary.doubleValue())
                .allowances(allowances.doubleValue())
                .overtimePay(overtimePay.doubleValue())
                .socialInsurance(socialInsurance.doubleValue())
                .healthInsurance(healthInsurance.doubleValue())
                .unemploymentInsurance(unemploymentInsurance.doubleValue())
                .personalIncomeTax(personalIncomeTax.doubleValue())
                .totalDeductions(totalDeductions.doubleValue())
                .netSalary(netSalary.doubleValue())
                .status("CALCULATED")
                .bonus(0.0)
                .otherIncome(0.0)
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
                e.printStackTrace();
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