package com.hrm.dacn.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hrm.dacn.entities.Attendance;
import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.enums.Attendance.AttendanceStatus;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long>, JpaSpecificationExecutor<Attendance> {

        // Tìm bản ghi chấm công của nhân viên trong ngày
        Optional<Attendance> findByEmployeeAndAttendanceDate(Employee employee, LocalDate date);

        // Kiểm tra nhân viên đã check-in hôm nay chưa
        boolean existsByEmployeeAndAttendanceDateAndCheckInTimeIsNotNull(Employee employee, LocalDate date);

        // Lấy danh sách chấm công của nhân viên trong khoảng thời gian
        List<Attendance> findByEmployeeAndAttendanceDateBetween(
                        Employee employee,
                        LocalDate startDate,
                        LocalDate endDate);

        // Lấy danh sách chấm công theo tháng và năm

        @Query("SELECT a FROM Attendance a WHERE a.employee.id = :employeeId " +
                        "AND YEAR(a.attendanceDate) = :year AND MONTH(a.attendanceDate) = :month " +
                        "ORDER BY a.attendanceDate")
        List<Attendance> findByEmployeeIdAndYearAndMonth(
                        @Param("employeeId") Long employeeId,
                        @Param("year") int year,
                        @Param("month") int month);

        // Lấy danh sách chấm công chưa được duyệt

        List<Attendance> findByIsApprovedFalseAndAttendanceDateBetween(
                        LocalDate startDate,
                        LocalDate endDate);

        // Lấy danh sách nhân viên đi trễ trong ngày
        List<Attendance> findByAttendanceDateAndStatus(
                        LocalDate date,
                        AttendanceStatus status);

        // Đếm số ngày làm việc của nhân viên trong tháng

        @Query("SELECT COUNT(a) FROM Attendance a WHERE a.employee.id = :employeeId " +
                        "AND YEAR(a.attendanceDate) = :year AND MONTH(a.attendanceDate) = :month " +
                        "AND a.status IN ('PRESENT', 'ON_TIME', 'LATE', 'EARLY_LEAVE', 'OVERTIME')")
        long countWorkingDays(
                        @Param("employeeId") Long employeeId,
                        @Param("year") int year,
                        @Param("month") int month);

        // Tổng số phút đi trễ trong tháng

        @Query("SELECT COALESCE(SUM(a.lateMinutes), 0) FROM Attendance a " +
                        "WHERE a.employee.id = :employeeId " +
                        "AND YEAR(a.attendanceDate) = :year AND MONTH(a.attendanceDate) = :month")
        int sumLateMinutes(
                        @Param("employeeId") Long employeeId,
                        @Param("year") int year,
                        @Param("month") int month);

        // Tổng giờ OT trong tháng

        @Query("SELECT COALESCE(SUM(a.overtimeMinutes), 0) FROM Attendance a " +
                        "WHERE a.employee.id = :employeeId " +
                        "AND YEAR(a.attendanceDate) = :year AND MONTH(a.attendanceDate) = :month")
        int sumOvertimeMinutes(
                        @Param("employeeId") Long employeeId,
                        @Param("year") int year,
                        @Param("month") int month);

        // Lấy danh sách chấm công theo ngày (cho HR xem tất cả nhân viên)

        @Query("SELECT a FROM Attendance a WHERE a.attendanceDate = :date ORDER BY a.employee.id")
        List<Attendance> findAllByDate(@Param("date") LocalDate date);

        boolean existsByEmployeeAndAttendanceDate(Employee employee, LocalDate date);
}
