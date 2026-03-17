package com.hrm.dacn.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.hrm.dacn.dtos.PageDTO;
import com.hrm.dacn.dtos.Holiday.Request.LeaveRequestCreateRequest;
import com.hrm.dacn.dtos.Holiday.Request.LeaveRequestFilter;
import com.hrm.dacn.dtos.Holiday.Request.LeaveRequestReviewRequest;
import com.hrm.dacn.dtos.Holiday.Response.LeaveRequestResponse;

public interface LeaveRequestService {
    LeaveRequestResponse createRequest(LeaveRequestCreateRequest request);

    LeaveRequestResponse reviewRequest(Long id, LeaveRequestReviewRequest request);

    LeaveRequestResponse getById(Long id);

    List<LeaveRequestResponse> getMyRequests();

    PageDTO<LeaveRequestResponse> filter(LeaveRequestFilter filter, int page, int size);

    void cancelRequest(Long id);
}