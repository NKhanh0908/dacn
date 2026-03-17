package com.hrm.dacn.mappers;

import java.util.List;
import java.util.stream.Collectors;

import com.hrm.dacn.dtos.PageDTO;
import com.hrm.dacn.dtos.Holiday.Request.LeaveRequestCreateRequest;
import com.hrm.dacn.dtos.Holiday.Response.LeaveRequestResponse;
import com.hrm.dacn.entities.LeaveRequest;
import com.hrm.dacn.enums.Holiday.LeaveStatus;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
public class LeaveRequestMapper {

    public static LeaveRequestResponse toResponse(LeaveRequest entity) {
        if (entity == null)
            return null;

        return LeaveRequestResponse.builder()
                .id(entity.getId())
                .employeeId(entity.getEmployee().getEmployeeId())
                .employeeName(entity.getEmployee().getFullName())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .leaveType(entity.getLeaveType())
                .duration(entity.getDuration())
                .totalDays(entity.getTotalDays())
                .reason(entity.getReason())
                .attachmentUrl(entity.getAttachmentUrl())
                .status(entity.getStatus())
                .approvedById(entity.getApprovedBy() != null
                        ? entity.getApprovedBy().getEmployeeId()
                        : null)
                .approvedByName(entity.getApprovedBy() != null
                        ? entity.getApprovedBy().getFullName()
                        : null)
                .approvedAt(entity.getApprovedAt())
                .rejectReason(entity.getRejectReason())
                .createdAt(entity.getCreatedAt())
                .attendanceGenerated(entity.getAttendanceGenerated())
                .build();
    }

    public static List<LeaveRequestResponse> toResponseList(List<LeaveRequest> entities) {
        if (entities == null)
            return List.of();
        return entities.stream()
                .map(LeaveRequestMapper::toResponse)
                .collect(Collectors.toList());
    }

    public static LeaveRequest toEntity(LeaveRequestCreateRequest request) {
        if (request == null)
            return null;

        return LeaveRequest.builder()
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .leaveType(request.getLeaveType())
                .duration(request.getDuration())
                .reason(request.getReason())
                .attachmentUrl(request.getAttachmentUrl())
                .status(LeaveStatus.PENDING)
                .attendanceGenerated(false)
                .build();
    }

    public static PageDTO<LeaveRequestResponse> toPageDTO(Page<LeaveRequest> page) {
        return PageDTO.<LeaveRequestResponse>builder()
                .content(page.getContent()
                        .stream()
                        .map(LeaveRequestMapper::toResponse)
                        .toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }
}