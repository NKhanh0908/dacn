package com.hrm.dacn.mappers;

import java.util.List;
import java.util.stream.Collectors;

import com.hrm.dacn.dtos.Attendance.response.MonthlySummaryResponse;
import com.hrm.dacn.entities.MonthlySummary;
import org.springframework.stereotype.Component;

@Component
public class MonthlySummaryMapper {

    private MonthlySummaryMapper() {
        // Utility class
    }

    // =========================
    // RESPONSE
    // =========================
    public static MonthlySummaryResponse toResponse(MonthlySummary summary) {
        if (summary == null) {
            return null;
        }

        return MonthlySummaryResponse.builder()
                .id(summary.getId())
                .employeeId(summary.getEmployee().getEmployeeId())
                .employeeName(summary.getEmployee().getFullName())
                .year(summary.getYear())
                .month(summary.getMonth())
                .totalWorkingDays(summary.getTotalWorkingDays())
                .totalPresentDays(summary.getTotalPresentDays())
                .totalAbsentDays(summary.getTotalAbsentDays())
                .totalLateDays(summary.getTotalLateDays())
                .totalLateMinutes(summary.getTotalLateMinutes())
                .totalEarlyLeaveDays(summary.getTotalEarlyLeaveDays())
                .totalEarlyLeaveMinutes(summary.getTotalEarlyLeaveMinutes())
                .totalOvertimeHours(summary.getTotalOvertimeHours())
                .totalLeaveDays(summary.getTotalLeaveDays())
                .totalBusinessTripDays(summary.getTotalBusinessTripDays())
                .totalWorkHours(summary.getTotalWorkHours())
                .isFinalized(summary.getIsFinalized())
                .finalizedByName(
                        summary.getFinalizedBy() != null
                                ? summary.getFinalizedBy().getFullName()
                                : null)
                .finalizedAt(summary.getFinalizedAt())
                .createdAt(summary.getCreatedAt())
                .build();
    }

    // =========================
    // LIST RESPONSE
    // =========================
    public static List<MonthlySummaryResponse> toResponseList(List<MonthlySummary> summaries) {
        if (summaries == null) {
            return List.of();
        }

        return summaries.stream()
                .map(MonthlySummaryMapper::toResponse)
                .collect(Collectors.toList());
    }
}