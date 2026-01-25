package com.hrm.dacn.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hrm.dacn.dtos.APIResponse;
import com.hrm.dacn.dtos.Employee.Request.EmployeeCreateRequest;
import com.hrm.dacn.dtos.Employee.Response.EmployeeResponse;
import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.services.EmployeeService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequiredArgsConstructor
@RequestMapping("/employees")
@Tag(name = "Employee Controller", description = "Manage user accounts and authentication")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeService getEmployeeService() {
        return employeeService;
    }


    // =========================
    // CREATE EMPLOYEE
    // =========================
    @PostMapping
    @Operation(
            summary = "Create Employee",
            description = "Create a new employee with personal, job, and contact information",
            responses = {
                    @ApiResponse(
                            responseCode = "201",
                            description = "Employee created successfully",
                            content = @Content(
                                    schema = @Schema(implementation = EmployeeResponse.class)
                            )
                    ),
            }
    )
    public ResponseEntity<APIResponse<EmployeeResponse>> createEmployee(
            @RequestBody EmployeeCreateRequest request,
            HttpServletRequest httpRequest
    ) {
        EmployeeResponse response = employeeService.create(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new APIResponse<>(
                        true,
                        "Employee created successfully",
                        response,
                        null,
                        httpRequest.getRequestURI()
                )
        );
    }

    // =========================
    // GET EMPLOYEE BY ID
    // =========================
    @GetMapping("/{id}")
    @Operation(
            summary = "Get Employee By ID",
            description = "Retrieve detailed information of an employee by ID",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Employee retrieved successfully",
                            content = @Content(
                                    schema = @Schema(implementation = EmployeeResponse.class)
                            )
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid employee ID"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized access"),
                    @ApiResponse(responseCode = "404", description = "Employee not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    public ResponseEntity<APIResponse<EmployeeResponse>> getEmployeeById(
            @PathVariable("id") Long id,
            HttpServletRequest httpRequest
    ) {
        EmployeeResponse response = employeeService.getById(id);

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Employee retrieved successfully",
                        response,
                        null,
                        httpRequest.getRequestURI()
                )
        );
    }

}
