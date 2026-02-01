package com.hrm.dacn.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.entities.MonthlySummary;

import java.util.List;
import java.util.Optional;

@Repository
public interface MonthlySummaryRepository extends JpaRepository<MonthlySummary, Long> {

    // Tìm bảng tổng kết tháng của nhân viên

    Optional<MonthlySummary> findByEmployeeAndYearAndMonth(
            Employee employee,
            Integer year,
            Integer month);

    // Lấy danh sách tổng kết theo tháng/năm

    List<MonthlySummary> findByYearAndMonth(Integer year, Integer month);

    // Lấy danh sách tổng kết chưa chốt

    List<MonthlySummary> findByIsFinalizedFalse();

    // Lấy lịch sử tổng kết của nhân viên

    @Query("SELECT m FROM MonthlySummary m WHERE m.employee.id = :employeeId " +
            "ORDER BY m.year DESC, m.month DESC")
    List<MonthlySummary> findEmployeeHistory(@Param("employeeId") Long employeeId);
}