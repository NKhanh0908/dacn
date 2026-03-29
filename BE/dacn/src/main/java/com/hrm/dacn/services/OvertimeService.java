package com.hrm.dacn.services;

import java.util.List;

import com.hrm.dacn.dtos.Attendance.request.OvertimeCreateRequest;
import com.hrm.dacn.dtos.Attendance.response.OvertimeResponse;

public interface OvertimeService {

    OvertimeResponse create(OvertimeCreateRequest request);

    OvertimeResponse approve(Long id);

    OvertimeResponse reject(Long id);

    List<OvertimeResponse> getAll();

    List<OvertimeResponse> getMyRequests();

}