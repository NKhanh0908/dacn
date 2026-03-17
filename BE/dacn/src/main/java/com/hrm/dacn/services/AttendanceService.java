package com.hrm.dacn.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hrm.dacn.dtos.Attendance.request.AttendanceCreateRequest;
import com.hrm.dacn.dtos.Attendance.request.AttendanceFilterRequest;
import com.hrm.dacn.dtos.Attendance.request.AttendanceUpdateRequest;
import com.hrm.dacn.dtos.Attendance.request.CheckInRequest;
import com.hrm.dacn.dtos.Attendance.request.CheckOutRequest;
import com.hrm.dacn.dtos.Attendance.response.AttendanceResponse;
import com.hrm.dacn.dtos.Attendance.response.AttendanceStatistics;
import com.hrm.dacn.entities.Employee;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public interface AttendanceService {

    /**
     * Nhân viên check-in
     */
    AttendanceResponse checkIn(CheckInRequest request);

    /**
     * Nhân viên check-out
     */
    AttendanceResponse checkOut(CheckOutRequest request);

    /**
     * HR tạo chấm công thủ công
     */
    AttendanceResponse createManual(AttendanceCreateRequest request);

    /**
     * HR cập nhật chấm công
     */
    AttendanceResponse update(Long id, AttendanceUpdateRequest request);

    /**
     * Lấy chi tiết chấm công
     */
    AttendanceResponse getById(Long id);

    /**
     * Lấy chấm công của nhân viên trong ngày
     */
    AttendanceResponse getTodayAttendance(Long employeeId);

    /**
     * Lấy danh sách chấm công theo filter
     */
    Page<AttendanceResponse> getAll(AttendanceFilterRequest filter, Pageable pageable);

    /**
     * Lấy danh sách chấm công của nhân viên theo tháng
     */
    List<AttendanceResponse> getMonthlyAttendance(Long employeeId, int year, int month);

    /**
     * Lấy thống kê chấm công của nhân viên
     */
    AttendanceStatistics getStatistics(Long employeeId, LocalDate startDate, LocalDate endDate);

    /**
     * HR duyệt chấm công
     */
    AttendanceResponse approve(Long id);

    /**
     * Xóa chấm công
     */
    void delete(Long id);

    void markLeave(Long employeeId, LocalDate date, Employee approvedBy);

}
