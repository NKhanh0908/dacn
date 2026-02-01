package com.hrm.dacn.services.impl;

import com.hrm.dacn.dtos.Attendance.response.MonthlySummaryResponse;
import com.hrm.dacn.entities.Account;
import com.hrm.dacn.entities.Attendance;
import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.entities.MonthlySummary;
import com.hrm.dacn.enums.Attendance.AttendanceStatus;
import com.hrm.dacn.exceptions.CustomException;
import com.hrm.dacn.exceptions.Error;
import com.hrm.dacn.mappers.MonthlySummaryMapper;
import com.hrm.dacn.repositories.AttendanceRepository;
import com.hrm.dacn.repositories.EmployeeRepository;
import com.hrm.dacn.repositories.MonthlySummaryRepository;
import com.hrm.dacn.services.AccountService;
import com.hrm.dacn.services.MonthlySummaryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MonthlySummaryServiceImpl implements MonthlySummaryService {

    private final MonthlySummaryRepository summaryRepository;
    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final AccountService accountService;

    // ===================== GENERATE ONE =====================
    @Override
    public MonthlySummaryResponse generateMonthlySummary(Long employeeId, int year, int month) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new CustomException(Error.EMPLOYEE_NOT_FOUND));

        List<Attendance> attendances = attendanceRepository.findByEmployeeIdAndYearAndMonth(employeeId, year, month);

        MonthlySummary summary = summaryRepository
                .findByEmployeeAndYearAndMonth(employee, year, month)
                .orElse(MonthlySummary.builder()
                        .employee(employee)
                        .year(year)
                        .month(month)
                        .isFinalized(false)
                        .build());

        calculateSummaryMetrics(summary, attendances, year, month);

        summaryRepository.save(summary);

        log.info("Monthly summary generated for employee {} - {}/{}",
                employee.getEmployeeId(), year, month);

        return MonthlySummaryMapper.toResponse(summary);
    }

    // ===================== GENERATE ALL =====================
    @Override
    public void generateAllMonthlySummaries(int year, int month) {

        List<Employee> employees = employeeRepository.findAll();

        for (Employee employee : employees) {
            generateMonthlySummary(employee.getEmployeeId(), year, month);
        }

        log.info("Generated monthly summaries for all employees - {}/{}", year, month);
    }

    // ===================== GET ONE =====================
    @Override
    @Transactional(readOnly = true)
    public MonthlySummaryResponse getMonthlySummary(Long employeeId, int year, int month) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new CustomException(Error.EMPLOYEE_NOT_FOUND));

        MonthlySummary summary = summaryRepository
                .findByEmployeeAndYearAndMonth(employee, year, month)
                .orElseThrow(() -> new CustomException(Error.MONTHLY_SUMMARY_NOT_FOUND));

        return MonthlySummaryMapper.toResponse(summary);
    }

    // ===================== HISTORY =====================
    @Override
    @Transactional(readOnly = true)
    public List<MonthlySummaryResponse> getEmployeeHistory(Long employeeId) {

        if (!employeeRepository.existsById(employeeId)) {
            throw new CustomException(Error.EMPLOYEE_NOT_FOUND);
        }

        return summaryRepository.findEmployeeHistory(employeeId)
                .stream()
                .map(MonthlySummaryMapper::toResponse)
                .collect(Collectors.toList());
    }

    // ===================== BY MONTH =====================
    @Override
    @Transactional(readOnly = true)
    public Page<MonthlySummaryResponse> getSummariesByMonth(
            int year, int month, Pageable pageable) {

        List<MonthlySummary> summaries = summaryRepository.findByYearAndMonth(year, month);

        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), summaries.size());

        List<MonthlySummaryResponse> data = summaries.subList(start, end)
                .stream()
                .map(MonthlySummaryMapper::toResponse)
                .toList();

        return new PageImpl<>(data, pageable, summaries.size());
    }

    // ===================== FINALIZE =====================
    @Override
    public MonthlySummaryResponse finalizeSummary(Long summaryId) {

        MonthlySummary summary = summaryRepository.findById(summaryId)
                .orElseThrow(() -> new CustomException(Error.MONTHLY_SUMMARY_NOT_FOUND));

        if (Boolean.TRUE.equals(summary.getIsFinalized())) {
            throw new CustomException(Error.MONTHLY_SUMMARY_ALREADY_FINALIZED);
        }

        List<Attendance> unapprovedAttendances = attendanceRepository.findByEmployeeIdAndYearAndMonth(
                summary.getEmployee().getEmployeeId(),
                summary.getYear(),
                summary.getMonth())
                .stream()
                .filter(a -> !Boolean.TRUE.equals(a.getIsApproved()))
                .toList();

        if (!unapprovedAttendances.isEmpty()) {
            throw new CustomException(Error.MONTHLY_SUMMARY_UNAPPROVED_ATTENDANCE);
        }

        Account account = accountService.getAccountAuth();

        summary.setIsFinalized(true);
        summary.setFinalizedBy(account.getEmployees());
        summary.setFinalizedAt(LocalDateTime.now());

        summaryRepository.save(summary);

        log.info("Summary {} finalized by {}",
                summaryId, account.getEmployees().getEmployeeId());

        return MonthlySummaryMapper.toResponse(summary);
    }

    // ===================== UNFINALIZE =====================
    @Override
    public MonthlySummaryResponse unfinalizeSummary(Long summaryId) {

        MonthlySummary summary = summaryRepository.findById(summaryId)
                .orElseThrow(() -> new CustomException(Error.MONTHLY_SUMMARY_NOT_FOUND));

        if (!Boolean.TRUE.equals(summary.getIsFinalized())) {
            throw new CustomException(Error.MONTHLY_SUMMARY_NOT_FINALIZED);
        }

        summary.setIsFinalized(false);
        summary.setFinalizedBy(null);
        summary.setFinalizedAt(null);

        summaryRepository.save(summary);

        log.info("Summary {} unfinalized", summaryId);

        return MonthlySummaryMapper.toResponse(summary);
    }

    // ===================== METRICS =====================
    private void calculateSummaryMetrics(
            MonthlySummary summary,
            List<Attendance> attendances,
            int year,
            int month) {

        summary.setTotalWorkingDays(calculateWorkingDaysInMonth(year, month));

        summary.setTotalPresentDays((int) attendances.stream()
                .filter(a -> a.getStatus() != AttendanceStatus.ABSENT)
                .count());

        summary.setTotalAbsentDays((int) attendances.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.ABSENT)
                .count());

        summary.setTotalLateDays((int) attendances.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.LATE)
                .count());

        summary.setTotalLateMinutes(attendances.stream()
                .map(Attendance::getLateMinutes)
                .filter(m -> m != null)
                .mapToInt(Integer::intValue)
                .sum());

        summary.setTotalEarlyLeaveDays((int) attendances.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.EARLY_LEAVE)
                .count());

        summary.setTotalEarlyLeaveMinutes(attendances.stream()
                .map(Attendance::getEarlyLeaveMinutes)
                .filter(m -> m != null)
                .mapToInt(Integer::intValue)
                .sum());

        int totalOtMinutes = attendances.stream()
                .map(Attendance::getOvertimeMinutes)
                .filter(m -> m != null)
                .mapToInt(Integer::intValue)
                .sum();
        summary.setTotalOvertimeHours(totalOtMinutes / 60.0);

        summary.setTotalLeaveDays((int) attendances.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.LEAVE)
                .count());

        summary.setTotalBusinessTripDays((int) attendances.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.BUSINESS_TRIP)
                .count());

        summary.setTotalWorkHours(attendances.stream()
                .map(Attendance::getWorkHours)
                .filter(h -> h != null)
                .mapToDouble(Double::doubleValue)
                .sum());
    }

    private int calculateWorkingDaysInMonth(int year, int month) {

        YearMonth ym = YearMonth.of(year, month);
        int workingDays = 0;

        for (int day = 1; day <= ym.lengthOfMonth(); day++) {
            LocalDate date = LocalDate.of(year, month, day);
            if (date.getDayOfWeek().getValue() < 6) {
                workingDays++;
            }
        }
        return workingDays;
    }
}
