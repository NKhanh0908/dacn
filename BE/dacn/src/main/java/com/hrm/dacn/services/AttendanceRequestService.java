package com.hrm.dacn.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.hrm.dacn.dtos.Attendance.request.AttendanceRequestCreateRequest;
import com.hrm.dacn.dtos.Attendance.request.AttendanceRequestResponse;
import com.hrm.dacn.dtos.Attendance.request.AttendanceRequestReviewRequest;

import java.util.List;

/**
 * Service interface cho quản lý yêu cầu chấm công
 */
public interface AttendanceRequestService {

    /**
     * Nhân viên tạo yêu cầu chấm công
     */
    AttendanceRequestResponse createRequest(AttendanceRequestCreateRequest request);

    /**
     * HR duyệt/từ chối yêu cầu
     */
    AttendanceRequestResponse reviewRequest(Long id, AttendanceRequestReviewRequest request);

    /**
     * Lấy chi tiết yêu cầu
     */
    AttendanceRequestResponse getById(Long id);

    /**
     * Lấy danh sách yêu cầu của nhân viên hiện tại
     */
    List<AttendanceRequestResponse> getMyRequests();

    /**
     * Lấy danh sách yêu cầu chờ duyệt (HR)
     */
    Page<AttendanceRequestResponse> getPendingRequests(Pageable pageable);

    // Lấy tất cả yêu cầu (HR)

    Page<AttendanceRequestResponse> getAllRequests(Pageable pageable);

    // Hủy yêu cầu (chỉ khi còn PENDING)

    void cancelRequest(Long id);
}
