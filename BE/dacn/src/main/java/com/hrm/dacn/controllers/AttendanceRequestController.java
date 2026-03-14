package com.hrm.dacn.controllers;

import com.hrm.dacn.dtos.APIResponse;
import com.hrm.dacn.dtos.Attendance.request.AttendanceRequestCreateRequest;
import com.hrm.dacn.dtos.Attendance.request.AttendanceRequestReviewRequest;
import com.hrm.dacn.dtos.Attendance.request.AttendanceRequestResponse;
import com.hrm.dacn.services.AttendanceRequestService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/attendance-requests")
@RequiredArgsConstructor
@Tag(name = "Attendance Requests", description = "Attendance request management APIs")
public class AttendanceRequestController {

    private final AttendanceRequestService requestService;

    // ===================== CREATE =====================
    @PostMapping
    @Operation(summary = "Create attendance request", description = "Employee creates attendance request (forgot check-in/out, adjust time, etc.)", responses = {
            @ApiResponse(responseCode = "201", description = "Attendance request created", content = @Content(schema = @Schema(implementation = AttendanceRequestResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<APIResponse<AttendanceRequestResponse>> create(
            @Valid @RequestBody AttendanceRequestCreateRequest request,
            HttpServletRequest http) {

        AttendanceRequestResponse data = requestService.createRequest(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new APIResponse<>(
                        true,
                        "Attendance request created successfully",
                        data,
                        null,
                        http.getRequestURI()));
    }

    // ===================== REVIEW =====================
    @PostMapping("/{id}/review")
    @Operation(summary = "Review attendance request", description = "HR/Admin approves or rejects attendance request", responses = {
            @ApiResponse(responseCode = "200", description = "Attendance request reviewed", content = @Content(schema = @Schema(implementation = AttendanceRequestResponse.class))),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Attendance request not found")
    })
    public ResponseEntity<APIResponse<AttendanceRequestResponse>> review(
            @PathVariable Long id,
            @Valid @RequestBody AttendanceRequestReviewRequest request,
            HttpServletRequest http) {

        AttendanceRequestResponse data = requestService.reviewRequest(id, request);

        return ResponseEntity.ok(new APIResponse<>(
                true,
                "Attendance request reviewed successfully",
                data,
                null,
                http.getRequestURI()));
    }

    // ===================== GET BY ID =====================
    @GetMapping("/{id}")
    @Operation(summary = "Get attendance request by ID", description = "Retrieve attendance request details", responses = {
            @ApiResponse(responseCode = "200", description = "Attendance request retrieved", content = @Content(schema = @Schema(implementation = AttendanceRequestResponse.class))),
            @ApiResponse(responseCode = "404", description = "Attendance request not found")
    })
    public ResponseEntity<APIResponse<AttendanceRequestResponse>> getById(
            @PathVariable Long id,
            HttpServletRequest http) {

        AttendanceRequestResponse data = requestService.getById(id);

        return ResponseEntity.ok(new APIResponse<>(
                true,
                "Attendance request retrieved successfully",
                data,
                null,
                http.getRequestURI()));
    }

    // ===================== MY REQUESTS =====================
    @GetMapping("/my-requests")
    @Operation(summary = "My attendance requests", description = "Employee views their own attendance requests", responses = {
            @ApiResponse(responseCode = "200", description = "My attendance requests retrieved")
    })
    public ResponseEntity<APIResponse<List<AttendanceRequestResponse>>> myRequests(
            HttpServletRequest http) {

        List<AttendanceRequestResponse> data = requestService.getMyRequests();

        return ResponseEntity.ok(new APIResponse<>(
                true,
                "My attendance requests retrieved successfully",
                data,
                null,
                http.getRequestURI()));
    }

    // ===================== PENDING =====================
    @GetMapping("/pending")
    @Operation(summary = "Pending attendance requests", description = "HR/Admin views pending attendance requests", responses = {
            @ApiResponse(responseCode = "200", description = "Pending attendance requests retrieved")
    })
    public ResponseEntity<APIResponse<Page<AttendanceRequestResponse>>> pending(
            Pageable pageable,
            HttpServletRequest http) {

        Page<AttendanceRequestResponse> data = requestService.getPendingRequests(pageable);

        return ResponseEntity.ok(new APIResponse<>(
                true,
                "Pending attendance requests retrieved successfully",
                data,
                null,
                http.getRequestURI()));
    }

    // ===================== ALL =====================
    @GetMapping("/all")
    @Operation(summary = "All attendance requests", description = "HR/Admin views all attendance requests", responses = {
            @ApiResponse(responseCode = "200", description = "All attendance requests retrieved")
    })
    public ResponseEntity<APIResponse<Page<AttendanceRequestResponse>>> getAll(
            Pageable pageable,
            HttpServletRequest http) {

        Page<AttendanceRequestResponse> data = requestService.getAllRequests(pageable);

        return ResponseEntity.ok(new APIResponse<>(
                true,
                "All attendance requests retrieved successfully",
                data,
                null,
                http.getRequestURI()));
    }

    // ===================== CANCEL =====================
    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel attendance request", description = "Employee cancels attendance request when status is PENDING", responses = {
            @ApiResponse(responseCode = "200", description = "Attendance request cancelled"),
            @ApiResponse(responseCode = "404", description = "Attendance request not found")
    })
    public ResponseEntity<APIResponse<Void>> cancel(
            @PathVariable Long id,
            HttpServletRequest http) {

        requestService.cancelRequest(id);

        return ResponseEntity.ok(new APIResponse<>(
                true,
                "Attendance request cancelled successfully",
                null,
                null,
                http.getRequestURI()));
    }
}
