package com.hrm.dacn.controllers;

import com.hrm.dacn.dtos.APIResponse;
import com.hrm.dacn.dtos.PageDTO;
import com.hrm.dacn.dtos.contracts.request.*;
import com.hrm.dacn.dtos.contracts.response.ContractResponse;
import com.hrm.dacn.services.ContractService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/contract")
@Tag(name = "Contract Controller", description = "Manage user accounts and authentication")
public class ContractController {
    private final ContractService contractService;

    @PostMapping
    @Operation(
            summary = "Create Contract",
            description = "Create a new contract for an employee",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Contract created successfully",
                            content = @Content(
                                    schema = @Schema(implementation = ContractResponse.class)
                            )
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid contract data"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized access"),
                    @ApiResponse(responseCode = "409", description = "Employee already has an active contract"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    public ResponseEntity<APIResponse<ContractResponse>> createContract(
            @RequestBody ContractCreateRequest request,
            HttpServletRequest httpRequest
    ) {
        ContractResponse response = contractService.create(request);

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Contract created successfully",
                        response,
                        null,
                        httpRequest.getRequestURI()
                )
        );
    }

    // =========================
    // UPDATE CONTRACT
    // =========================
    @PatchMapping("/{id}")
    @Operation(
            summary = "Update Contract",
            description = "Update an existing contract by ID",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Contract updated successfully",
                            content = @Content(
                                    schema = @Schema(implementation = ContractResponse.class)
                            )
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid update data"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized access"),
                    @ApiResponse(responseCode = "404", description = "Contract not found"),
                    @ApiResponse(responseCode = "409", description = "Invalid contract status or time overlap"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    public ResponseEntity<APIResponse<ContractResponse>> updateContract(
            @PathVariable("id") Long id,
            @RequestBody ContractUpdateRequest request,
            HttpServletRequest httpRequest
    ) {
        ContractResponse response = contractService.update(id, request);

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Contract updated successfully",
                        response,
                        null,
                        httpRequest.getRequestURI()
                )
        );
    }

    @PostMapping("/{contractId}/sign")
    @Operation(summary = "Ký hợp đồng", description = "Ký hợp đồng bởi nhân viên hoặc nhà tuyển dụng")
    public ResponseEntity<APIResponse<ContractResponse>> signContract(
            @PathVariable Long contractId,
            @Valid @RequestBody ContractSignRequest request,
            HttpServletRequest httpRequest) {

        ContractResponse response = contractService.signContract(contractId, request);
        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Contract signed successfully",
                        response,
                        null,
                        httpRequest.getRequestURI()
                )
        );
    }

    @PostMapping("/{contractId}/terminate")
    @Operation(summary = "Chấm dứt hợp đồng", description = "Chấm dứt hợp đồng lao động")
    public ResponseEntity<APIResponse<ContractResponse>> terminateContract(
            @PathVariable Long contractId,
            @Valid @RequestBody ContractTerminateRequest request,
            HttpServletRequest httpRequest) {

        ContractResponse response = contractService.terminateContract(contractId, request);
        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Contract terminated successfully",
                        response,
                        null,
                        httpRequest.getRequestURI()
                )
        );
    }

    // =========================
    // FIND BY ID
    // =========================
    @GetMapping("/{id}")
    @Operation(
            summary = "Get Contract By ID",
            description = "Retrieve contract details by contract ID",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Contract retrieved successfully",
                            content = @Content(
                                    schema = @Schema(implementation = ContractResponse.class)
                            )
                    ),
                    @ApiResponse(responseCode = "400", description = "Invalid contract ID"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized access"),
                    @ApiResponse(responseCode = "404", description = "Contract not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    public ResponseEntity<APIResponse<ContractResponse>> getContractById(
            @PathVariable("id") Long id,
            HttpServletRequest httpRequest
    ) {
        ContractResponse response = contractService.findById(id);

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Contract retrieved successfully",
                        response,
                        null,
                        httpRequest.getRequestURI()
                )
        );
    }

    // =========================
    // FIND ALL
    // =========================
    @GetMapping("/filter")
    @Operation(
            summary = "Filter Contracts",
            description = "Filters contracts by criteria such as employee, department, role, title, signing date, and date range",
            parameters = {
                    @Parameter(name = "page", description = "Page number (0-based)", example = "0"),
                    @Parameter(name = "size", description = "Page size", example = "10")
            },
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Contracts filtered successfully",
                            content = @Content(schema = @Schema(implementation = PageDTO.class))
                    )
            }
    )
    public ResponseEntity<APIResponse<PageDTO<ContractResponse>>> getAllContracts(
            @ModelAttribute ContractFilter filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest httpRequest
    ) {
        PageDTO<ContractResponse> contracts = contractService.filter(filter, page, size);

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Contracts retrieved successfully",
                        contracts,
                        null,
                        httpRequest.getRequestURI()
                )
        );
    }

    // =========================
    // DELETE CONTRACT
    // =========================
    @DeleteMapping("/{id}")
    @Operation(
            summary = "Delete Contract",
            description = "Delete a contract by ID",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Contract deleted successfully"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized access"),
                    @ApiResponse(responseCode = "404", description = "Contract not found"),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            }
    )
    public ResponseEntity<APIResponse<Void>> deleteContract(
            @PathVariable("id") Long id,
            HttpServletRequest httpRequest
    ) {
        contractService.delete(id);

        return ResponseEntity.ok(
                new APIResponse<>(
                        true,
                        "Contract deleted successfully",
                        null,
                        null,
                        httpRequest.getRequestURI()
                )
        );
    }
}
