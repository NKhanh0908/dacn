package com.hrm.dacn.services.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hrm.dacn.dtos.PageDTO;
import com.hrm.dacn.dtos.Holiday.Request.LeaveRequestCreateRequest;
import com.hrm.dacn.dtos.Holiday.Request.LeaveRequestFilter;
import com.hrm.dacn.dtos.Holiday.Request.LeaveRequestReviewRequest;
import com.hrm.dacn.dtos.Holiday.Response.LeaveRequestResponse;
import com.hrm.dacn.entities.Account;
import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.entities.LeaveRequest;
import com.hrm.dacn.enums.Holiday.LeaveDuration;
import com.hrm.dacn.enums.Holiday.LeaveStatus;
import com.hrm.dacn.exceptions.CustomException;
import com.hrm.dacn.exceptions.Error;
import com.hrm.dacn.mappers.LeaveRequestMapper;
import com.hrm.dacn.repositories.LeaveRequestRepository;
import com.hrm.dacn.services.AccountService;
import com.hrm.dacn.services.AttendanceService;
import com.hrm.dacn.services.LeaveRequestService;
import com.hrm.dacn.specifications.LeaveRequestSpecification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class LeaveRequestServiceImpl implements LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final AccountService accountService;
    private final AttendanceService attendanceService;

    @Override
    public LeaveRequestResponse createRequest(LeaveRequestCreateRequest request) {
        Account account = accountService.getAccountAuth();
        Employee employee = account.getEmployees();
        if (employee == null) {
            throw new CustomException(Error.EMPLOYEE_NOT_FOUND);
        }

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new CustomException(Error.LEAVE_REQUEST_INVALID_DATES);
        }

        double totalDays = calculateTotalDays(
                request.getStartDate(), request.getEndDate(), request.getDuration());

        boolean hasOverlap = leaveRequestRepository.existsOverlappingRequest(
                employee.getEmployeeId(), // dùng getEmployeeId() kiểu Long
                request.getStartDate(),
                request.getEndDate(),
                List.of(LeaveStatus.PENDING, LeaveStatus.APPROVED));
        if (hasOverlap) {
            throw new CustomException(Error.LEAVE_REQUEST_OVERLAP);
        }

        LeaveRequest entity = LeaveRequestMapper.toEntity(request);
        entity.setEmployee(employee);
        entity.setTotalDays(totalDays);

        LeaveRequest saved = leaveRequestRepository.save(entity);
        log.info("Leave request created by employee {} from {} to {}",
                employee.getFullName(), request.getStartDate(), request.getEndDate());
        return LeaveRequestMapper.toResponse(saved);
    }

    @Override
    public LeaveRequestResponse reviewRequest(Long id, LeaveRequestReviewRequest request) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new CustomException(Error.LEAVE_REQUEST_NOT_FOUND));

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new CustomException(Error.LEAVE_REQUEST_ALREADY_REVIEWED);
        }

        // Chỉ cho phép APPROVED hoặc REJECTED
        if (request.getStatus() != LeaveStatus.APPROVED
                && request.getStatus() != LeaveStatus.REJECTED) {
            throw new CustomException(Error.BAD_REQUEST);
        }

        Account account = accountService.getAccountAuth();
        Employee reviewer = account.getEmployees();

        leaveRequest.setApprovedBy(reviewer);
        leaveRequest.setApprovedAt(LocalDateTime.now());
        leaveRequest.setStatus(request.getStatus());

        if (request.getStatus() == LeaveStatus.APPROVED) {
            LocalDate current = leaveRequest.getStartDate();
            while (!current.isAfter(leaveRequest.getEndDate())) {
                attendanceService.markLeave(
                        leaveRequest.getEmployee().getEmployeeId(),
                        current,
                        reviewer);
                current = current.plusDays(1);
            }
            leaveRequest.setAttendanceGenerated(true);

        } else {
            // REJECTED — rejectReason bắt buộc
            if (request.getRejectReason() == null || request.getRejectReason().isBlank()) {
                throw new CustomException(Error.LEAVE_REQUEST_REJECT_REASON_REQUIRED);
            }
            leaveRequest.setRejectReason(request.getRejectReason());
        }

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);
        log.info("Leave request {} {} by {}", id, request.getStatus(), reviewer.getFullName());
        return LeaveRequestMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public LeaveRequestResponse getById(Long id) {
        return LeaveRequestMapper.toResponse(
                leaveRequestRepository.findById(id)
                        .orElseThrow(() -> new CustomException(Error.LEAVE_REQUEST_NOT_FOUND)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveRequestResponse> getMyRequests() {
        Account account = accountService.getAccountAuth();
        Employee employee = account.getEmployees();
        return LeaveRequestMapper.toResponseList(
                leaveRequestRepository.findByEmployeeOrderByCreatedAtDesc(employee));
    }

    @Override
    @Transactional(readOnly = true)
    public PageDTO<LeaveRequestResponse> filter(LeaveRequestFilter filter, int page, int size) {

        Specification<LeaveRequest> spec = LeaveRequestSpecification.filter(filter);
        Pageable pageable = PageRequest.of(page, size);

        Page<LeaveRequest> pageData = leaveRequestRepository.findAll(spec, pageable);

        return LeaveRequestMapper.toPageDTO(pageData);
    }

    @Override
    public void cancelRequest(Long id) {
        LeaveRequest request = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new CustomException(Error.LEAVE_REQUEST_NOT_FOUND));

        if (request.getStatus() != LeaveStatus.PENDING) {
            throw new CustomException(Error.LEAVE_REQUEST_NOT_PENDING);
        }

        Account account = accountService.getAccountAuth();
        if (!request.getEmployee().getEmployeeId()
                .equals(account.getEmployees().getEmployeeId())) {
            throw new CustomException(Error.LEAVE_REQUEST_NOT_OWNER);
        }

        request.setStatus(LeaveStatus.CANCELLED);
        leaveRequestRepository.save(request);
        log.info("Leave request {} cancelled", id);
    }

    // ===================== Private Helpers =====================

    private double calculateTotalDays(LocalDate start, LocalDate end, LeaveDuration duration) {
        long days = ChronoUnit.DAYS.between(start, end) + 1; // inclusive
        switch (duration) {
            case MORNING:
            case AFTERNOON:
                return days * 0.5;
            case FULL_DAY:
            default:
                return days;
        }
    }
}