package com.hrm.dacn.mappers;

import com.hrm.dacn.dtos.contracts.request.ContractCreateRequest;
import com.hrm.dacn.dtos.contracts.request.ContractUpdateRequest;
import com.hrm.dacn.dtos.contracts.response.ContractResponse;
import com.hrm.dacn.entities.Contracts;

import java.math.BigDecimal;

public class ContractMapper {

    private ContractMapper() {
        // Utility class
    }

    // =========================
    // CREATE
    // =========================
    public static Contracts toEntity(ContractCreateRequest request) {
        if (request == null) {
            return null;
        }

        return Contracts.builder()
                .contractNumber(request.getContractNumber())
                .contractType(request.getContractType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .basicSalary(request.getBasicSalary())
                .allowances(
                        request.getAllowances() != null
                                ? request.getAllowances()
                                : BigDecimal.ZERO
                )
                .workingHoursPerDay(request.getWorkingHoursPerDay())
                .workingDaysPerWeek(request.getWorkingDaysPerWeek())
                .probationPeriod(request.getProbationPeriod())
                .jobDescription(request.getJobDescription())
                .signedDate(request.getSignedDate())
                .build();
    }

    // =========================
    // UPDATE (merge)
    // =========================
    public static void updateEntity(Contracts contract, ContractUpdateRequest request) {
        if (contract == null || request == null) {
            return;
        }

        contract.setContractType(request.getContractType());
        contract.setStartDate(request.getStartDate());
        contract.setEndDate(request.getEndDate());
        contract.setBasicSalary(request.getBasicSalary());
        contract.setAllowances(
                request.getAllowances() != null
                        ? request.getAllowances()
                        : BigDecimal.ZERO
        );
        contract.setWorkingHoursPerDay(request.getWorkingHoursPerDay());
        contract.setWorkingDaysPerWeek(request.getWorkingDaysPerWeek());
        contract.setProbationPeriod(request.getProbationPeriod());
        contract.setJobDescription(request.getJobDescription());
        contract.setSignedDate(request.getSignedDate());
        contract.setStatus(request.getStatus());
    }

    // =========================
    // RESPONSE
    // =========================
    public static ContractResponse toResponse(Contracts contract) {
        if (contract == null) {
            return null;
        }

        return ContractResponse.builder()
                .contractId(contract.getContractId())
                .contractNumber(contract.getContractNumber())

                // contract type
                .contractType(contract.getContractType())
                .contractTypeDisplay(contract.getContractType().name())

                // dates
                .startDate(contract.getStartDate())
                .endDate(contract.getEndDate())
                .signedDate(contract.getSignedDate())

                // salary
                .basicSalary(contract.getBasicSalary())
                .allowances(contract.getAllowances())
                .totalCompensation(contract.getTotalCompensation())

                // working info
                .workingHoursPerDay(contract.getWorkingHoursPerDay())
                .workingDaysPerWeek(contract.getWorkingDaysPerWeek())
                .probationPeriod(contract.getProbationPeriod())

                // job
                .jobDescription(contract.getJobDescription())

                // status
                .status(contract.getStatus())
                .statusDisplay(contract.getStatus().name())
                .active(contract.isActive())

                // audit
                .createdAt(contract.getCreatedAt())
                .updatedAt(contract.getUpdatedAt())
                .build();
    }
}
