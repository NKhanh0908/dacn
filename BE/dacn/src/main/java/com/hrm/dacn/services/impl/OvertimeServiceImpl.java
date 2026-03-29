package com.hrm.dacn.services.impl;

import com.hrm.dacn.dtos.Attendance.request.OvertimeCreateRequest;
import com.hrm.dacn.dtos.Attendance.response.OvertimeResponse;
import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.entities.OvertimeRequest;
import com.hrm.dacn.enums.Attendance.OvertimeStatus;
import com.hrm.dacn.repositories.OvertimeRequestRepository;
import com.hrm.dacn.services.EmployeeService;
import com.hrm.dacn.services.OvertimeService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OvertimeServiceImpl implements OvertimeService {

    private final OvertimeRequestRepository overtimeRepo;
    private final EmployeeService employeeService;

    /**
     * Nhân viên tự đăng ký OT.
     * Phải đăng ký và được duyệt TRƯỚC khi checkout thì mới được tính OT.
     */
    @Override
    public OvertimeResponse create(OvertimeCreateRequest request) {
        Employee employee = employeeService.getCurrentEntity();

        if (request.getEndTime().isBefore(request.getStartTime())) {
            throw new RuntimeException("End time must be after start time");
        }

        // Không cho đăng ký trùng ngày đã có request (trừ bị reject)
        boolean exists = overtimeRepo.existsByEmployeeAndOvertimeDateAndStatusNot(
                employee, request.getOvertimeDate(), OvertimeStatus.REJECTED);
        if (exists) {
            throw new RuntimeException("Overtime request already exists for this date");
        }

        OvertimeRequest entity = OvertimeRequest.builder()
                .employee(employee)
                .overtimeDate(request.getOvertimeDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .reason(request.getReason())
                .status(OvertimeStatus.PENDING)
                .build();

        return mapToResponse(overtimeRepo.save(entity));
    }

    /**
     * HR/Manager duyệt OT request.
     * Sau khi duyệt, nhân viên checkout thì hệ thống mới tính OT.
     */
    @Override
    public OvertimeResponse approve(Long id) {
        OvertimeRequest entity = overtimeRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Overtime request not found"));

        if (entity.getStatus() != OvertimeStatus.PENDING) {
            throw new RuntimeException("Only pending requests can be approved");
        }

        entity.setStatus(OvertimeStatus.APPROVED);
        entity.setApprovedAt(LocalDateTime.now());
        entity.setApprovedBy(employeeService.getCurrentEntity());

        return mapToResponse(entity);
    }

    /**
     * HR/Manager từ chối OT request.
     */
    @Override
    public OvertimeResponse reject(Long id) {
        OvertimeRequest entity = overtimeRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Overtime request not found"));

        if (entity.getStatus() != OvertimeStatus.PENDING) {
            throw new RuntimeException("Only pending requests can be rejected");
        }

        entity.setStatus(OvertimeStatus.REJECTED);

        return mapToResponse(entity);
    }

    /**
     * Tính số phút OT thực tế.
     * Dùng chung với AttendanceServiceImpl khi checkout.
     *
     * @param checkOut      Giờ checkout thực tế
     * @param approvedStart Giờ bắt đầu OT được duyệt
     * @param approvedEnd   Giờ kết thúc OT được duyệt
     * @param scheduleEnd   Giờ kết thúc ca (OT không tính trước giờ này)
     */
    public static int calculateOTMinutes(
            LocalTime checkOut,
            LocalTime approvedStart,
            LocalTime approvedEnd,
            LocalTime scheduleEnd) {

        // OT chỉ tính từ sau giờ kết thúc ca
        LocalTime otStart = approvedStart.isBefore(scheduleEnd) ? scheduleEnd : approvedStart;

        // Về trước hoặc đúng giờ OT bắt đầu → không có OT
        if (!checkOut.isAfter(otStart))
            return 0;

        // OT đến min(checkOut, approvedEnd)
        LocalTime otEnd = checkOut.isBefore(approvedEnd) ? checkOut : approvedEnd;

        long minutes = Duration.between(otStart, otEnd).toMinutes();

        // Tối thiểu 30 phút mới tính
        return minutes >= 30 ? (int) minutes : 0;
    }

    private OvertimeResponse mapToResponse(OvertimeRequest entity) {
        return OvertimeResponse.builder()
                .id(entity.getId())
                .employeeId(entity.getEmployee().getEmployeeId())
                .employeeName(entity.getEmployee().getFullName())
                .overtimeDate(entity.getOvertimeDate())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .reason(entity.getReason())
                .status(entity.getStatus())
                .approvedAt(entity.getApprovedAt())
                .approvedBy(entity.getApprovedBy() != null
                        ? entity.getApprovedBy().getEmployeeId()
                        : null)
                .build();
    }

    @Override
    public List<OvertimeResponse> getAll() {
        return overtimeRepo.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OvertimeResponse> getMyRequests() {
        Employee employee = employeeService.getCurrentEntity();

        return overtimeRepo.findByEmployee(employee)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}