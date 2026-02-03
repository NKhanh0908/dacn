package com.hrm.dacn.repositories;

import com.hrm.dacn.entities.AttendanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.enums.Attendance.RequestStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRequestRepository
        extends JpaRepository<AttendanceRequest, Long>, JpaSpecificationExecutor<AttendanceRequest> {

    // Lấy danh sách yêu cầu của nhân viên

    List<AttendanceRequest> findByEmployeeOrderByCreatedAtDesc(Employee employee);

    // Lấy danh sách yêu cầu chờ duyệt

    List<AttendanceRequest> findByStatusOrderByCreatedAtAsc(RequestStatus status);

    // Kiểm tra đã có yêu cầu cho ngày này chưa

    Optional<AttendanceRequest> findByEmployeeAndRequestDateAndStatus(
            Employee employee,
            LocalDate requestDate,
            RequestStatus status);

    // Lấy danh sách yêu cầu theo trạng thái và khoảng thời gian

    List<AttendanceRequest> findByStatusAndRequestDateBetweenOrderByCreatedAtDesc(
            RequestStatus status,
            LocalDate startDate,
            LocalDate endDate);
}