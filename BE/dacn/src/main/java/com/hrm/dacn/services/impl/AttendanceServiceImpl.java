package com.hrm.dacn.services.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hrm.dacn.dtos.Attendance.request.AttendanceCreateRequest;
import com.hrm.dacn.dtos.Attendance.request.AttendanceFilterRequest;
import com.hrm.dacn.dtos.Attendance.request.AttendanceUpdateRequest;
import com.hrm.dacn.dtos.Attendance.request.CheckInRequest;
import com.hrm.dacn.dtos.Attendance.request.CheckOutRequest;
import com.hrm.dacn.dtos.Attendance.response.AttendanceResponse;
import com.hrm.dacn.dtos.Attendance.response.AttendanceStatistics;
import com.hrm.dacn.entities.Account;
import com.hrm.dacn.entities.Attendance;
import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.entities.OvertimeRequest;
import com.hrm.dacn.entities.WorkSchedule;
import com.hrm.dacn.enums.Attendance.AttendanceStatus;
import com.hrm.dacn.enums.Attendance.CheckMethod;
import com.hrm.dacn.enums.Attendance.OvertimeStatus;
import com.hrm.dacn.exceptions.CustomException;
import com.hrm.dacn.mappers.AttendanceMapper;
import com.hrm.dacn.repositories.AttendanceRepository;
import com.hrm.dacn.repositories.EmployeeRepository;
import com.hrm.dacn.repositories.OvertimeRequestRepository;
import com.hrm.dacn.repositories.WorkScheduleRepository;
import com.hrm.dacn.services.AccountService;
import com.hrm.dacn.services.AttendanceService;
import com.hrm.dacn.services.WorkCalendarService;
import com.hrm.dacn.exceptions.Error;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final WorkScheduleRepository workScheduleRepository;
    private final AccountService accountService;
    private final WorkCalendarService workCalendarService;
    private final AttendanceMapper attendanceMapper;
    private final OvertimeRequestRepository overtimeRequestRepository;

    @Override
    public AttendanceResponse checkIn(CheckInRequest request) {
        Account account = accountService.getAccountAuth();
        Employee employee = account.getEmployees();

        if (employee == null)
            throw new CustomException(Error.EMPLOYEE_NOT_FOUND);

        LocalDate today = LocalDate.now();

        if (attendanceRepository.existsByEmployeeAndAttendanceDateAndCheckInTimeIsNotNull(employee, today)) {
            throw new CustomException(List.of(Error.CONFLICT), "Already checked in today");
        }

        boolean isWorkingDay = workCalendarService.isWorkingDay(today);
        WorkSchedule schedule = getDefaultWorkSchedule();

        Attendance attendance = Attendance.builder()
                .employee(employee)
                .attendanceDate(today)
                .workSchedule(schedule)
                .checkInTime(LocalTime.now())
                .checkInMethod(request.getMethod() != null ? request.getMethod() : CheckMethod.BUTTON)
                .status(AttendanceStatus.PENDING)
                .isManualEntry(false)
                .isApproved(false)
                .isWorkingDay(isWorkingDay)
                .build();

        calculateCheckInStatus(attendance, schedule, isWorkingDay);
        attendanceRepository.save(attendance);

        return attendanceMapper.toResponse(attendance);
    }

    @Override
    public AttendanceResponse checkOut(CheckOutRequest request) {
        Account account = accountService.getAccountAuth();
        Employee employee = account.getEmployees();

        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository
                .findByEmployeeAndAttendanceDate(employee, today)
                .orElseThrow(() -> new CustomException(Error.ATTENDANCE_NOT_FOUND));

        if (attendance.getCheckOutTime() != null) {
            throw new CustomException(Error.ALREADY_CHECKED_OUT);
        }

        LocalTime checkOutTime = LocalTime.now();

        if (checkOutTime.isBefore(attendance.getCheckInTime())) {
            throw new CustomException(List.of(Error.VALIDATION_ERROR), "Check-out before check-in");
        }

        attendance.setCheckOutTime(checkOutTime);
        attendance.setCheckOutMethod(request.getMethod() != null ? request.getMethod() : CheckMethod.BUTTON);

        WorkSchedule schedule = attendance.getWorkSchedule() != null
                ? attendance.getWorkSchedule()
                : getDefaultWorkSchedule();
        attendance.setWorkSchedule(schedule);

        boolean isWorkingDay = attendance.getIsWorkingDay();

        calculateCheckOutStatus(attendance, schedule, isWorkingDay);
        calculateWorkHours(attendance, schedule, isWorkingDay);
        updateFinalStatus(attendance, isWorkingDay);

        attendanceRepository.save(attendance);

        return attendanceMapper.toResponse(attendance);
    }

    @Override
    public AttendanceResponse createManual(AttendanceCreateRequest request) {
        Account account = accountService.getAccountAuth();
        Employee createdBy = account.getEmployees();

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new CustomException(Error.EMPLOYEE_NOT_FOUND));

        boolean isWorkingDay = workCalendarService.isWorkingDay(request.getAttendanceDate());

        attendanceRepository.findByEmployeeAndAttendanceDate(employee, request.getAttendanceDate())
                .ifPresent(a -> {
                    throw new CustomException(List.of(Error.CONFLICT), "Attendance already exists for this date");
                });

        if (request.getCheckInTime() != null && request.getCheckOutTime() != null
                && request.getCheckOutTime().isBefore(request.getCheckInTime())) {
            throw new CustomException(List.of(Error.VALIDATION_ERROR), "Check-out time cannot be before check-in time");
        }

        WorkSchedule schedule = getDefaultWorkSchedule();

        Attendance attendance = Attendance.builder()
                .employee(employee)
                .attendanceDate(request.getAttendanceDate())
                .workSchedule(schedule)
                .checkInTime(request.getCheckInTime())
                .checkOutTime(request.getCheckOutTime())
                .checkInMethod(request.getCheckInMethod())
                .checkOutMethod(request.getCheckOutMethod())
                .status(AttendanceStatus.PENDING)
                .note(request.getNote())
                .isManualEntry(true)
                .createdBy(createdBy)
                .isApproved(false)
                .isWorkingDay(isWorkingDay)
                .build();

        if (attendance.getCheckInTime() != null) {
            calculateCheckInStatus(attendance, schedule, isWorkingDay);
        }
        if (attendance.getCheckOutTime() != null) {
            calculateCheckOutStatus(attendance, schedule, isWorkingDay);
            calculateWorkHours(attendance, schedule, isWorkingDay);
            updateFinalStatus(attendance, isWorkingDay);
        }

        return attendanceMapper.toResponse(attendanceRepository.save(attendance));
    }

    @Override
    public AttendanceResponse update(Long id, AttendanceUpdateRequest request) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new CustomException(Error.ATTENDANCE_NOT_FOUND));

        if (request.getCheckInTime() != null)
            attendance.setCheckInTime(request.getCheckInTime());
        if (request.getCheckOutTime() != null)
            attendance.setCheckOutTime(request.getCheckOutTime());
        if (request.getStatus() != null)
            attendance.setStatus(request.getStatus());
        if (request.getNote() != null)
            attendance.setNote(request.getNote());

        if (request.getIsApproved() != null) {
            attendance.setIsApproved(request.getIsApproved());
            if (request.getIsApproved()) {
                Account account = accountService.getAccountAuth();
                attendance.setApprovedBy(account.getEmployees());
                attendance.setApprovedAt(LocalDateTime.now());
            }
        }

        if (request.getCheckInTime() != null || request.getCheckOutTime() != null) {
            boolean isWorkingDay = workCalendarService.isWorkingDay(attendance.getAttendanceDate());
            attendance.setIsWorkingDay(isWorkingDay);
            WorkSchedule schedule = getDefaultWorkSchedule();

            if (request.getCheckInTime() != null)
                calculateCheckInStatus(attendance, schedule, isWorkingDay);
            if (attendance.getCheckOutTime() != null) {
                calculateCheckOutStatus(attendance, schedule, isWorkingDay);
                calculateWorkHours(attendance, schedule, isWorkingDay);
                updateFinalStatus(attendance, isWorkingDay);
            }
        }

        return attendanceMapper.toResponse(attendanceRepository.save(attendance));
    }

    // =================== Private Helpers ===================

    private WorkSchedule getDefaultWorkSchedule() {
        return workScheduleRepository.findByIsDefaultTrue()
                .orElseThrow(() -> new CustomException(Error.WORK_SCHEDULE_NOT_FOUND));
    }

    private void calculateCheckInStatus(Attendance attendance, WorkSchedule schedule, boolean isWorkingDay) {
        if (attendance.getCheckInTime() == null)
            return;

        if (!isWorkingDay) {
            attendance.setStatus(AttendanceStatus.OVERTIME);
            attendance.setLateMinutes(0);
            attendance.setIsWeekendOrHoliday(true);
            return;
        }

        int lateMinutes = (int) Duration.between(schedule.getStartTime(), attendance.getCheckInTime()).toMinutes();

        if (lateMinutes <= 0 || lateMinutes <= schedule.getLateToleranceMinutes()) {
            attendance.setStatus(AttendanceStatus.ON_TIME);
            attendance.setLateMinutes(0);
        } else {
            attendance.setStatus(AttendanceStatus.LATE);
            attendance.setLateMinutes(lateMinutes - schedule.getLateToleranceMinutes());
        }
    }

    private void calculateCheckOutStatus(Attendance attendance, WorkSchedule schedule, boolean isWorkingDay) {
        if (attendance.getCheckOutTime() == null)
            return;

        attendance.setEarlyLeaveMinutes(0);
        attendance.setOvertimeMinutes(0);

        if (!isWorkingDay)
            return;

        int earlyMinutes = (int) Duration.between(attendance.getCheckOutTime(), schedule.getEndTime()).toMinutes();
        if (earlyMinutes > schedule.getEarlyLeaveToleranceMinutes()) {
            attendance.setEarlyLeaveMinutes(earlyMinutes - schedule.getEarlyLeaveToleranceMinutes());
        }
    }

    private void calculateWorkHours(Attendance attendance, WorkSchedule schedule, boolean isWorkingDay) {
        if (attendance.getCheckInTime() == null || attendance.getCheckOutTime() == null) {
            attendance.setWorkHours(0.0);
            attendance.setOvertimeMinutes(0);
            return;
        }

        long totalMinutes = Duration.between(attendance.getCheckInTime(), attendance.getCheckOutTime()).toMinutes();

        // Trừ giờ nghỉ trưa nếu làm việc qua khoảng đó
        if (schedule.getBreakStartTime() != null && schedule.getBreakEndTime() != null) {
            LocalTime overlapStart = maxTime(attendance.getCheckInTime(), schedule.getBreakStartTime());
            LocalTime overlapEnd = minTime(attendance.getCheckOutTime(), schedule.getBreakEndTime());
            if (overlapStart.isBefore(overlapEnd)) {
                totalMinutes -= Duration.between(overlapStart, overlapEnd).toMinutes();
            }
        }

        attendance.setWorkHours(Math.max(0, totalMinutes / 60.0));

        if (!isWorkingDay) {
            // Ngày nghỉ/lễ: toàn bộ giờ làm = overtime
            attendance.setOvertimeMinutes((int) totalMinutes);
            attendance.setIsWeekendOrHoliday(true);
        } else {
            attendance.setIsWeekendOrHoliday(false);
            calculateOvertime(attendance, schedule);
        }
    }

    /**
     * Tính OT khi checkout.
     * Chỉ tính nếu đã có OT request được APPROVED TRƯỚC khi checkout.
     * Dùng chung logic calculateOTMinutes() với OvertimeServiceImpl.
     */
    private void calculateOvertime(Attendance attendance, WorkSchedule schedule) {
        Optional<OvertimeRequest> approvedOT = overtimeRequestRepository
                .findByEmployeeAndOvertimeDateAndStatus(
                        attendance.getEmployee(),
                        attendance.getAttendanceDate(),
                        OvertimeStatus.APPROVED);

        if (approvedOT.isEmpty()) {
            attendance.setOvertimeMinutes(0);
            return;
        }

        OvertimeRequest ot = approvedOT.get();
        int otMinutes = OvertimeServiceImpl.calculateOTMinutes(
                attendance.getCheckOutTime(),
                ot.getStartTime(),
                ot.getEndTime(),
                schedule.getEndTime());

        attendance.setOvertimeMinutes(otMinutes);
    }

    private void updateFinalStatus(Attendance attendance, boolean isWorkingDay) {
        if (attendance.getCheckInTime() == null || attendance.getCheckOutTime() == null)
            return;

        if (!isWorkingDay) {
            attendance.setStatus(AttendanceStatus.OVERTIME);
            return;
        }

        boolean isLate = attendance.getLateMinutes() != null && attendance.getLateMinutes() > 0;
        boolean isEarlyLeave = attendance.getEarlyLeaveMinutes() != null && attendance.getEarlyLeaveMinutes() > 0;
        boolean hasOT = attendance.getOvertimeMinutes() != null && attendance.getOvertimeMinutes() > 0;

        if (isLate && isEarlyLeave)
            attendance.setStatus(AttendanceStatus.LATE_AND_EARLY_LEAVE);
        else if (isLate)
            attendance.setStatus(AttendanceStatus.LATE);
        else if (isEarlyLeave)
            attendance.setStatus(AttendanceStatus.EARLY_LEAVE);
        else if (hasOT)
            attendance.setStatus(AttendanceStatus.OVERTIME);
        else
            attendance.setStatus(AttendanceStatus.ON_TIME);
    }

    private LocalTime maxTime(LocalTime t1, LocalTime t2) {
        return t1.isAfter(t2) ? t1 : t2;
    }

    private LocalTime minTime(LocalTime t1, LocalTime t2) {
        return t1.isBefore(t2) ? t1 : t2;
    }

    // =================== Read / Admin ===================

    @Override
    @Transactional(readOnly = true)
    public AttendanceResponse getById(Long id) {
        return attendanceMapper.toResponse(attendanceRepository.findById(id)
                .orElseThrow(() -> new CustomException(Error.ATTENDANCE_NOT_FOUND)));
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceResponse getTodayAttendance(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new CustomException(Error.EMPLOYEE_NOT_FOUND));
        return attendanceMapper.toResponse(
                attendanceRepository.findByEmployeeAndAttendanceDate(employee, LocalDate.now()).orElse(null));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AttendanceResponse> getAll(AttendanceFilterRequest filter, Pageable pageable) {
        return attendanceRepository.findAll(buildSpecification(filter), pageable)
                .map(AttendanceMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getMonthlyAttendance(Long employeeId, int year, int month) {
        return attendanceRepository.findByEmployeeIdAndYearAndMonth(employeeId, year, month)
                .stream().map(AttendanceMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceStatistics getStatistics(Long employeeId, LocalDate startDate, LocalDate endDate) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new CustomException(Error.EMPLOYEE_NOT_FOUND));
        return calculateStatistics(employee,
                attendanceRepository.findByEmployeeAndAttendanceDateBetween(employee, startDate, endDate));
    }

    @Override
    public AttendanceResponse approve(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new CustomException(Error.ATTENDANCE_NOT_FOUND));
        Account account = accountService.getAccountAuth();
        attendance.setIsApproved(true);
        attendance.setApprovedBy(account.getEmployees());
        attendance.setApprovedAt(LocalDateTime.now());
        return attendanceMapper.toResponse(attendanceRepository.save(attendance));
    }

    @Override
    public void delete(Long id) {
        if (!attendanceRepository.existsById(id))
            throw new CustomException(Error.ATTENDANCE_NOT_FOUND);
        attendanceRepository.deleteById(id);
    }

    private Specification<Attendance> buildSpecification(AttendanceFilterRequest filter) {
        return (root, query, cb) -> {
            var predicates = new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();
            if (filter.getEmployeeId() != null)
                predicates.add(cb.equal(root.get("employee").get("id"), filter.getEmployeeId()));
            if (filter.getStartDate() != null)
                predicates.add(cb.greaterThanOrEqualTo(root.get("attendanceDate"), filter.getStartDate()));
            if (filter.getEndDate() != null)
                predicates.add(cb.lessThanOrEqualTo(root.get("attendanceDate"), filter.getEndDate()));
            if (filter.getStatus() != null)
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            if (filter.getIsApproved() != null)
                predicates.add(cb.equal(root.get("isApproved"), filter.getIsApproved()));
            if (filter.getIsManualEntry() != null)
                predicates.add(cb.equal(root.get("isManualEntry"), filter.getIsManualEntry()));
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }

    private AttendanceStatistics calculateStatistics(Employee employee, List<Attendance> attendances) {
        int totalOvertimeMinutes = attendances.stream()
                .filter(a -> a.getOvertimeMinutes() != null)
                .mapToInt(Attendance::getOvertimeMinutes).sum();

        return AttendanceStatistics.builder()
                .employeeId(employee.getEmployeeId())
                .employeeName(employee.getFullName())
                .totalDays(attendances.size())
                .presentDays((int) attendances.stream()
                        .filter(a -> a.getCheckInTime() != null && a.getCheckOutTime() != null).count())
                .absentDays((int) attendances.stream()
                        .filter(a -> a.getCheckInTime() == null && a.getCheckOutTime() == null).count())
                .lateDays((int) attendances.stream()
                        .filter(a -> a.getStatus() == AttendanceStatus.LATE
                                || a.getStatus() == AttendanceStatus.LATE_AND_EARLY_LEAVE)
                        .count())
                .totalLateMinutes(attendances.stream()
                        .filter(a -> a.getLateMinutes() != null).mapToInt(Attendance::getLateMinutes).sum())
                .earlyLeaveDays((int) attendances.stream()
                        .filter(a -> a.getStatus() == AttendanceStatus.EARLY_LEAVE
                                || a.getStatus() == AttendanceStatus.LATE_AND_EARLY_LEAVE)
                        .count())
                .totalEarlyLeaveMinutes(attendances.stream()
                        .filter(a -> a.getEarlyLeaveMinutes() != null).mapToInt(Attendance::getEarlyLeaveMinutes).sum())
                .totalOvertimeHours(totalOvertimeMinutes / 60.0)
                .totalWorkHours(attendances.stream()
                        .filter(a -> a.getWorkHours() != null).mapToDouble(Attendance::getWorkHours).sum())
                .build();
    }

    @Override
    public void markLeave(Long employeeId, LocalDate date, Employee approvedBy) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new CustomException(Error.EMPLOYEE_NOT_FOUND));

        // Bỏ qua nếu đã có bản ghi ngày này
        if (attendanceRepository.existsByEmployeeAndAttendanceDate(employee, date)) {
            log.info("Attendance already exists for employee {} on {}, skipping", employeeId, date);
            return;
        }

        Attendance attendance = Attendance.builder()
                .employee(employee)
                .attendanceDate(date)
                .status(AttendanceStatus.LEAVE)
                .isManualEntry(true)
                .isApproved(true)
                .approvedBy(approvedBy)
                .approvedAt(LocalDateTime.now())
                .isWorkingDay(workCalendarService.isWorkingDay(date))
                .workHours(0.0)
                .lateMinutes(0)
                .earlyLeaveMinutes(0)
                .overtimeMinutes(0)
                .build();

        attendanceRepository.save(attendance);
        log.info("Marked ON_LEAVE for employee {} on {}", employeeId, date);
    }
}