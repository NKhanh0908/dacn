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
import com.hrm.dacn.exceptions.Error;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
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
    private final AttendanceMapper attendanceMapper;

    @Override
    public AttendanceResponse checkIn(CheckInRequest request) {
        // Lấy thông tin nhân viên hiện tại
        Account account = accountService.getAccountAuth();
        Employee employee = account.getEmployees();

        if (employee == null) {
            throw new CustomException(Error.EMPLOYEE_NOT_FOUND);
        }

        // Kiểm tra hợp đồng còn hiệu lực
        // validateEmployeeContract(employee);

        LocalDate today = LocalDate.now();

        // Kiểm tra đã check-in hôm nay chưa
        boolean alreadyCheckedIn = attendanceRepository
                .existsByEmployeeAndAttendanceDateAndCheckInTimeIsNotNull(employee, today);

        if (alreadyCheckedIn) {
            throw new CustomException(List.of(Error.CONFLICT), "You have already checked in today");

        }

        LocalDateTime checkInTime = LocalDateTime.now();

        // Lấy ca làm việc
        WorkSchedule schedule = getEmployeeWorkSchedule(employee);

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
                .build();

        // Tính toán trạng thái check-in
        calculateCheckInStatus(attendance, schedule);

        attendance = attendanceRepository.save(attendance);

        log.info("Employee {} checked in at {}", employee.getFullName(), checkInTime);

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
        attendance.setCheckOutTime(checkOutTime);
        attendance.setCheckOutMethod(request.getMethod() != null ? request.getMethod() : CheckMethod.BUTTON);

        if (request.getNote() != null && !request.getNote().isEmpty()) {
            attendance.setNote(attendance.getNote() != null ? attendance.getNote() + " | " + request.getNote()
                    : request.getNote());
        }

        // Lấy ca làm việc
        WorkSchedule schedule = getEmployeeWorkSchedule(employee);

        // Tính toán trạng thái check-out
        calculateCheckOutStatus(attendance, schedule);

        // Tính tổng giờ làm việc
        calculateWorkHours(attendance, schedule);

        attendance = attendanceRepository.save(attendance);

        log.info("Employee {} checked out at {}", employee.getFullName(), checkOutTime);

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

        // Kiểm tra đã tồn tại chấm công cho ngày này chưa
        attendanceRepository.findByEmployeeAndAttendanceDate(employee, request.getAttendanceDate())
                .ifPresent(a -> {
                    throw new CustomException(
                            List.of(Error.CONFLICT),
                            "Attendance already exists for this date");
                });

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
                .build();

        // Lấy ca làm việc
        WorkSchedule schedule = getEmployeeWorkSchedule(employee);

        // Tính toán trạng thái
        if (attendance.getCheckInTime() != null) {
            calculateCheckInStatus(attendance, schedule);
        }

        if (attendance.getCheckOutTime() != null) {
            calculateCheckOutStatus(attendance, schedule);
            calculateWorkHours(attendance, schedule);
        }

        attendance = attendanceRepository.save(attendance);

        log.info("Manual attendance created for employee {} by {}",
                employee.getFullName(), createdBy.getFullName());

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
            WorkSchedule schedule = getEmployeeWorkSchedule(attendance.getEmployee());

            if (request.getCheckInTime() != null) {
                calculateCheckInStatus(attendance, schedule);
            }

            if (attendance.getCheckOutTime() != null) {
                calculateCheckOutStatus(attendance, schedule);
                calculateWorkHours(attendance, schedule);
            }
        }

        attendance = attendanceRepository.save(attendance);

        return attendanceMapper.toResponse(attendance);
    }

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

    // ============= Private Helper Methods =============

    private void validateEmployeeContract(Employee employee) {
        // Kiểm tra nhân viên có hợp đồng hiệu lực không
        // Logic này phụ thuộc vào cách quản lý hợp đồng của bạn
        // Có thể check qua ContractService
    }

    private WorkSchedule getEmployeeWorkSchedule(Employee employee) {
        // Lấy ca làm việc của nhân viên
        // Nếu nhân viên có ca riêng thì lấy ca riêng
        // Không thì lấy ca mặc định
        return workScheduleRepository.findByIsDefaultTrue()
                .orElseThrow(() -> new CustomException(Error.WORK_SCHEDULE_NOT_FOUND));
    }

    private void calculateCheckInStatus(Attendance attendance, WorkSchedule schedule) {
        LocalTime checkInTime = attendance.getCheckInTime().toLocalTime();
        LocalTime scheduledStartTime = schedule.getStartTime();

        int lateMinutes = (int) Duration.between(scheduledStartTime, checkInTime).toMinutes();

        if (lateMinutes <= schedule.getLateToleranceMinutes()) {
            // Đúng giờ (trong khoảng cho phép)
            attendance.setStatus(AttendanceStatus.ON_TIME);
            attendance.setLateMinutes(0);
        } else if (lateMinutes > schedule.getLateToleranceMinutes()) {
            // Trễ
            attendance.setStatus(AttendanceStatus.LATE);
            attendance.setLateMinutes(lateMinutes - schedule.getLateToleranceMinutes());
        } else {
            // Check-in sớm
            attendance.setStatus(AttendanceStatus.ON_TIME);
            attendance.setLateMinutes(0);
        }
    }

    private void calculateCheckOutStatus(Attendance attendance, WorkSchedule schedule) {
        LocalTime checkOutTime = attendance.getCheckOutTime().toLocalTime();
        LocalTime scheduledEndTime = schedule.getEndTime();

        int earlyMinutes = (int) Duration.between(checkOutTime, scheduledEndTime).toMinutes();
        int overtimeMinutes = (int) Duration.between(scheduledEndTime, checkOutTime).toMinutes();

        if (earlyMinutes > schedule.getEarlyLeaveToleranceMinutes()) {
            // Về sớm
            if (attendance.getStatus() == AttendanceStatus.LATE) {
                // Vừa trễ vừa về sớm - giữ trạng thái LATE
            } else {
                attendance.setStatus(AttendanceStatus.EARLY_LEAVE);
            }
            attendance.setEarlyLeaveMinutes(earlyMinutes - schedule.getEarlyLeaveToleranceMinutes());
        } else if (overtimeMinutes > 0) {
            // Làm thêm giờ
            attendance.setOvertimeMinutes(overtimeMinutes);
            if (attendance.getStatus() != AttendanceStatus.LATE &&
                    attendance.getStatus() != AttendanceStatus.EARLY_LEAVE) {
                attendance.setStatus(AttendanceStatus.OVERTIME);
            }
        } else {
            // Về đúng giờ
            if (attendance.getStatus() == AttendanceStatus.PENDING) {
                attendance.setStatus(AttendanceStatus.ON_TIME);
            }
        }
    }

    private void calculateWorkHours(Attendance attendance, WorkSchedule schedule) {
        if (attendance.getCheckInTime() == null || attendance.getCheckOutTime() == null) {
            attendance.setWorkHours(0.0);
            return;
        }

        long totalMinutes = Duration.between(
                attendance.getCheckInTime(),
                attendance.getCheckOutTime()).toMinutes();

        // Trừ thời gian nghỉ trưa nếu có
        if (schedule.getBreakStartTime() != null && schedule.getBreakEndTime() != null) {
            long breakMinutes = Duration.between(
                    schedule.getBreakStartTime(),
                    schedule.getBreakEndTime()).toMinutes();
            totalMinutes -= breakMinutes;
        }

        double workHours = totalMinutes / 60.0;
        attendance.setWorkHours(Math.max(0, workHours));
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
                .filter(a -> a.getStatus() == AttendanceStatus.PRESENT ||
                        a.getStatus() == AttendanceStatus.ON_TIME ||
                        a.getStatus() == AttendanceStatus.LATE ||
                        a.getStatus() == AttendanceStatus.EARLY_LEAVE ||
                        a.getStatus() == AttendanceStatus.OVERTIME)
                .count();

        int absentDays = (int) attendances.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.ABSENT)
                .count();

        int lateDays = (int) attendances.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.LATE)
                .count();

        int totalLateMinutes = attendances.stream()
                .filter(a -> a.getLateMinutes() != null)
                .mapToInt(Attendance::getLateMinutes)
                .sum();

        int earlyLeaveDays = (int) attendances.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.EARLY_LEAVE)
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