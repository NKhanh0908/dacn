package com.hrm.dacn.controllers;

import com.hrm.dacn.dtos.APIResponse;
import com.hrm.dacn.dtos.PageDTO;
import com.hrm.dacn.dtos.Holiday.Request.LeaveRequestCreateRequest;
import com.hrm.dacn.dtos.Holiday.Request.LeaveRequestFilter;
import com.hrm.dacn.dtos.Holiday.Request.LeaveRequestReviewRequest;
import com.hrm.dacn.dtos.Holiday.Response.LeaveRequestResponse;
import com.hrm.dacn.services.LeaveRequestService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/leave-requests")
@RequiredArgsConstructor
@Tag(name = "Leave Request", description = "Leave request management APIs: create, review, cancel, query")
public class LeaveRequestController {

        private final LeaveRequestService leaveRequestService;

        // ===================== CREATE =====================
        @PostMapping
        @Operation(summary = "Create leave request", description = "Employee submits a new leave request", responses = {
                        @ApiResponse(responseCode = "201", description = "Leave request created", content = @Content(schema = @Schema(implementation = LeaveRequestResponse.class))),
                        @ApiResponse(responseCode = "400", description = "Invalid date range or duration"),
                        @ApiResponse(responseCode = "404", description = "Employee not found"),
                        @ApiResponse(responseCode = "409", description = "Overlapping leave request exists")
        })
        public ResponseEntity<APIResponse<LeaveRequestResponse>> createRequest(
                        @Valid @RequestBody LeaveRequestCreateRequest request,
                        HttpServletRequest http) {

                LeaveRequestResponse data = leaveRequestService.createRequest(request);

                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(new APIResponse<>(
                                                true,
                                                "Leave request created successfully",
                                                data,
                                                null,
                                                http.getRequestURI()));
        }

        // ===================== REVIEW (APPROVE / REJECT) =====================
        @PutMapping("/{id}/review")
        @Operation(summary = "Review leave request", description = "HR/Manager approves or rejects a pending leave request", responses = {
                        @ApiResponse(responseCode = "200", description = "Leave request reviewed", content = @Content(schema = @Schema(implementation = LeaveRequestResponse.class))),
                        @ApiResponse(responseCode = "400", description = "Request already reviewed or missing reject reason"),
                        @ApiResponse(responseCode = "404", description = "Leave request not found")
        })
        public ResponseEntity<APIResponse<LeaveRequestResponse>> reviewRequest(
                        @PathVariable Long id,
                        @Valid @RequestBody LeaveRequestReviewRequest request,
                        HttpServletRequest http) {

                LeaveRequestResponse data = leaveRequestService.reviewRequest(id, request);

                return ResponseEntity.ok(new APIResponse<>(
                                true,
                                "Leave request reviewed successfully",
                                data,
                                null,
                                http.getRequestURI()));
        }

        // ===================== CANCEL =====================
        @PutMapping("/{id}/cancel")
        @Operation(summary = "Cancel leave request", description = "Employee cancels their own pending leave request", responses = {
                        @ApiResponse(responseCode = "200", description = "Leave request cancelled"),
                        @ApiResponse(responseCode = "400", description = "Only pending requests can be cancelled"),
                        @ApiResponse(responseCode = "403", description = "Not the owner of this request"),
                        @ApiResponse(responseCode = "404", description = "Leave request not found")
        })
        public ResponseEntity<APIResponse<Void>> cancelRequest(
                        @PathVariable Long id,
                        HttpServletRequest http) {

                leaveRequestService.cancelRequest(id);

                return ResponseEntity.ok(new APIResponse<>(
                                true,
                                "Leave request cancelled successfully",
                                null,
                                null,
                                http.getRequestURI()));
        }

        // ===================== GET BY ID =====================
        @GetMapping("/{id}")
        @Operation(summary = "Get leave request by ID", description = "Retrieve a leave request by its ID", responses = {
                        @ApiResponse(responseCode = "200", description = "Leave request retrieved", content = @Content(schema = @Schema(implementation = LeaveRequestResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Leave request not found")
        })
        public ResponseEntity<APIResponse<LeaveRequestResponse>> getById(
                        @PathVariable Long id,
                        HttpServletRequest http) {

                LeaveRequestResponse data = leaveRequestService.getById(id);

                return ResponseEntity.ok(new APIResponse<>(
                                true,
                                "Leave request retrieved",
                                data,
                                null,
                                http.getRequestURI()));
        }

        // ===================== MY REQUESTS =====================
        @GetMapping("/my")
        @Operation(summary = "Get my leave requests", description = "Employee retrieves all their own leave requests", responses = {
                        @ApiResponse(responseCode = "200", description = "Leave requests retrieved")
        })
        public ResponseEntity<APIResponse<List<LeaveRequestResponse>>> getMyRequests(
                        HttpServletRequest http) {

                List<LeaveRequestResponse> data = leaveRequestService.getMyRequests();

                return ResponseEntity.ok(new APIResponse<>(
                                true,
                                "My leave requests retrieved",
                                data,
                                null,
                                http.getRequestURI()));
        }

        @GetMapping("/filter")
        public ResponseEntity<APIResponse<PageDTO<LeaveRequestResponse>>> filterLeaveRequests(
                        @ModelAttribute LeaveRequestFilter filter,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        HttpServletRequest request) {

                PageDTO<LeaveRequestResponse> data = leaveRequestService.filter(filter, page, size);

                return ResponseEntity.ok(
                                new APIResponse<>(
                                                true,
                                                "Filter leave requests successfully",
                                                data,
                                                null,
                                                request.getRequestURI()));
        }

}