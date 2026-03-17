package com.hrm.dacn.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.hrm.dacn.dtos.Holiday.Request.HolidayRequest;
import com.hrm.dacn.dtos.Holiday.Response.HolidayResponse;
import com.hrm.dacn.services.HolidayService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/holidays")
@RequiredArgsConstructor
@Tag(name = "Holiday Management", description = "APIs for managing holidays")
public class HolidayController {

    private final HolidayService holidayService;

    @PostMapping
    @Operation(summary = "Create a new holiday")
    public ResponseEntity<HolidayResponse> createHoliday(
            @Valid @RequestBody HolidayRequest requestDTO,
            @RequestParam Long createdByEmployeeId) {

        HolidayResponse response = holidayService
                .createHoliday(requestDTO, createdByEmployeeId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing holiday")
    public ResponseEntity<HolidayResponse> updateHoliday(
            @PathVariable Long id,
            @Valid @RequestBody HolidayRequest requestDTO) {

        HolidayResponse response = holidayService
                .updateHoliday(id, requestDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get holiday by ID")
    public ResponseEntity<HolidayResponse> getHolidayById(
            @PathVariable Long id) {

        HolidayResponse response = holidayService.getHolidayById(id);
        return ResponseEntity.ok(response);
    }

    // @GetMapping("/search")
    // @Operation(summary = "Search holidays with pagination")
    // public ResponseEntity<Page<HolidayResponse>> searchHolidays(
    // @ModelAttribute HolidaySearchDTO searchDTO) {

    // Page<HolidayResponse> response = holidayService
    // .searchHolidays(searchDTO);
    // return ResponseEntity.ok(response);
    // }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a holiday")
    public ResponseEntity<Void> deleteHoliday(@PathVariable Long id) {
        holidayService.deleteHoliday(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get holidays within date range")
    public ResponseEntity<List<HolidayResponse>> getHolidaysByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {

        List<HolidayResponse> response = holidayService
                .getHolidaysByDateRange(fromDate, toDate);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check")
    @Operation(summary = "Check if a date is holiday")
    public ResponseEntity<Boolean> isHoliday(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        boolean isHoliday = holidayService.isHoliday(date);
        return ResponseEntity.ok(isHoliday);
    }

    @GetMapping("/salary-multiplier")
    @Operation(summary = "Get salary multiplier for a date")
    public ResponseEntity<Double> getSalaryMultiplier(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        Double multiplier = holidayService.getSalaryMultiplier(date);
        return ResponseEntity.ok(multiplier);
    }

    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming holidays")
    public ResponseEntity<List<HolidayResponse>> getUpcomingHolidays(
            @RequestParam(defaultValue = "7") int days) {

        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(days);

        List<HolidayResponse> response = holidayService
                .getHolidaysByDateRange(today, endDate);
        return ResponseEntity.ok(response);
    }
}
