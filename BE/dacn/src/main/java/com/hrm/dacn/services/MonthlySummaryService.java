package com.hrm.dacn.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.hrm.dacn.dtos.Attendance.response.MonthlySummaryResponse;

import java.util.List;

/**
 * Service interface cho tổng kết chấm công tháng
 */
public interface MonthlySummaryService {

    /**
     * Tạo/cập nhật tổng kết tháng cho nhân viên
     */
    MonthlySummaryResponse generateMonthlySummary(Long employeeId, int year, int month);

    /**
     * Tạo tổng kết tháng cho tất cả nhân viên
     */
    void generateAllMonthlySummaries(int year, int month);

    /**
     * Lấy tổng kết tháng của nhân viên
     */
    MonthlySummaryResponse getMonthlySummary(Long employeeId, int year, int month);

    /**
     * Lấy lịch sử tổng kết của nhân viên
     */
    List<MonthlySummaryResponse> getEmployeeHistory(Long employeeId);

    /**
     * Lấy danh sách tổng kết theo tháng (HR)
     */
    Page<MonthlySummaryResponse> getSummariesByMonth(int year, int month, Pageable pageable);

    /**
     * Chốt bảng công (finalize)
     */
    MonthlySummaryResponse finalizeSummary(Long summaryId);

    /**
     * Mở lại bảng công đã chốt
     */
    MonthlySummaryResponse unfinalizeSummary(Long summaryId);
}