package com.hrm.dacn.mappers;

import java.util.List;
import java.util.stream.Collectors;

import com.hrm.dacn.dtos.Attendance.response.AttendanceResponse;
import com.hrm.dacn.entities.Attendance;
import org.springframework.stereotype.Component;

@Component
public class AttendanceMapper {

    private AttendanceMapper() {
        // Utility class
    }

    // =========================
    // RESPONSE
    // =========================
    public static AttendanceResponse toResponse(Attendance attendance) {
        if (attendance == null) {
            return null;
        }

        return AttendanceResponse.builder()
                .id(attendance.getId())
                .employeeId(attendance.getEmployee().getEmployeeId())
                .employeeName(attendance.getEmployee().getFullName())
                .attendanceDate(attendance.getAttendanceDate())
                .checkInTime(attendance.getCheckInTime())
                .checkOutTime(attendance.getCheckOutTime())
                .checkInMethod(attendance.getCheckInMethod())
                .checkOutMethod(attendance.getCheckOutMethod())
                .status(attendance.getStatus())
                .lateMinutes(attendance.getLateMinutes())
                .earlyLeaveMinutes(attendance.getEarlyLeaveMinutes())
                .overtimeMinutes(attendance.getOvertimeMinutes())
                .workHours(attendance.getWorkHours())
                .isApproved(attendance.getIsApproved())
                .approvedByName(
                        attendance.getApprovedBy() != null
                                ? attendance.getApprovedBy().getFullName()
                                : null)
                .approvedAt(attendance.getApprovedAt())
                .note(attendance.getNote())
                .isManualEntry(attendance.getIsManualEntry())
                .createdAt(attendance.getCreatedAt())
                .build();
    }

    // =========================
    // LIST RESPONSE
    // =========================
    public static List<AttendanceResponse> toResponseList(List<Attendance> attendances) {
        if (attendances == null) {
            return List.of();
        }

        return attendances.stream()
                .map(AttendanceMapper::toResponse)
                .collect(Collectors.toList());
    }
}
