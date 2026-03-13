package com.hrm.dacn.controllers;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.hrm.dacn.dtos.WorkSchedule.request.WorkScheduleRequest;
import com.hrm.dacn.dtos.WorkSchedule.response.WorkScheduleResponse;
import com.hrm.dacn.services.WorkScheduleService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/work-schedules")
@RequiredArgsConstructor
@Tag(name = "Work Schedule", description = "Quản lý ca làm việc")
public class WorkScheduleController {

    private final WorkScheduleService workScheduleService;

    /*
     * =====================================================
     * CREATE
     * =====================================================
     */
    @Operation(summary = "Tạo ca làm việc", description = "Tạo ca làm việc mới (có thể đặt làm ca mặc định)")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Tạo ca thành công"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ"),
            @ApiResponse(responseCode = "409", description = "Xung đột dữ liệu")
    })
    @PostMapping
    public ResponseEntity<WorkScheduleResponse> create(
            @Valid @RequestBody WorkScheduleRequest request) {

        WorkScheduleResponse response = workScheduleService.create(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /*
     * =====================================================
     * UPDATE
     * =====================================================
     */
    @Operation(summary = "Cập nhật ca làm việc", description = "Cập nhật thông tin ca làm việc")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cập nhật thành công"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy ca làm việc")
    })
    @PutMapping("/{id}")
    public ResponseEntity<WorkScheduleResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody WorkScheduleRequest request) {

        return ResponseEntity.ok(workScheduleService.update(id, request));
    }

    /*
     * =====================================================
     * GET BY ID
     * =====================================================
     */
    @Operation(summary = "Lấy ca làm việc theo ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Thành công"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy ca")
    })
    @GetMapping("/{id}")
    public ResponseEntity<WorkScheduleResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(workScheduleService.getById(id));
    }

    /*
     * =====================================================
     * GET DEFAULT
     * =====================================================
     */
    @Operation(summary = "Lấy ca làm việc mặc định", description = "Ca làm việc mặc định được dùng cho chấm công")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Thành công"),
            @ApiResponse(responseCode = "404", description = "Chưa có ca mặc định")
    })
    @GetMapping("/default")
    public ResponseEntity<WorkScheduleResponse> getDefault() {
        return ResponseEntity.ok(workScheduleService.getDefaultSchedule());
    }

    /*
     * =====================================================
     * SET DEFAULT
     * =====================================================
     */
    @Operation(summary = "Đặt ca làm việc mặc định", description = "Chỉ có 1 ca được đặt mặc định tại một thời điểm")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Đặt mặc định thành công"),
            @ApiResponse(responseCode = "400", description = "Ca không active"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy ca")
    })
    @PutMapping("/{id}/default")
    public ResponseEntity<WorkScheduleResponse> setAsDefault(@PathVariable Long id) {
        return ResponseEntity.ok(workScheduleService.setAsDefault(id));
    }

    /*
     * =====================================================
     * GET ALL
     * =====================================================
     */
    @Operation(summary = "Danh sách tất cả ca làm việc")
    @GetMapping
    public ResponseEntity<List<WorkScheduleResponse>> getAll() {
        return ResponseEntity.ok(workScheduleService.getAll());
    }

    /*
     * =====================================================
     * GET ACTIVE
     * =====================================================
     */
    @Operation(summary = "Danh sách ca làm việc đang active")
    @GetMapping("/active")
    public ResponseEntity<List<WorkScheduleResponse>> getActive() {
        return ResponseEntity.ok(workScheduleService.getActiveSchedules());
    }

    /*
     * =====================================================
     * ACTIVATE
     * =====================================================
     */
    @Operation(summary = "Kích hoạt ca làm việc")
    @PutMapping("/{id}/activate")
    public ResponseEntity<WorkScheduleResponse> activate(@PathVariable Long id) {
        return ResponseEntity.ok(workScheduleService.activate(id));
    }

    /*
     * =====================================================
     * DEACTIVATE
     * =====================================================
     */
    @Operation(summary = "Vô hiệu hóa ca làm việc", description = "Không thể vô hiệu hóa ca mặc định")
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivate(@PathVariable Long id) {
        workScheduleService.deactivate(id);
        return ResponseEntity.noContent().build();
    }

    /*
     * =====================================================
     * DELETE
     * =====================================================
     */
    @Operation(summary = "Xóa ca làm việc", description = "Không thể xóa ca mặc định")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Xóa thành công"),
            @ApiResponse(responseCode = "400", description = "Không thể xóa ca mặc định"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy ca")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        workScheduleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
