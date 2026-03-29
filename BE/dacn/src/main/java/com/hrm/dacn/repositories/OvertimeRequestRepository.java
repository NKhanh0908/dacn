package com.hrm.dacn.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.entities.OvertimeRequest;
import com.hrm.dacn.enums.Attendance.OvertimeStatus;

public interface OvertimeRequestRepository
                extends JpaRepository<OvertimeRequest, Long> {

        Optional<OvertimeRequest> findByEmployeeAndOvertimeDateAndStatus(
                        Employee employee,
                        LocalDate date,
                        OvertimeStatus status);

        boolean existsByEmployeeAndOvertimeDateAndStatusNot(
                        Employee employee, LocalDate overtimeDate, OvertimeStatus status);

        List<OvertimeRequest> findByEmployee(Employee employee);

}