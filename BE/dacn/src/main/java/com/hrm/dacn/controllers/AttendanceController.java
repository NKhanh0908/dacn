package com.hrm.dacn.controllers;

import com.hrm.dacn.dtos.APIResponse;
import com.hrm.dacn.dtos.Attendance.request.*;
import com.hrm.dacn.dtos.Attendance.response.*;
import com.hrm.dacn.enums.Attendance.AttendanceStatus;
import com.hrm.dacn.services.AttendanceService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/attendances")
@RequiredArgsConstructor
@Tag(name = "Attendance", description = "Attendance management APIs: check-in, check-out, manual entry, statistics")
public class AttendanceController {

    private final AttendanceService attendanceService;

    // ===================== CHECK IN =====================
    @PostMapping("/check-in")
    @Operation(summary = "Employee check-in", description = "Employee performs check-in for today", responses = {
            @ApiResponse(responseCode = "200", description = "Check-in successful", content = @Content(schema = @Schema(implementation = AttendanceResponse.class))),
            @ApiResponse(responseCode = "400", description = "Already checked in or invalid time"),
            @ApiResponse(responseCode = "404", description = "Employee or work schedule not found")
    })
    public ResponseEntity<APIResponse<AttendanceResponse>> checkIn(
            @Valid @RequestBody CheckInRequest request,
            HttpServletRequest http) {

        AttendanceResponse data = attendanceService.checkIn(request);

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Check-in successful",
                        data,
                        null,
                        http.getRequestURI()));
    }

    // ===================== CHECK OUT =====================
    @PostMapping("/check-out")
    @Operation(summary = "Employee check-out", description = "Employee performs check-out for today", responses = {
            @ApiResponse(responseCode = "200", description = "Check-out successful", content = @Content(schema = @Schema(implementation = AttendanceResponse.class))),
            @ApiResponse(responseCode = "400", description = "Not checked in yet"),
            @ApiResponse(responseCode = "404", description = "Attendance not found")
    })
    public ResponseEntity<APIResponse<AttendanceResponse>> checkOut(
            @Valid @RequestBody CheckOutRequest request,
            HttpServletRequest http) {

        AttendanceResponse data = attendanceService.checkOut(request);

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Check-out successful",
                        data,
                        null,
                        http.getRequestURI()));
    }

    // ===================== TODAY =====================
    @GetMapping("/today/{employeeId}")
    @Operation(summary = "Get today's attendance", description = "Retrieve today's attendance record of an employee", responses = {
            @ApiResponse(responseCode = "200", description = "Attendance retrieved", content = @Content(schema = @Schema(implementation = AttendanceResponse.class))),
            @ApiResponse(responseCode = "404", description = "Attendance not found")
    })
    public ResponseEntity<APIResponse<AttendanceResponse>> getToday(
            @PathVariable Long employeeId,
            HttpServletRequest http) {

        AttendanceResponse data = attendanceService.getTodayAttendance(employeeId);

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Today attendance retrieved",
                        data,
                        null,
                        http.getRequestURI()));
    }

    // ===================== MANUAL CREATE =====================
    @PostMapping("/manual")
    @Operation(summary = "Create manual attendance", description = "HR/Admin creates attendance manually", responses = {
            @ApiResponse(responseCode = "201", description = "Manual attendance created", content = @Content(schema = @Schema(implementation = AttendanceResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid attendance data"),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<APIResponse<AttendanceResponse>> createManual(
            @Valid @RequestBody AttendanceCreateRequest request,
            HttpServletRequest http) {

        AttendanceResponse data = attendanceService.createManual(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        new APIResponse<>(
                                true,
                                "Manual attendance created",
                                data,
                                null,
                                http.getRequestURI()));
    }

    // ===================== UPDATE =====================
    @PutMapping("/{id}")
    @Operation(summary = "Update attendance", description = "HR/Admin updates attendance record", responses = {
            @ApiResponse(responseCode = "200", description = "Attendance updated", content = @Content(schema = @Schema(implementation = AttendanceResponse.class))),
            @ApiResponse(responseCode = "404", description = "Attendance not found")
    })
    public ResponseEntity<APIResponse<AttendanceResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody AttendanceUpdateRequest request,
            HttpServletRequest http) {

        AttendanceResponse data = attendanceService.update(id, request);

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Attendance updated",
                        data,
                        null,
                        http.getRequestURI()));
    }

    // ===================== GET BY ID =====================
    @GetMapping("/{id}")
    @Operation(summary = "Get attendance by ID", description = "Retrieve attendance record by ID", responses = {
            @ApiResponse(responseCode = "200", description = "Attendance retrieved", content = @Content(schema = @Schema(implementation = AttendanceResponse.class))),
            @ApiResponse(responseCode = "404", description = "Attendance not found")
    })
    public ResponseEntity<APIResponse<AttendanceResponse>> getById(
            @PathVariable Long id,
            HttpServletRequest http) {

        AttendanceResponse data = attendanceService.getById(id);

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Attendance retrieved",
                        data,
                        null,
                        http.getRequestURI()));
    }

    // ===================== FILTER + PAGINATION =====================
    @GetMapping
    @Operation(summary = "Filter attendances", description = "Retrieve attendance records with filters and pagination", responses = {
            @ApiResponse(responseCode = "200", description = "Attendances retrieved successfully")
    })
    public ResponseEntity<APIResponse<Page<AttendanceResponse>>> getAll(
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean isApproved,
            @RequestParam(required = false) Boolean isManualEntry,
            Pageable pageable,
            HttpServletRequest http) {

        AttendanceFilterRequest filter = new AttendanceFilterRequest();
        filter.setEmployeeId(employeeId);
        filter.setStartDate(startDate);
        filter.setEndDate(endDate);

        if (status != null) {
            filter.setStatus(AttendanceStatus.valueOf(status.toUpperCase()));
        }

        filter.setIsApproved(isApproved);
        filter.setIsManualEntry(isManualEntry);

        Page<AttendanceResponse> data = attendanceService.getAll(filter, pageable);

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Attendances retrieved",
                        data,
                        null,
                        http.getRequestURI()));
    }

    // ===================== MONTHLY =====================
    @GetMapping("/monthly/{employeeId}")
    @Operation(summary = "Monthly attendance", description = "Get monthly attendance of an employee", responses = {
            @ApiResponse(responseCode = "200", description = "Monthly attendance retrieved")
    })
    public ResponseEntity<APIResponse<List<AttendanceResponse>>> monthly(
            @PathVariable Long employeeId,
            @RequestParam int year,
            @RequestParam int month,
            HttpServletRequest http) {

        List<AttendanceResponse> data = attendanceService.getMonthlyAttendance(employeeId, year, month);

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Monthly attendance retrieved",
                        data,
                        null,
                        http.getRequestURI()));
    }

    // ===================== STATISTICS =====================
    @GetMapping("/statistics/{employeeId}")
    @Operation(summary = "Attendance statistics", description = "Get attendance statistics in date range", responses = {
            @ApiResponse(responseCode = "200", description = "Statistics retrieved", content = @Content(schema = @Schema(implementation = AttendanceStatistics.class)))
    })
    public ResponseEntity<APIResponse<AttendanceStatistics>> statistics(
            @PathVariable Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            HttpServletRequest http) {

        AttendanceStatistics data = attendanceService.getStatistics(employeeId, startDate, endDate);

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Attendance statistics retrieved",
                        data,
                        null,
                        http.getRequestURI()));
    }

    // ===================== APPROVE =====================
    @PostMapping("/{id}/approve")
    @Operation(summary = "Approve attendance", description = "HR/Admin approves manual attendance", responses = {
            @ApiResponse(responseCode = "200", description = "Attendance approved"),
            @ApiResponse(responseCode = "404", description = "Attendance not found")
    })
    public ResponseEntity<APIResponse<AttendanceResponse>> approve(
            @PathVariable Long id,
            HttpServletRequest http) {

        AttendanceResponse data = attendanceService.approve(id);

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Attendance approved",
                        data,
                        null,
                        http.getRequestURI()));
    }

    // ===================== DELETE =====================
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete attendance", description = "Delete attendance record by ID", responses = {
            @ApiResponse(responseCode = "200", description = "Attendance deleted"),
            @ApiResponse(responseCode = "404", description = "Attendance not found")
    })
    public ResponseEntity<APIResponse<Void>> delete(
            @PathVariable Long id,
            HttpServletRequest http) {

        attendanceService.delete(id);

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Attendance deleted",
                        null,
                        null,
                        http.getRequestURI()));
    }
}
