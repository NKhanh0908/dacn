package com.hrm.dacn.services.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hrm.dacn.dtos.Attendance.request.AttendanceRequest;
import com.hrm.dacn.dtos.Attendance.request.AttendanceRequestCreateRequest;
import com.hrm.dacn.dtos.Attendance.request.AttendanceRequestResponse;
import com.hrm.dacn.dtos.Attendance.request.AttendanceRequestReviewRequest;
import com.hrm.dacn.entities.Account;
import com.hrm.dacn.entities.Attendance;
import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.enums.Attendance.AttendanceStatus;
import com.hrm.dacn.enums.Attendance.CheckMethod;
import com.hrm.dacn.enums.Attendance.RequestStatus;
import com.hrm.dacn.exceptions.CustomException;
import com.hrm.dacn.exceptions.Error;
import com.hrm.dacn.mappers.AttendanceRequestMapper;
import com.hrm.dacn.repositories.AttendanceRepository;
import com.hrm.dacn.repositories.AttendanceRequestRepository;
import com.hrm.dacn.services.AccountService;
import com.hrm.dacn.services.AttendanceRequestService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceRequestServiceImpl implements AttendanceRequestService {

    private final AttendanceRequestRepository requestRepository;
    private final AttendanceRepository attendanceRepository;
    private final AccountService accountService;
    private final AttendanceRequestMapper requestMapper;

    @Override
    @Transactional
    public AttendanceRequestResponse createRequest(AttendanceRequestCreateRequest request) {

        Account account = accountService.getAccountAuth();
        Employee employee = account.getEmployees();

        if (employee == null) {
            throw new CustomException(Error.EMPLOYEE_NOT_FOUND);
        }

        // Đã có request PENDING cùng ngày
        requestRepository
                .findByEmployeeAndRequestDateAndStatus(
                        employee,
                        request.getRequestDate(),
                        RequestStatus.PENDING)
                .ifPresent(r -> {
                    throw new CustomException(Error.ATTENDANCE_REQUEST_ALREADY_PENDING);
                });

        // Đã có attendance
        attendanceRepository
                .findByEmployeeAndAttendanceDate(employee, request.getRequestDate())
                .ifPresent(a -> {
                    throw new CustomException(Error.ATTENDANCE_REQUEST_ATTENDANCE_EXISTS);
                });

        // Validate time
        validateRequestTimes(request);

        AttendanceRequest attendanceRequest = AttendanceRequest.builder()
                .employee(employee)
                .requestDate(request.getRequestDate())
                .checkInTime(request.getCheckInTime())
                .checkOutTime(request.getCheckOutTime())
                .requestType(request.getRequestType())
                .reason(request.getReason())
                .status(RequestStatus.PENDING)
                .build();

        AttendanceRequest savedRequest;
        try {
            savedRequest = requestRepository.save(attendanceRequest);
        } catch (Exception e) {
            log.error("Failed to create attendance request", e);
            throw new CustomException(Error.ATTENDANCE_REQUEST_CREATION_FAILED);
        }

        log.info("Attendance request created by employee {}", employee.getFullName());
        return requestMapper.toResponse(savedRequest);
    }

    @Override
    public AttendanceRequestResponse reviewRequest(Long id, AttendanceRequestReviewRequest request) {

        AttendanceRequest attendanceRequest = requestRepository.findById(id)
                .orElseThrow(() -> new CustomException(Error.ATTENDANCE_REQUEST_NOT_FOUND));

        if (attendanceRequest.getStatus() != RequestStatus.PENDING) {
            throw new CustomException(Error.ATTENDANCE_REQUEST_ALREADY_REVIEWED);
        }

        Account account = accountService.getAccountAuth();
        Employee reviewer = account.getEmployees();

        attendanceRequest.setStatus(request.getStatus());
        attendanceRequest.setReviewedBy(reviewer);
        attendanceRequest.setReviewedAt(LocalDateTime.now());
        attendanceRequest.setReviewNote(request.getReviewNote());

        if (request.getStatus() == RequestStatus.APPROVED) {
            createAttendanceFromRequest(attendanceRequest, reviewer);
        }

        AttendanceRequest savedRequest = requestRepository.save(attendanceRequest);

        log.info("Attendance request {} {} by {}",
                id,
                request.getStatus(),
                reviewer.getFullName());

        return requestMapper.toResponse(savedRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceRequestResponse getById(Long id) {
        AttendanceRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new CustomException(Error.ATTENDANCE_REQUEST_NOT_FOUND));

        return requestMapper.toResponse(request);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRequestResponse> getMyRequests() {

        Account account = accountService.getAccountAuth();
        Employee employee = account.getEmployees();

        return requestRepository
                .findByEmployeeOrderByCreatedAtDesc(employee)
                .stream()
                .map(AttendanceRequestMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AttendanceRequestResponse> getPendingRequests(Pageable pageable) {

        return requestRepository
                .findAll((root, query, cb) -> cb.equal(root.get("status"), RequestStatus.PENDING), pageable)
                .map(AttendanceRequestMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AttendanceRequestResponse> getAllRequests(Pageable pageable) {
        return requestRepository.findAll(pageable)
                .map(AttendanceRequestMapper::toResponse);

    }

    @Override
    public void cancelRequest(Long id) {

        AttendanceRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new CustomException(Error.ATTENDANCE_REQUEST_NOT_FOUND));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new CustomException(Error.ATTENDANCE_REQUEST_NOT_PENDING);
        }

        Account account = accountService.getAccountAuth();
        if (!request.getEmployee().getEmployeeId()
                .equals(account.getEmployees().getEmployeeId())) {
            throw new CustomException(Error.ATTENDANCE_REQUEST_NOT_OWNER);
        }

        requestRepository.delete(request);
        log.info("Attendance request {} cancelled", id);
    }

    // ===================== Private Helpers =====================

    private void validateRequestTimes(AttendanceRequestCreateRequest request) {

        switch (request.getRequestType()) {
            case FORGOT_CHECK_IN:
                if (request.getCheckInTime() == null) {
                    throw new CustomException(Error.ATTENDANCE_REQUEST_INVALID_TIME);
                }
                break;

            case FORGOT_CHECK_OUT:
                if (request.getCheckOutTime() == null) {
                    throw new CustomException(Error.ATTENDANCE_REQUEST_INVALID_TIME);
                }
                break;

            case FORGOT_BOTH:
                if (request.getCheckInTime() == null
                        || request.getCheckOutTime() == null) {
                    throw new CustomException(Error.ATTENDANCE_REQUEST_INVALID_TIME);
                }
                break;

            case CORRECTION:
                if (request.getCheckInTime() == null
                        && request.getCheckOutTime() == null) {
                    throw new CustomException(Error.ATTENDANCE_REQUEST_INVALID_TIME);
                }
                break;
        }

        if (request.getCheckInTime() != null
                && request.getCheckOutTime() != null
                && request.getCheckOutTime().isBefore(request.getCheckInTime())) {
            throw new CustomException(Error.ATTENDANCE_REQUEST_INVALID_TIME);
        }
    }

    private void createAttendanceFromRequest(
            AttendanceRequest request,
            Employee createdBy) {

        Attendance attendance = Attendance.builder()
                .employee(request.getEmployee())
                .attendanceDate(request.getRequestDate())
                .checkInTime(request.getCheckInTime())
                .checkOutTime(request.getCheckOutTime())
                .checkInMethod(CheckMethod.MANUAL)
                .checkOutMethod(CheckMethod.MANUAL)
                .status(AttendanceStatus.PENDING)
                .note("Created from request: " + request.getReason())
                .isManualEntry(true)
                .createdBy(createdBy)
                .isApproved(true)
                .approvedBy(createdBy)
                .approvedAt(LocalDateTime.now())
                .build();

        attendanceRepository.save(attendance);

        log.info("Attendance created from approved request for employee {}",
                request.getEmployee().getFullName());
    }
}
