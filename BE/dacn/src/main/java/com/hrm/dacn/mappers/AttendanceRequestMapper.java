package com.hrm.dacn.mappers;

import java.util.List;
import java.util.stream.Collectors;

import com.hrm.dacn.dtos.Attendance.request.AttendanceRequestResponse;
import org.springframework.stereotype.Component;

@Component
public class AttendanceRequestMapper {

    private AttendanceRequestMapper() {
        // Utility class
    }

    // =========================
    // RESPONSE
    // =========================
    public static AttendanceRequestResponse toResponse(com.hrm.dacn.entities.AttendanceRequest request) {
        if (request == null) {
            return null;
        }

        return AttendanceRequestResponse.builder()
                .id(request.getId())
                .employeeId(request.getEmployee().getEmployeeId())
                .employeeName(request.getEmployee().getFullName())
                .requestDate(request.getRequestDate())
                .checkInTime(request.getCheckInTime())
                .checkOutTime(request.getCheckOutTime())
                .requestType(request.getRequestType())
                .reason(request.getReason())
                .status(request.getStatus())
                .reviewedByName(
                        request.getReviewedBy() != null
                                ? request.getReviewedBy().getFullName()
                                : null)
                .reviewedAt(request.getReviewedAt())
                .reviewNote(request.getReviewNote())
                .createdAt(request.getCreatedAt())
                .build();
    }

    // =========================
    // LIST RESPONSE
    // =========================
    public static List<AttendanceRequestResponse> toResponseList(List<com.hrm.dacn.entities.AttendanceRequest> requests) {
        if (requests == null) {
            return List.of();
        }

        return requests.stream()
                .map(AttendanceRequestMapper::toResponse)
                .collect(Collectors.toList());
    }
}