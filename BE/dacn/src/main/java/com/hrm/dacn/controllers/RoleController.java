package com.hrm.dacn.controllers;

import com.hrm.dacn.dtos.APIResponse;
import com.hrm.dacn.dtos.role.request.RoleCreateRequest;
import com.hrm.dacn.dtos.role.response.RoleResponse;
import com.hrm.dacn.services.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/roles")
@Tag(name = "Role Management", description = "APIs for managing role information in HRM system")
public class RoleController {
    private final RoleService roleService;

    @PostMapping
    @Operation(
            summary = "Create new role",
            description = "Create a new role in the system",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Role created successfully",
                            content = @Content(schema = @Schema(implementation = RoleResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid input data"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    public ResponseEntity<APIResponse<RoleResponse>> createRole(
            @RequestBody RoleCreateRequest request,
            HttpServletRequest httpRequest) {

        RoleResponse response = roleService.create(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new APIResponse<>(
                        true,
                        "Role created successfully",
                        response,
                        null,
                        httpRequest.getRequestURI()
                ));
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Get role by ID",
            description = "Retrieve role information by role ID",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Role retrieved successfully",
                            content = @Content(schema = @Schema(implementation = RoleResponse.class))),
                    @ApiResponse(responseCode = "404", description = "Role not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    public ResponseEntity<APIResponse<RoleResponse>> getRoleById(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {

        RoleResponse response = roleService.findById(id);

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Role retrieved successfully",
                        response,
                        null,
                        httpRequest.getRequestURI()
                )
        );
    }

    // =========================
    // GET ALL ROLES
    // =========================
    @GetMapping
    @Operation(
            summary = "Get all roles",
            description = "Retrieve list of all roles",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Roles retrieved successfully",
                            content = @Content(schema = @Schema(implementation = RoleResponse.class))),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    public ResponseEntity<APIResponse<List<RoleResponse>>> getAllRoles(
            HttpServletRequest httpRequest) {

        List<RoleResponse> responses = roleService.findAll();

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Roles retrieved successfully",
                        responses,
                        null,
                        httpRequest.getRequestURI()
                )
        );
    }


}
