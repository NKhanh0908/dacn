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
                .endDate(request.getEndDate() != null ? request.getEndDate() : null)
                .basicSalary(request.getBasicSalary() != null ? request.getBasicSalary() : BigDecimal.ZERO)
                .allowances(
                        request.getAllowances() != null
                                ? request.getAllowances()
                                : BigDecimal.ZERO
                )
                .workingHoursPerDay(request.getWorkingHoursPerDay())
                .workingDaysPerWeek(request.getWorkingDaysPerWeek())
                .probationPeriod(request.getProbationPeriod() != null ? request.getProbationPeriod() : 0)
                .jobDescription(request.getJobDescription())
                .signedDate(request.getSignedDate() != null ? request.getSignedDate() : null)
                .build();
    }

    // =========================
    // UPDATE (merge)
    // =========================
    public static void updateEntity(Contracts contract, ContractUpdateRequest request) {
        if (contract == null || request == null) {
            return;
        }

        contract.setContractType(
                request.getContractType() != null
                        ? request.getContractType()
                        : contract.getContractType()
        );

        contract.setStartDate(
                request.getStartDate() != null
                        ? request.getStartDate()
                        : contract.getStartDate()
        );

        contract.setEndDate(
                request.getEndDate() != null
                        ? request.getEndDate()
                        : contract.getEndDate()
        );

        contract.setBasicSalary(
                request.getBasicSalary() != null
                        ? request.getBasicSalary()
                        : contract.getBasicSalary()
        );

        contract.setAllowances(
                request.getAllowances() != null
                        ? request.getAllowances()
                        : contract.getAllowances()
        );

        contract.setWorkingHoursPerDay(
                request.getWorkingHoursPerDay() != null
                        ? request.getWorkingHoursPerDay()
                        : contract.getWorkingHoursPerDay()
        );

        contract.setWorkingDaysPerWeek(
                request.getWorkingDaysPerWeek() != null
                        ? request.getWorkingDaysPerWeek()
                        : contract.getWorkingDaysPerWeek()
        );

        contract.setProbationPeriod(
                request.getProbationPeriod() != null
                        ? request.getProbationPeriod()
                        : contract.getProbationPeriod()
        );

        contract.setJobDescription(
                request.getJobDescription() != null
                        ? request.getJobDescription()
                        : contract.getJobDescription()
        );

        contract.setSignedDate(
                request.getSignedDate() != null
                        ? request.getSignedDate()
                        : contract.getSignedDate()
        );

        contract.setStatus(
                request.getStatus() != null
                        ? request.getStatus()
                        : contract.getStatus()
        );
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
