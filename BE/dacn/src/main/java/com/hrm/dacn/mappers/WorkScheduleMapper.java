package com.hrm.dacn.mappers;

import org.springframework.stereotype.Component;

import com.hrm.dacn.dtos.WorkSchedule.response.WorkScheduleResponse;
import com.hrm.dacn.entities.WorkSchedule;

/**
 * Mapper: Chuyển đổi giữa Entity và DTO
 */
@Component
public class WorkScheduleMapper {

    /**
     * Chuyển từ Entity (WorkSchedule) sang DTO (WorkScheduleResponse)
     * Dùng khi trả dữ liệu về client
     */
    public WorkScheduleResponse toResponse(WorkSchedule schedule) {
        if (schedule == null) {
            return null;
        }

        return WorkScheduleResponse.builder()
                .id(schedule.getId())
                .scheduleName(schedule.getScheduleName())
                .startTime(schedule.getStartTime())
                .endTime(schedule.getEndTime())
                .breakStartTime(schedule.getBreakStartTime())
                .breakEndTime(schedule.getBreakEndTime())
                .lateToleranceMinutes(schedule.getLateToleranceMinutes())
                .earlyLeaveToleranceMinutes(schedule.getEarlyLeaveToleranceMinutes())
                .isDefault(schedule.getIsDefault())
                .isActive(schedule.getIsActive())
                .build();
    }
}