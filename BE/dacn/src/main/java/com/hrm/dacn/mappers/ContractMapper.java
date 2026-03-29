package com.hrm.dacn.mappers;

import com.hrm.dacn.dtos.PageDTO;
import com.hrm.dacn.dtos.contracts.request.ContractCreateRequest;
import com.hrm.dacn.dtos.contracts.request.ContractUpdateRequest;
import com.hrm.dacn.dtos.contracts.response.ContractResponse;
import com.hrm.dacn.entities.Contracts;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class ContractMapper {

    private ContractMapper() {
        // Utility class
    }

    // =========================
    // CREATE
    // =========================
    public static Contracts toEntity(ContractCreateRequest r) {

        if (r == null) return null;

        return Contracts.builder()
                .contractNumber(r.getContractNumber())
                .contractType(r.getContractType())
                .startDate(r.getStartDate())
                .endDate(r.getEndDate())
                .signedDate(r.getSignedDate())

                .jobTitle(r.getJobTitle())
                .jobDescription(r.getJobDescription())
                .department(r.getDepartment())

                .basicSalary(r.getBasicSalary())
                .allowances(r.getAllowances() != null ? r.getAllowances() : BigDecimal.ZERO)
                .allowanceDetails(r.getAllowanceDetails())

                .workingHoursPerDay(
                        r.getWorkingHoursPerDay() != null
                                ? r.getWorkingHoursPerDay()
                                : BigDecimal.valueOf(8)
                )
                .workingDaysPerMonth(
                        r.getWorkingDaysPerMonth() != null
                                ? r.getWorkingDaysPerMonth()
                                : 5
                )
                .overtimePolicy(r.getOvertimePolicy())
                .annualLeaveDays(
                        r.getAnnualLeaveDays() != null
                                ? r.getAnnualLeaveDays()
                                : 12
                )

                .salaryPaymentMethod(r.getSalaryPaymentMethod())
                .salaryPaymentDate(r.getSalaryPaymentDate())

                .paidLeaveDeductionRate(r.getPaidLeaveDeductionRate())
                .unpaidLeaveDeductionRate(r.getUnpaidLeaveDeductionRate())
                .lateDeductionRate(r.getLateDeductionRate())

                .socialInsurance(
                        r.getSocialInsurance() != null
                                ? r.getSocialInsurance()
                                : true
                )
                .insuranceSalary(r.getInsuranceSalary())

                .probationPeriod(r.getProbationPeriod())
                .probationSalaryPercentage(
                        r.getProbationSalaryPercentage() != null
                                ? r.getProbationSalaryPercentage()
                                : 85
                )

                .terminationDate(r.getTerminationDate())
                .terminationReason(r.getTerminationReason())
                .noticePeriodDays(r.getNoticePeriodDays())

                .fileUrl(r.getFileUrl())
                .draftFileUrl(r.getDraftFileUrl())

                .employerRepresentative(r.getEmployerRepresentative())
                .employerPosition(r.getEmployerPosition())

                .notes(r.getNotes())

                .build();
    }


    // =========================
    // UPDATE (merge)
    // =========================
    public static void updateEntity(Contracts c, ContractUpdateRequest r) {
        if (c == null || r == null) return;

        // ===== BASIC =====
        if (r.getContractType() != null) c.setContractType(r.getContractType());
        if (r.getStatus() != null) c.setStatus(r.getStatus());
        if (r.getStartDate() != null) c.setStartDate(r.getStartDate());
        if (r.getEndDate() != null) c.setEndDate(r.getEndDate());
        if (r.getSignedDate() != null) c.setSignedDate(r.getSignedDate());

        // ===== JOB =====
        if (r.getJobTitle() != null) c.setJobTitle(r.getJobTitle());
        if (r.getJobDescription() != null) c.setJobDescription(r.getJobDescription());
        if (r.getDepartment() != null) c.setDepartment(r.getDepartment());

        // ===== SALARY =====
        if (r.getBasicSalary() != null) c.setBasicSalary(r.getBasicSalary());
        if (r.getAllowances() != null) c.setAllowances(r.getAllowances());
        if (r.getAllowanceDetails() != null) c.setAllowanceDetails(r.getAllowanceDetails());

        if (r.getSalaryPaymentMethod() != null)
            c.setSalaryPaymentMethod(r.getSalaryPaymentMethod());
        if (r.getSalaryPaymentDate() != null)
            c.setSalaryPaymentDate(r.getSalaryPaymentDate());

        // ===== WORKING =====
        if (r.getWorkingHoursPerDay() != null)
            c.setWorkingHoursPerDay(r.getWorkingHoursPerDay());
        if (r.getWorkingDaysPerMonth() != null)
            c.setWorkingDaysPerMonth(r.getWorkingDaysPerMonth());
        if (r.getOvertimePolicy() != null)
            c.setOvertimePolicy(r.getOvertimePolicy());
        if (r.getAnnualLeaveDays() != null)
            c.setAnnualLeaveDays(r.getAnnualLeaveDays());
        if(r.getPaidLeaveDeductionRate() != null){
            c.setPaidLeaveDeductionRate(r.getPaidLeaveDeductionRate());
        }
        if (r.getLateDeductionRate() != null){
            c.setLateDeductionRate(r.getLateDeductionRate());
        }
        if(r.getUnpaidLeaveDeductionRate() != null){
            c.setUnpaidLeaveDeductionRate(r.getUnpaidLeaveDeductionRate());
        }

        // ===== PROBATION =====
        if (r.getProbationPeriod() != null)
            c.setProbationPeriod(r.getProbationPeriod());
        if (r.getProbationSalaryPercentage() != null)
            c.setProbationSalaryPercentage(r.getProbationSalaryPercentage());

        // ===== INSURANCE =====
        if (r.getSocialInsurance() != null)
            c.setSocialInsurance(r.getSocialInsurance());
        if (r.getInsuranceSalary() != null)
            c.setInsuranceSalary(r.getInsuranceSalary());

        // ===== EMPLOYER =====
        if (r.getEmployerRepresentative() != null)
            c.setEmployerRepresentative(r.getEmployerRepresentative());
        if (r.getEmployerPosition() != null)
            c.setEmployerPosition(r.getEmployerPosition());

        // ===== TERMINATION =====
        if (r.getTerminationDate() != null)
            c.setTerminationDate(r.getTerminationDate());
        if (r.getTerminationReason() != null)
            c.setTerminationReason(r.getTerminationReason());
        if (r.getNoticePeriodDays() != null)
            c.setNoticePeriodDays(r.getNoticePeriodDays());

        // ===== FILE =====
        if (r.getFileUrl() != null)
            c.setFileUrl(r.getFileUrl());
        if (r.getDraftFileUrl() != null)
            c.setDraftFileUrl(r.getDraftFileUrl());

        // ===== NOTE =====
        if (r.getNotes() != null)
            c.setNotes(r.getNotes());
    }

    // =========================
    // RESPONSE
    // =========================
    public static ContractResponse toResponse(Contracts c) {
        if (c == null) return null;

        return ContractResponse.builder()

                // BASIC
                .contractId(c.getContractId())
                .contractNumber(c.getContractNumber())

                // EMPLOYEE
                .employeeId(c.getEmployee() != null ? c.getEmployee().getEmployeeId() : null)
                .employeeName(c.getEmployee() != null ? c.getEmployee().getFullName() : null)

                // CONTRACT INFO
                .contractType(c.getContractType())
                .contractTypeDisplay(c.getContractType() != null ? c.getContractType().name() : null)

                .status(c.getStatus())
                .statusDisplay(c.getStatus() != null ? c.getStatus().name() : null)

                .startDate(c.getStartDate())
                .endDate(c.getEndDate())
                .signedDate(c.getSignedDate())

                // JOB
                .jobTitle(c.getJobTitle())
                .jobDescription(c.getJobDescription())
                .department(c.getDepartment())

                // WORKING
                .workingHoursPerDay(c.getWorkingHoursPerDay())
                .workingDaysPerMonth(c.getWorkingDaysPerMonth())
                .overtimePolicy(c.getOvertimePolicy())
                .annualLeaveDays(c.getAnnualLeaveDays())
                .paidLeaveDeductionRate(c.getPaidLeaveDeductionRate())
                .lateDeductionRate(c.getLateDeductionRate())
                .unpaidLeaveDeductionRate(c.getUnpaidLeaveDeductionRate())

                // SALARY
                .basicSalary(c.getBasicSalary())
                .allowances(c.getAllowances())
                .totalCompensation(c.getTotalCompensation())
                .allowanceDetails(c.getAllowanceDetails())
                .salaryPaymentMethod(c.getSalaryPaymentMethod())
                .salaryPaymentDate(c.getSalaryPaymentDate())

                // INSURANCE
                .socialInsurance(c.getSocialInsurance())
                .insuranceSalary(c.getInsuranceSalary())

                // PROBATION
                .probationPeriod(c.getProbationPeriod())
                .probationSalaryPercentage(c.getProbationSalaryPercentage())
                .probationEndDate(c.getProbationEndDate())

                // TERMINATION
                .terminationDate(c.getTerminationDate())
                .terminationReason(c.getTerminationReason())
                .noticePeriodDays(c.getNoticePeriodDays())

                // FILE
                .fileUrl(c.getFileUrl())
                .draftFileUrl(c.getDraftFileUrl())

                // BUSINESS FLAGS
                .active(c.isActive())
                .expired(c.isExpired())
                .inProbation(c.isInProbation())

                // AUDIT
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .createdBy(c.getCreatedBy())
                .updatedBy(c.getUpdatedBy())

                .build();
    }

    public static PageDTO<ContractResponse> toContractPageDTO(Page<Contracts> page) {
        return PageDTO.<ContractResponse>builder()
                .content(page.getContent()
                        .stream()
                        .map(ContractMapper::toResponse)
                        .toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

}
