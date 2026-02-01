package com.hrm.dacn.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hrm.dacn.dtos.WorkSchedule.request.WorkScheduleRequest;
import com.hrm.dacn.dtos.WorkSchedule.response.WorkScheduleResponse;
import com.hrm.dacn.entities.WorkSchedule;
import com.hrm.dacn.exceptions.CustomException;
import com.hrm.dacn.mappers.WorkScheduleMapper;
import com.hrm.dacn.repositories.WorkScheduleRepository;
import com.hrm.dacn.services.WorkScheduleService;
import com.hrm.dacn.exceptions.Error;

import lombok.*;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class WorkScheduleServiceImpl implements WorkScheduleService {

    private final WorkScheduleRepository scheduleRepository;
    private final WorkScheduleMapper scheduleMapper;

    /**
     * Tạo ca làm việc mới
     */
    @Override
    public WorkScheduleResponse create(WorkScheduleRequest request) {
        // Validate thời gian
        validateScheduleTimes(request);

        // Nếu đặt làm mặc định, bỏ mặc định của các ca khác
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            clearDefaultSchedules();
        }

        // Tạo ca làm việc mới
        WorkSchedule schedule = WorkSchedule.builder()
                .scheduleName(request.getScheduleName())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .breakStartTime(request.getBreakStartTime())
                .breakEndTime(request.getBreakEndTime())
                .lateToleranceMinutes(request.getLateToleranceMinutes())
                .earlyLeaveToleranceMinutes(request.getEarlyLeaveToleranceMinutes())
                .isDefault(request.getIsDefault())
                .isActive(request.getIsActive())
                .build();

        schedule = scheduleRepository.save(schedule);

        log.info("Work schedule created: {}", schedule.getScheduleName());

        return scheduleMapper.toResponse(schedule);
    }

    /**
     * Cập nhật ca làm việc
     */
    @Override
    public WorkScheduleResponse update(Long id, WorkScheduleRequest request) {
        WorkSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new CustomException(
                        Error.WORK_SCHEDULE_NOT_FOUND));

        validateScheduleTimes(request);

        // Nếu đặt làm mặc định, bỏ mặc định của các ca khác
        if (Boolean.TRUE.equals(request.getIsDefault()) && !schedule.getIsDefault()) {
            clearDefaultSchedules();
        }

        // Cập nhật thông tin
        schedule.setScheduleName(request.getScheduleName());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setBreakStartTime(request.getBreakStartTime());
        schedule.setBreakEndTime(request.getBreakEndTime());
        schedule.setLateToleranceMinutes(request.getLateToleranceMinutes());
        schedule.setEarlyLeaveToleranceMinutes(request.getEarlyLeaveToleranceMinutes());
        schedule.setIsDefault(request.getIsDefault());
        schedule.setIsActive(request.getIsActive());

        schedule = scheduleRepository.save(schedule);

        log.info("Work schedule updated: {}", schedule.getScheduleName());

        return scheduleMapper.toResponse(schedule);
    }

    /**
     * Lấy ca mặc định
     * → QUAN TRỌNG: Được gọi trong AttendanceServiceImpl
     */
    @Override
    @Transactional(readOnly = true)
    public WorkScheduleResponse getDefaultSchedule() {
        WorkSchedule schedule = scheduleRepository.findByIsDefaultTrue()
                .orElseThrow(() -> new CustomException(Error.WORK_SCHEDULE_NOT_FOUND));

        return scheduleMapper.toResponse(schedule);
    }

    /**
     * Đặt ca làm mặc định
     */
    @Override
    public WorkScheduleResponse setAsDefault(Long id) {
        WorkSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new CustomException(Error.WORK_SCHEDULE_NOT_FOUND));

        if (!schedule.getIsActive()) {
            throw new CustomException(Error.WORK_SCHEDULE_INACTIVE);
        }

        // Bỏ mặc định của các ca khác
        clearDefaultSchedules();

        // Đặt ca này làm mặc định
        schedule.setIsDefault(true);
        schedule = scheduleRepository.save(schedule);

        log.info("Work schedule set as default: {}", schedule.getScheduleName());

        return scheduleMapper.toResponse(schedule);
    }

    // ... other methods ...

    /**
     * Validate thời gian của ca làm việc
     */
    private void validateScheduleTimes(WorkScheduleRequest request) {
        // Kiểm tra end time phải sau start time
        if (request.getEndTime().isBefore(request.getStartTime()) ||
                request.getEndTime().equals(request.getStartTime())) {
            throw new CustomException(Error.WORK_SCHEDULE_TIME_INVALID);
        }

        // Kiểm tra break time (nếu có)
        if (request.getBreakStartTime() != null && request.getBreakEndTime() != null) {
            if (request.getBreakStartTime().isBefore(request.getStartTime())) {
                throw new CustomException(Error.WORK_SCHEDULE_BREAK_TIME_INVALID);
            }

            if (request.getBreakEndTime().isAfter(request.getEndTime())) {
                throw new CustomException(Error.WORK_SCHEDULE_BREAK_TIME_INVALID);
            }

            if (request.getBreakEndTime().isBefore(request.getBreakStartTime()) ||
                    request.getBreakEndTime().equals(request.getBreakStartTime())) {
                throw new CustomException(Error.WORK_SCHEDULE_BREAK_TIME_INVALID);
            }
        }
    }

    /**
     * Bỏ mặc định của tất cả các ca
     * → Đảm bảo chỉ có 1 ca mặc định tại một thời điểm
     */
    private void clearDefaultSchedules() {
        scheduleRepository.findByIsDefaultTrue().ifPresent(schedule -> {
            schedule.setIsDefault(false);
            scheduleRepository.save(schedule);
            log.info("Removed default flag from: {}", schedule.getScheduleName());
        });
    }

    @Override

    @Transactional(readOnly = true)
    public WorkScheduleResponse getById(Long id) {
        WorkSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new CustomException(Error.WORK_SCHEDULE_NOT_FOUND));

        return scheduleMapper.toResponse(schedule);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkScheduleResponse> getAll() {
        return scheduleRepository.findAll()
                .stream()
                .map(scheduleMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Long id) {
        WorkSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new CustomException(Error.WORK_SCHEDULE_NOT_FOUND));

        if (Boolean.TRUE.equals(schedule.getIsDefault())) {
            throw new CustomException(Error.WORK_SCHEDULE_ALREADY_DEFAULT);
        }

        scheduleRepository.delete(schedule);
        log.info("Work schedule deleted: {}", schedule.getScheduleName());
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkScheduleResponse> getActiveSchedules() {
        return scheduleRepository.findByIsActiveTrue()
                .stream()
                .map(scheduleMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deactivate(Long id) {
        WorkSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new CustomException(Error.WORK_SCHEDULE_NOT_FOUND));

        if (Boolean.TRUE.equals(schedule.getIsDefault())) {
            throw new CustomException(Error.WORK_SCHEDULE_ALREADY_DEFAULT);
        }

        schedule.setIsActive(false);
        scheduleRepository.save(schedule);

        log.info("Work schedule deactivated: {}", schedule.getScheduleName());
    }

    @Override
    public WorkScheduleResponse activate(Long id) {
        WorkSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new CustomException(Error.WORK_SCHEDULE_NOT_FOUND));

        schedule.setIsActive(true);
        schedule = scheduleRepository.save(schedule);

        log.info("Work schedule activated: {}", schedule.getScheduleName());

        return scheduleMapper.toResponse(schedule);
    }

}