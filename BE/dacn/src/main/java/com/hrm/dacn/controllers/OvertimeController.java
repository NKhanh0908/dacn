package com.hrm.dacn.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hrm.dacn.dtos.APIResponse;
import com.hrm.dacn.dtos.Attendance.request.OvertimeCreateRequest;
import com.hrm.dacn.dtos.Attendance.response.OvertimeResponse;
import com.hrm.dacn.services.OvertimeService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/overtime-requests")
@Tag(name = "Overtime Management", description = "APIs for managing overtime requests")
public class OvertimeController {

    private final OvertimeService overtimeService;

    @PostMapping
    public ResponseEntity<APIResponse<OvertimeResponse>> create(
            @RequestBody OvertimeCreateRequest request,
            HttpServletRequest httpRequest) {

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new APIResponse<>(true, "Overtime request created successfully",
                        overtimeService.create(request), null, httpRequest.getRequestURI()));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<APIResponse<OvertimeResponse>> approve(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {

        return ResponseEntity.ok(
                new APIResponse<>(true, "Overtime request approved successfully",
                        overtimeService.approve(id), null, httpRequest.getRequestURI()));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<APIResponse<OvertimeResponse>> reject(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {

        return ResponseEntity.ok(
                new APIResponse<>(true, "Overtime request rejected successfully",
                        overtimeService.reject(id), null, httpRequest.getRequestURI()));
    }
}