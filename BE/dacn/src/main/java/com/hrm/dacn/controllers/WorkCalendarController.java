package com.hrm.dacn.controllers;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hrm.dacn.dtos.WorkSchedule.request.WorkCalendarRequest;
import com.hrm.dacn.dtos.WorkSchedule.response.WorkCalendarResponse;
import com.hrm.dacn.services.WorkCalendarService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/work-calendars")
@RequiredArgsConstructor
public class WorkCalendarController {

    private final WorkCalendarService calendarService;

    @PostMapping
    public ResponseEntity<WorkCalendarResponse> create(
            @Valid @RequestBody WorkCalendarRequest request) {
        return ResponseEntity.ok(calendarService.create(request));
    }

    @GetMapping("/{year}")
    public ResponseEntity<WorkCalendarResponse> getByYear(
            @PathVariable Integer year) {
        return ResponseEntity.ok(calendarService.getByYear(year));
    }

    /**
     * API test nhanh cho Attendance
     */
    @GetMapping("/check-working-day")
    public ResponseEntity<Boolean> isWorkingDay(
            @RequestParam LocalDate date) {
        return ResponseEntity.ok(calendarService.isWorkingDay(date));
    }
}
