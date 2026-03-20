package com.hrm.dacn.controllers;

import com.hrm.dacn.dtos.APIResponse;
import com.hrm.dacn.dtos.ResultPagination;
import com.hrm.dacn.dtos.Employee.Request.EmployeeCreateRequest;
import com.hrm.dacn.dtos.Employee.Request.EmployeeUpdateRequest;
import com.hrm.dacn.dtos.Employee.Response.EmployeeResponse;
import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.services.EmployeeService;

import com.turkraft.springfilter.boot.Filter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/employees")
@Tag(name = "Employee Management", description = "APIs for managing employee information in HRM system")
public class EmployeeController {

        private final EmployeeService employeeService;

        // =========================
        // CREATE EMPLOYEE
        // =========================
        @PostMapping
        @Operation(summary = "Create new employee", description = "Create a new employee with personal, job, and contact information", responses = {
                        @ApiResponse(responseCode = "201", description = "Employee created successfully", content = @Content(schema = @Schema(implementation = EmployeeResponse.class))),
                        @ApiResponse(responseCode = "400", description = "Invalid input data"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        public ResponseEntity<APIResponse<EmployeeResponse>> createEmployee(
                        @ModelAttribute EmployeeCreateRequest request,
                        HttpServletRequest httpRequest) {
                EmployeeResponse response = employeeService.create(request);

                return ResponseEntity.status(HttpStatus.CREATED).body(
                                new APIResponse<>(
                                                true,
                                                "Employee created successfully",
                                                response,
                                                null,
                                                httpRequest.getRequestURI()));
        }

        // =========================
        // GET ALL EMPLOYEES
        // =========================
        @GetMapping
        @Operation(summary = "Get all employees", description = "Retrieve list of all employees", responses = {
                        @ApiResponse(responseCode = "200", description = "Employees retrieved successfully", content = @Content(schema = @Schema(implementation = EmployeeResponse.class))),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        public ResponseEntity<APIResponse<ResultPagination>> getAllEmployees(
                        @Filter Specification<Employee> spec, Pageable pageable,
                        HttpServletRequest httpRequest) {
                ResultPagination responses = employeeService.getAll(spec, pageable);

                return ResponseEntity.ok(
                                new APIResponse<>(
                                                true,
                                                "Employees retrieved successfully",
                                                responses,
                                                null,
                                                httpRequest.getRequestURI()));
        }

        // =========================
        // GET EMPLOYEE BY ID
        // =========================
        @GetMapping("/{id}")
        @Operation(summary = "Get employee by ID", description = "Retrieve detailed information of an employee by ID", responses = {
                        @ApiResponse(responseCode = "200", description = "Employee retrieved successfully", content = @Content(schema = @Schema(implementation = EmployeeResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Employee not found"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        public ResponseEntity<APIResponse<EmployeeResponse>> getEmployeeById(
                        @PathVariable Long id,
                        HttpServletRequest httpRequest) {
                EmployeeResponse response = employeeService.getById(id);

                return ResponseEntity.ok(
                                new APIResponse<>(
                                                true,
                                                "Employee retrieved successfully",
                                                response,
                                                null,
                                                httpRequest.getRequestURI()));
        }

    @GetMapping("/me")
    @Operation(
            summary = "Get current authenticated employee",
            description = "Retrieve information of the currently authenticated employee",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Employee retrieved successfully",
                            content = @Content(
                                    schema = @Schema(implementation = EmployeeResponse.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "Unauthorized"
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "Employee not found"
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "Internal server error"
                    )
            }
    )
    public ResponseEntity<APIResponse<EmployeeResponse>> getCurrentEmployee(
            HttpServletRequest httpRequest
    ) {

        EmployeeResponse response = employeeService.getCurrentUser();

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Current employee retrieved successfully",
                        response,
                        null,
                        httpRequest.getRequestURI()
                )
        );
    }


    // =========================
        // UPDATE EMPLOYEE
        // =========================
        @PutMapping("/{id}")
        @Operation(summary = "Update employee", description = "Update employee information by ID", responses = {
                        @ApiResponse(responseCode = "200", description = "Employee updated successfully", content = @Content(schema = @Schema(implementation = EmployeeResponse.class))),
                        @ApiResponse(responseCode = "404", description = "Employee not found"),
                        @ApiResponse(responseCode = "400", description = "Invalid input data"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        public ResponseEntity<APIResponse<EmployeeResponse>> updateEmployee(
                        @PathVariable Long id,
                        @ModelAttribute EmployeeUpdateRequest request,
                        HttpServletRequest httpRequest) {
                EmployeeResponse response = employeeService.update(id, request);

                return ResponseEntity.ok(
                                new APIResponse<>(
                                                true,
                                                "Employee updated successfully",
                                                response,
                                                null,
                                                httpRequest.getRequestURI()));
        }

        // =========================
        // DELETE EMPLOYEE
        // =========================
        @DeleteMapping("/{id}")
        @Operation(summary = "Delete employee", description = "Delete an employee by ID", responses = {
                        @ApiResponse(responseCode = "200", description = "Employee deleted successfully"),
                        @ApiResponse(responseCode = "404", description = "Employee not found"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        public ResponseEntity<APIResponse<Void>> deleteEmployee(
                        @PathVariable Long id,
                        HttpServletRequest httpRequest) {
                employeeService.delete(id);

                return ResponseEntity.ok(
                                new APIResponse<>(
                                                true,
                                                "Employee deleted successfully",
                                                null,
                                                null,
                                                httpRequest.getRequestURI()));
        }
}