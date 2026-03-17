package com.hrm.dacn.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hrm.dacn.dtos.PageDTO;
import com.hrm.dacn.dtos.Holiday.Request.LeaveRequestFilter;
import com.hrm.dacn.dtos.Holiday.Response.LeaveRequestResponse;
import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.entities.LeaveRequest;
import com.hrm.dacn.enums.Holiday.LeaveStatus;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long>,
                JpaSpecificationExecutor<LeaveRequest> {

        List<LeaveRequest> findByEmployeeOrderByCreatedAtDesc(Employee employee);

        Page<LeaveRequest> findByStatus(LeaveStatus status, Pageable pageable);

        @Query("""
                        SELECT COUNT(lr) > 0 FROM LeaveRequest lr
                        WHERE lr.employee.id = :employeeId
                          AND lr.status IN :statuses
                          AND lr.startDate <= :endDate
                          AND lr.endDate   >= :startDate
                        """)
        boolean existsOverlappingRequest(
                        @Param("employeeId") Long employeeId,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate,
                        @Param("statuses") List<LeaveStatus> statuses);

}