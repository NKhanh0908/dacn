package com.hrm.dacn.controllers;

import com.hrm.dacn.dtos.APIResponse;
import com.hrm.dacn.dtos.Attendance.response.MonthlySummaryResponse;
import com.hrm.dacn.services.MonthlySummaryService;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

/**
 * Monthly summary management APIs
 */
@RestController
@RequestMapping("/api/v1/monthly-summaries")
@RequiredArgsConstructor
@Tag(name = "Monthly Summary", description = "Monthly attendance summary management APIs")
public class MonthlySummaryController {

    private final MonthlySummaryService monthlySummaryService;

    // ===================== GENERATE ONE =====================
    @PostMapping("/generate")
    @Operation(summary = "Generate monthly summary", description = "Generate or update monthly summary for an employee", responses = {
            @ApiResponse(responseCode = "200", description = "Monthly summary generated", content = @Content(schema = @Schema(implementation = MonthlySummaryResponse.class))),
            @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<APIResponse<MonthlySummaryResponse>> generateMonthlySummary(
            @RequestParam Long employeeId,
            @RequestParam int year,
            @RequestParam int month,
            HttpServletRequest http) {

        MonthlySummaryResponse data = monthlySummaryService.generateMonthlySummary(employeeId, year, month);

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Monthly summary generated successfully",
                        data,
                        null,
                        http.getRequestURI()));
    }

    // ===================== GENERATE ALL =====================
    @PostMapping("/generate-all")
    @Operation(summary = "Generate monthly summaries for all employees", description = "Generate monthly summaries for all employees in a given month")
    public ResponseEntity<APIResponse<Void>> generateAllMonthlySummaries(
            @RequestParam int year,
            @RequestParam int month,
            HttpServletRequest http) {

        monthlySummaryService.generateAllMonthlySummaries(year, month);

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Monthly summaries generated for all employees",
                        null,
                        null,
                        http.getRequestURI()));
    }

    // ===================== GET ONE =====================
    @GetMapping("/{employeeId}")
    @Operation(summary = "Get monthly summary", description = "Retrieve monthly summary of an employee", responses = {
            @ApiResponse(responseCode = "200", description = "Monthly summary retrieved", content = @Content(schema = @Schema(implementation = MonthlySummaryResponse.class))),
            @ApiResponse(responseCode = "404", description = "Summary not found")
    })
    public ResponseEntity<APIResponse<MonthlySummaryResponse>> getMonthlySummary(
            @PathVariable Long employeeId,
            @RequestParam int year,
            @RequestParam int month,
            HttpServletRequest http) {

        MonthlySummaryResponse data = monthlySummaryService.getMonthlySummary(employeeId, year, month);

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Monthly summary retrieved successfully",
                        data,
                        null,
                        http.getRequestURI()));
    }

    // ===================== HISTORY =====================
    @GetMapping("/{employeeId}/history")
    @Operation(summary = "Get employee summary history", description = "Retrieve all monthly summaries of an employee")
    public ResponseEntity<APIResponse<List<MonthlySummaryResponse>>> getEmployeeHistory(
            @PathVariable Long employeeId,
            HttpServletRequest http) {

        List<MonthlySummaryResponse> data = monthlySummaryService.getEmployeeHistory(employeeId);

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Employee monthly summary history retrieved",
                        data,
                        null,
                        http.getRequestURI()));
    }

    // ===================== BY MONTH =====================
    @GetMapping("/by-month")
    @Operation(summary = "Get summaries by month", description = "Retrieve monthly summaries of all employees with pagination")
    public ResponseEntity<APIResponse<Page<MonthlySummaryResponse>>> getSummariesByMonth(
            @RequestParam int year,
            @RequestParam int month,
            Pageable pageable,
            HttpServletRequest http) {

        Page<MonthlySummaryResponse> data = monthlySummaryService.getSummariesByMonth(year, month, pageable);

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Monthly summaries retrieved successfully",
                        data,
                        null,
                        http.getRequestURI()));
    }

    // ===================== FINALIZE =====================
    @PostMapping("/{id}/finalize")
    @Operation(summary = "Finalize monthly summary", description = "Finalize (lock) a monthly summary")
    public ResponseEntity<APIResponse<MonthlySummaryResponse>> finalizeSummary(
            @PathVariable Long id,
            HttpServletRequest http) {

        MonthlySummaryResponse data = monthlySummaryService.finalizeSummary(id);

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Monthly summary finalized successfully",
                        data,
                        null,
                        http.getRequestURI()));
    }

    // ===================== UNFINALIZE =====================
    @PostMapping("/{id}/unfinalize")
    @Operation(summary = "Unfinalize monthly summary", description = "Unfinalize (unlock) a monthly summary")
    public ResponseEntity<APIResponse<MonthlySummaryResponse>> unfinalizeSummary(
            @PathVariable Long id,
            HttpServletRequest http) {

        MonthlySummaryResponse data = monthlySummaryService.unfinalizeSummary(id);

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Monthly summary unfinalized successfully",
                        data,
                        null,
                        http.getRequestURI()));
    }
}
