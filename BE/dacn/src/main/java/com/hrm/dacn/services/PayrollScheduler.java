package com.hrm.dacn.services;

import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.repositories.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PayrollScheduler {

    private final PayrollService payrollService;
    private final EmployeeRepository employeeRepository; // Để lấy danh sách nhân viên

    // Chạy vào 00:00 ngày 1 hàng tháng
    @Scheduled(cron = "0 0 0 1 * ?")
    public void runMonthlyPayroll() {
        int lastMonth = LocalDate.now().minusMonths(1).getMonthValue();
        int year = LocalDate.now().getYear();

        List<Employee> allEmployees = employeeRepository.findAll();

        for (Employee emp : allEmployees) {
            try {
                payrollService.calculateAutoPayroll(emp.getEmployeeId());
            } catch (Exception e) {
                // Log lỗi nếu nhân viên đó bị thiếu dữ liệu
                System.err.println("Lỗi tính lương cho NV: " + emp.getEmployeeId());
            }
        }
    }
}