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
import com.hrm.dacn.entities.WorkSchedule;
import com.hrm.dacn.enums.Attendance.AttendanceStatus;
import com.hrm.dacn.enums.Attendance.CheckMethod;
import com.hrm.dacn.exceptions.CustomException;
import com.hrm.dacn.mappers.AttendanceMapper;
import com.hrm.dacn.repositories.AttendanceRepository;
import com.hrm.dacn.repositories.EmployeeRepository;
import com.hrm.dacn.repositories.WorkScheduleRepository;
import com.hrm.dacn.services.AccountService;
import com.hrm.dacn.services.AttendanceService;
import com.hrm.dacn.services.WorkCalendarService;
import com.hrm.dacn.exceptions.Error;

import java.time.DayOfWeek;
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
    private final WorkCalendarService workCalendarService; // Thêm service kiểm tra ngày làm việc
    private final AttendanceMapper attendanceMapper;

    @Override
    public AttendanceResponse checkIn(CheckInRequest request) {
        // Lấy thông tin nhân viên hiện tại
        Account account = accountService.getAccountAuth();
        Employee employee = account.getEmployees();

        if (employee == null) {
            throw new CustomException(Error.EMPLOYEE_NOT_FOUND);
        }

        LocalDate today = LocalDate.now();
        LocalDateTime checkInTime = LocalDateTime.now();

        // ✅ THÊM: Kiểm tra ngày làm việc theo WorkCalendar
        boolean isWorkingDay = workCalendarService.isWorkingDay(today);

        // Kiểm tra đã check-in hôm nay chưa
        boolean alreadyCheckedIn = attendanceRepository
                .existsByEmployeeAndAttendanceDateAndCheckInTimeIsNotNull(employee, today);

        if (alreadyCheckedIn) {
            throw new CustomException(List.of(Error.CONFLICT), "You have already checked in today");
        }

        // Lấy ca làm việc mặc định
        WorkSchedule schedule = getDefaultWorkSchedule();

        // Tạo bản ghi chấm công
        Attendance attendance = Attendance.builder()
                .employee(employee)
                .attendanceDate(today)
                .checkInTime(checkInTime)
                .checkInMethod(request.getMethod() != null ? request.getMethod() : CheckMethod.BUTTON)
                .status(AttendanceStatus.PENDING)
                .note(request.getNote())
                .isManualEntry(false)
                .isApproved(false)
                .isWorkingDay(isWorkingDay) // Lưu thông tin ngày làm việc
                .build();

        // ✅ SỬA: Tính toán trạng thái check-in với logic mới
        calculateCheckInStatus(attendance, schedule, isWorkingDay);

        attendance = attendanceRepository.save(attendance);

        log.info("Employee {} checked in at {} (Working day: {})",
                employee.getFullName(), checkInTime, isWorkingDay);

        return attendanceMapper.toResponse(attendance);
    }

    @Override
    public AttendanceResponse checkOut(CheckOutRequest request) {
        // Lấy thông tin nhân viên hiện tại
        Account account = accountService.getAccountAuth();
        Employee employee = account.getEmployees();

        if (employee == null) {
            throw new CustomException(Error.EMPLOYEE_NOT_FOUND);
        }

        LocalDate today = LocalDate.now();

        // Tìm bản ghi check-in hôm nay
        Attendance attendance = attendanceRepository
                .findByEmployeeAndAttendanceDate(employee, today)
                .orElseThrow(() -> new CustomException(Error.ATTENDANCE_NOT_FOUND));

        if (attendance.getCheckInTime() == null) {
            throw new CustomException(Error.NOT_CHECKED_IN);
        }

        if (attendance.getCheckOutTime() != null) {
            throw new CustomException(Error.ALREADY_CHECKED_OUT);
        }

        LocalDateTime checkOutTime = LocalDateTime.now();

        // ✅ THÊM: Kiểm tra check-out phải sau check-in
        if (checkOutTime.isBefore(attendance.getCheckInTime())) {
            throw new CustomException(
                    List.of(Error.VALIDATION_ERROR),
                    "Check-out time cannot be before check-in time");
        }

        attendance.setCheckOutTime(checkOutTime);
        attendance.setCheckOutMethod(request.getMethod() != null ? request.getMethod() : CheckMethod.BUTTON);

        if (request.getNote() != null && !request.getNote().isEmpty()) {
            attendance.setNote(attendance.getNote() != null ? attendance.getNote() + " | " + request.getNote()
                    : request.getNote());
        }

        // Lấy ca làm việc mặc định
        WorkSchedule schedule = getDefaultWorkSchedule();

        // Lấy thông tin ngày làm việc (đã lưu khi check-in)
        boolean isWorkingDay = attendance.getIsWorkingDay() != null ? attendance.getIsWorkingDay()
                : workCalendarService.isWorkingDay(today);

        // ✅ SỬA: Tính toán trạng thái check-out với logic mới
        calculateCheckOutStatus(attendance, schedule, isWorkingDay);

        // ✅ SỬA: Tính tổng giờ làm việc (có trừ giờ nghỉ trưa chính xác)
        calculateWorkHours(attendance, schedule, isWorkingDay);

        // ✅ THÊM: Cập nhật trạng thái cuối cùng
        updateFinalStatus(attendance, isWorkingDay);

        attendance = attendanceRepository.save(attendance);

        log.info("Employee {} checked out at {} (Working day: {})",
                employee.getFullName(), checkOutTime, isWorkingDay);

        return attendanceMapper.toResponse(attendance);
    }

    @Override
    public AttendanceResponse createManual(AttendanceCreateRequest request) {
        // Lấy thông tin HR đang tạo
        Account account = accountService.getAccountAuth();
        Employee createdBy = account.getEmployees();

        // Lấy thông tin nhân viên cần tạo chấm công
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new CustomException(Error.EMPLOYEE_NOT_FOUND));

        // ✅ THÊM: Kiểm tra ngày làm việc theo WorkCalendar
        boolean isWorkingDay = workCalendarService.isWorkingDay(request.getAttendanceDate());

        // Kiểm tra đã tồn tại chấm công cho ngày này chưa
        attendanceRepository.findByEmployeeAndAttendanceDate(employee, request.getAttendanceDate())
                .ifPresent(a -> {
                    throw new CustomException(
                            List.of(Error.CONFLICT),
                            "Attendance already exists for this date");
                });

        // Validate thời gian
        if (request.getCheckInTime() != null && request.getCheckOutTime() != null) {
            if (request.getCheckOutTime().isBefore(request.getCheckInTime())) {
                throw new CustomException(
                        List.of(Error.VALIDATION_ERROR),
                        "Check-out time cannot be before check-in time");
            }
        }

        // Tạo bản ghi chấm công thủ công
        Attendance attendance = Attendance.builder()
                .employee(employee)
                .attendanceDate(request.getAttendanceDate())
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

        // Lấy ca làm việc mặc định
        WorkSchedule schedule = getDefaultWorkSchedule();

        // Tính toán trạng thái
        if (attendance.getCheckInTime() != null) {
            calculateCheckInStatus(attendance, schedule, isWorkingDay);
        }

        if (attendance.getCheckOutTime() != null) {
            calculateCheckOutStatus(attendance, schedule, isWorkingDay);
            calculateWorkHours(attendance, schedule, isWorkingDay);
            updateFinalStatus(attendance, isWorkingDay);
        }

        attendance = attendanceRepository.save(attendance);

        log.info("Manual attendance created for employee {} by {} (Working day: {})",
                employee.getFullName(), createdBy.getFullName(), isWorkingDay);

        return attendanceMapper.toResponse(attendance);
    }

    @Override
    public AttendanceResponse update(Long id, AttendanceUpdateRequest request) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new CustomException(Error.ATTENDANCE_NOT_FOUND));

        // Cập nhật thông tin
        if (request.getCheckInTime() != null) {
            attendance.setCheckInTime(request.getCheckInTime());
        }

        if (request.getCheckOutTime() != null) {
            attendance.setCheckOutTime(request.getCheckOutTime());
        }

        if (request.getStatus() != null) {
            attendance.setStatus(request.getStatus());
        }

        if (request.getNote() != null) {
            attendance.setNote(request.getNote());
        }

        if (request.getIsApproved() != null) {
            attendance.setIsApproved(request.getIsApproved());
            if (request.getIsApproved()) {
                Account account = accountService.getAccountAuth();
                attendance.setApprovedBy(account.getEmployees());
                attendance.setApprovedAt(LocalDateTime.now());
            }
        }

        // Tính lại nếu có thay đổi thời gian
        if (request.getCheckInTime() != null || request.getCheckOutTime() != null) {
            // Kiểm tra lại ngày làm việc
            boolean isWorkingDay = workCalendarService.isWorkingDay(attendance.getAttendanceDate());
            attendance.setIsWorkingDay(isWorkingDay);

            WorkSchedule schedule = getDefaultWorkSchedule();

            if (request.getCheckInTime() != null) {
                calculateCheckInStatus(attendance, schedule, isWorkingDay);
            }

            if (attendance.getCheckOutTime() != null) {
                calculateCheckOutStatus(attendance, schedule, isWorkingDay);
                calculateWorkHours(attendance, schedule, isWorkingDay);
                updateFinalStatus(attendance, isWorkingDay);
            }
        }

        attendance = attendanceRepository.save(attendance);

        return attendanceMapper.toResponse(attendance);
    }

    // ============= Private Helper Methods =============

    private WorkSchedule getDefaultWorkSchedule() {
        return workScheduleRepository.findByIsDefaultTrue()
                .orElseThrow(() -> new CustomException(Error.WORK_SCHEDULE_NOT_FOUND));
    }

    /**
     * ✅ SỬA: Tính toán trạng thái check-in với logic mới
     * - Nếu là ngày làm việc: tính trễ bình thường
     * - Nếu là ngày nghỉ (thứ 7, CN): coi là OVERTIME và không tính trễ
     */
    private void calculateCheckInStatus(Attendance attendance, WorkSchedule schedule, boolean isWorkingDay) {
        if (attendance.getCheckInTime() == null)
            return;

        LocalTime checkInTime = attendance.getCheckInTime().toLocalTime();
        LocalTime scheduledStartTime = schedule.getStartTime();

        // Nếu là ngày nghỉ -> coi là làm thêm giờ
        if (!isWorkingDay) {
            attendance.setStatus(AttendanceStatus.OVERTIME);
            attendance.setLateMinutes(0);
            attendance.setIsWeekendOrHoliday(true);
            return;
        }

        int lateMinutes = (int) Duration.between(scheduledStartTime, checkInTime).toMinutes();

        if (lateMinutes <= 0) {
            // Check-in sớm hoặc đúng giờ
            attendance.setStatus(AttendanceStatus.ON_TIME);
            attendance.setLateMinutes(0);
        } else if (lateMinutes <= schedule.getLateToleranceMinutes()) {
            // Trễ trong khoảng cho phép
            attendance.setStatus(AttendanceStatus.ON_TIME);
            attendance.setLateMinutes(0);
        } else {
            // Trễ quá mức cho phép
            attendance.setStatus(AttendanceStatus.LATE);
            attendance.setLateMinutes(lateMinutes - schedule.getLateToleranceMinutes());
        }
    }

    /**
     * ✅ SỬA: Tính toán trạng thái check-out với logic mới
     * - Nếu là ngày nghỉ: không tính về sớm, toàn bộ giờ làm là overtime
     */
    private void calculateCheckOutStatus(Attendance attendance, WorkSchedule schedule, boolean isWorkingDay) {
        if (attendance.getCheckOutTime() == null)
            return;

        LocalTime checkOutTime = attendance.getCheckOutTime().toLocalTime();
        LocalTime scheduledEndTime = schedule.getEndTime();

        // Reset các giá trị
        attendance.setEarlyLeaveMinutes(0);
        attendance.setOvertimeMinutes(0);

        // Nếu là ngày nghỉ -> toàn bộ là overtime, không tính về sớm
        if (!isWorkingDay) {
            // Overtime sẽ được tính trong calculateWorkHours
            return;
        }

        int earlyMinutes = (int) Duration.between(checkOutTime, scheduledEndTime).toMinutes();
        int overtimeMinutes = (int) Duration.between(scheduledEndTime, checkOutTime).toMinutes();

        if (earlyMinutes > schedule.getEarlyLeaveToleranceMinutes()) {
            // Về sớm quá mức cho phép
            attendance.setEarlyLeaveMinutes(earlyMinutes - schedule.getEarlyLeaveToleranceMinutes());
        } else if (overtimeMinutes > 0) {
            // Làm thêm giờ (chỉ tính sau giờ kết thúc)
            attendance.setOvertimeMinutes(overtimeMinutes);
        }
    }

    /**
     * ✅ SỬA LẠI: Tính giờ làm việc chính xác (trừ giờ nghỉ trưa nếu có)
     * - Chỉ trừ giờ nghỉ trưa nếu thời gian làm việc trùng với giờ nghỉ
     * - Tính overtime riêng cho ngày nghỉ
     */
    private void calculateWorkHours(Attendance attendance, WorkSchedule schedule, boolean isWorkingDay) {
        if (attendance.getCheckInTime() == null || attendance.getCheckOutTime() == null) {
            attendance.setWorkHours(0.0);
            attendance.setOvertimeMinutes(0);
            return;
        }

        LocalTime checkInTime = attendance.getCheckInTime().toLocalTime();
        LocalTime checkOutTime = attendance.getCheckOutTime().toLocalTime();

        // Tính tổng thời gian làm việc (tính bằng phút)
        long totalMinutes = Duration.between(
                attendance.getCheckInTime(),
                attendance.getCheckOutTime()).toMinutes();

        // Biến lưu thời gian nghỉ trưa thực tế được trừ
        long breakMinutesToSubtract = 0;

        // ✅ SỬA: Chỉ trừ giờ nghỉ trưa nếu có và nếu làm việc qua giờ nghỉ
        if (schedule.getBreakStartTime() != null &&
                schedule.getBreakEndTime() != null &&
                totalMinutes > 0) {

            LocalTime breakStart = schedule.getBreakStartTime();
            LocalTime breakEnd = schedule.getBreakEndTime();

            // Tìm phần giao giữa thời gian làm việc và giờ nghỉ trưa
            LocalTime overlapStart = maxTime(checkInTime, breakStart);
            LocalTime overlapEnd = minTime(checkOutTime, breakEnd);

            // Nếu có phần giao (overlap) thì trừ đi
            if (overlapStart.isBefore(overlapEnd)) {
                breakMinutesToSubtract = Duration.between(overlapStart, overlapEnd).toMinutes();
                totalMinutes -= breakMinutesToSubtract;
            }
        }

        // Tính giờ làm việc thực tế
        double workHours = totalMinutes / 60.0;
        attendance.setWorkHours(Math.max(0, workHours));

        // ✅ THÊM: Tính overtime cho ngày nghỉ
        if (!isWorkingDay) {
            // Toàn bộ thời gian làm việc trên ngày nghỉ được tính là overtime
            attendance.setOvertimeMinutes((int) totalMinutes);
            attendance.setIsWeekendOrHoliday(true);
        } else {
            // Với ngày làm việc bình thường, overtime chỉ tính sau giờ kết thúc
            // (đã được tính trong calculateCheckOutStatus)
            attendance.setIsWeekendOrHoliday(false);
        }
    }

    /**
     * ✅ THÊM: Cập nhật trạng thái cuối cùng
     */
    private void updateFinalStatus(Attendance attendance, boolean isWorkingDay) {
        if (attendance.getCheckInTime() == null || attendance.getCheckOutTime() == null) {
            return;
        }

        // Nếu là ngày nghỉ -> luôn là OVERTIME
        if (!isWorkingDay) {
            attendance.setStatus(AttendanceStatus.OVERTIME);
            return;
        }

        boolean isLate = attendance.getLateMinutes() != null && attendance.getLateMinutes() > 0;
        boolean isEarlyLeave = attendance.getEarlyLeaveMinutes() != null && attendance.getEarlyLeaveMinutes() > 0;
        boolean hasOvertime = attendance.getOvertimeMinutes() != null && attendance.getOvertimeMinutes() > 0;

        if (isLate && isEarlyLeave) {
            attendance.setStatus(AttendanceStatus.LATE_AND_EARLY_LEAVE);
        } else if (isLate) {
            attendance.setStatus(AttendanceStatus.LATE);
        } else if (isEarlyLeave) {
            attendance.setStatus(AttendanceStatus.EARLY_LEAVE);
        } else if (hasOvertime) {
            attendance.setStatus(AttendanceStatus.OVERTIME);
        } else {
            attendance.setStatus(AttendanceStatus.ON_TIME);
        }
    }

    private LocalTime maxTime(LocalTime time1, LocalTime time2) {
        return time1.isAfter(time2) ? time1 : time2;
    }

    private LocalTime minTime(LocalTime time1, LocalTime time2) {
        return time1.isBefore(time2) ? time1 : time2;
    }

    // Các phương thức khác giữ nguyên...

    @Override
    @Transactional(readOnly = true)
    public AttendanceResponse getById(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new CustomException(Error.ATTENDANCE_NOT_FOUND));

        return attendanceMapper.toResponse(attendance);
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceResponse getTodayAttendance(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new CustomException(Error.EMPLOYEE_NOT_FOUND));

        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository
                .findByEmployeeAndAttendanceDate(employee, today)
                .orElse(null);

        return attendanceMapper.toResponse(attendance);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AttendanceResponse> getAll(AttendanceFilterRequest filter, Pageable pageable) {
        Specification<Attendance> spec = buildSpecification(filter);

        Page<Attendance> attendances = attendanceRepository.findAll(spec, pageable);

        return attendances.map(AttendanceMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getMonthlyAttendance(Long employeeId, int year, int month) {
        List<Attendance> attendances = attendanceRepository
                .findByEmployeeIdAndYearAndMonth(employeeId, year, month);

        return attendances.stream()
                .map(AttendanceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceStatistics getStatistics(Long employeeId, LocalDate startDate, LocalDate endDate) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new CustomException(Error.EMPLOYEE_NOT_FOUND));

        List<Attendance> attendances = attendanceRepository
                .findByEmployeeAndAttendanceDateBetween(employee, startDate, endDate);

        return calculateStatistics(employee, attendances);
    }

    @Override
    public AttendanceResponse approve(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new CustomException(Error.ATTENDANCE_NOT_FOUND));

        Account account = accountService.getAccountAuth();

        attendance.setIsApproved(true);
        attendance.setApprovedBy(account.getEmployees());
        attendance.setApprovedAt(LocalDateTime.now());

        attendance = attendanceRepository.save(attendance);

        return attendanceMapper.toResponse(attendance);
    }

    @Override
    public void delete(Long id) {
        if (!attendanceRepository.existsById(id)) {
            throw new CustomException(Error.ATTENDANCE_NOT_FOUND);
        }

        attendanceRepository.deleteById(id);
    }

    private Specification<Attendance> buildSpecification(AttendanceFilterRequest filter) {
        return (root, query, cb) -> {
            var predicates = new java.util.ArrayList<>();

            if (filter.getEmployeeId() != null) {
                predicates.add(cb.equal(root.get("employee").get("id"), filter.getEmployeeId()));
            }

            if (filter.getStartDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("attendanceDate"), filter.getStartDate()));
            }

            if (filter.getEndDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("attendanceDate"), filter.getEndDate()));
            }

            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }

            if (filter.getIsApproved() != null) {
                predicates.add(cb.equal(root.get("isApproved"), filter.getIsApproved()));
            }

            if (filter.getIsManualEntry() != null) {
                predicates.add(cb.equal(root.get("isManualEntry"), filter.getIsManualEntry()));
            }

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }

    private AttendanceStatistics calculateStatistics(Employee employee, List<Attendance> attendances) {
        int totalDays = attendances.size();
        int presentDays = (int) attendances.stream()
                .filter(a -> a.getCheckInTime() != null && a.getCheckOutTime() != null)
                .count();

        int absentDays = (int) attendances.stream()
                .filter(a -> a.getCheckInTime() == null && a.getCheckOutTime() == null)
                .count();

        int lateDays = (int) attendances.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.LATE ||
                        a.getStatus() == AttendanceStatus.LATE_AND_EARLY_LEAVE)
                .count();

        int totalLateMinutes = attendances.stream()
                .filter(a -> a.getLateMinutes() != null)
                .mapToInt(Attendance::getLateMinutes)
                .sum();

        int earlyLeaveDays = (int) attendances.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.EARLY_LEAVE ||
                        a.getStatus() == AttendanceStatus.LATE_AND_EARLY_LEAVE)
                .count();

        int totalEarlyLeaveMinutes = attendances.stream()
                .filter(a -> a.getEarlyLeaveMinutes() != null)
                .mapToInt(Attendance::getEarlyLeaveMinutes)
                .sum();

        int totalOvertimeMinutes = attendances.stream()
                .filter(a -> a.getOvertimeMinutes() != null)
                .mapToInt(Attendance::getOvertimeMinutes)
                .sum();

        double totalOvertimeHours = totalOvertimeMinutes / 60.0;

        double totalWorkHours = attendances.stream()
                .filter(a -> a.getWorkHours() != null)
                .mapToDouble(Attendance::getWorkHours)
                .sum();

        return AttendanceStatistics.builder()
                .employeeId(employee.getEmployeeId())
                .employeeName(employee.getFullName())
                .totalDays(totalDays)
                .presentDays(presentDays)
                .absentDays(absentDays)
                .lateDays(lateDays)
                .totalLateMinutes(totalLateMinutes)
                .earlyLeaveDays(earlyLeaveDays)
                .totalEarlyLeaveMinutes(totalEarlyLeaveMinutes)
                .totalOvertimeHours(totalOvertimeHours)
                .totalWorkHours(totalWorkHours)
                .build();
    }
}