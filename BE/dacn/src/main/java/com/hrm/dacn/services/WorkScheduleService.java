package com.hrm.dacn.services;

import java.util.List;

import com.hrm.dacn.dtos.WorkSchedule.request.WorkScheduleRequest;
import com.hrm.dacn.dtos.WorkSchedule.response.WorkScheduleResponse;
import com.hrm.dacn.entities.WorkSchedule;

public interface WorkScheduleService {

    WorkScheduleResponse create(WorkScheduleRequest request);

    WorkScheduleResponse update(Long id, WorkScheduleRequest request);

    WorkScheduleResponse getById(Long id);

    List<WorkScheduleResponse> getAll();

    void delete(Long id);

    List<WorkScheduleResponse> getActiveSchedules(); // Lấy ca đang hoạt động

    WorkScheduleResponse getDefaultSchedule(); // Lấy ca mặc định

    WorkScheduleResponse setAsDefault(Long id); // Đặt ca làm mặc định

    void deactivate(Long id); // Vô hiệu hóa ca

    WorkScheduleResponse activate(Long id); // Kích hoạt lại ca
}