package com.hrm.dacn.mappers;

import com.hrm.dacn.dtos.PageDTO;
import com.hrm.dacn.dtos.contracts.request.ContractCreateRequest;
import com.hrm.dacn.dtos.contracts.request.ContractUpdateRequest;
import com.hrm.dacn.dtos.contracts.response.ContractResponse;
import com.hrm.dacn.entities.Company;
import com.hrm.dacn.entities.Contracts;
import com.hrm.dacn.entities.Employee;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;


public class ContractMapper {

    private ContractMapper() {
        // Utility class
    }

    // =========================
    // CREATE
    // =========================
    public static Contracts toEntity(
            ContractCreateRequest r
    ) {
        if (r == null) return null;

        return Contracts.builder()
                .contractNumber(r.getContractNumber())

                .contractType(r.getContractType())
                .startDate(r.getStartDate())
                .endDate(r.getEndDate())
                .signedDate(r.getSignedDate())

                .jobTitle(r.getJobTitle())
                .department(r.getDepartment())
                .jobDescription(r.getJobDescription())

                .basicSalary(r.getBasicSalary())
                .allowances(r.getAllowances() != null ? r.getAllowances() : BigDecimal.ZERO)
                .allowanceDetails(r.getAllowanceDetails())

                .workingHoursPerDay(
                        r.getWorkingHoursPerDay() != null
                                ? r.getWorkingHoursPerDay()
                                : BigDecimal.valueOf(8)
                )
                .workingDaysPerWeek(
                        r.getWorkingDaysPerWeek() != null
                                ? r.getWorkingDaysPerWeek()
                                : 5
                )

                .probationPeriod(r.getProbationPeriod())

                .salaryPaymentMethod(r.getSalaryPaymentMethod())
                .salaryPaymentDate(r.getSalaryPaymentDate())

                .socialInsurance(
                        r.getSocialInsurance() != null
                                ? r.getSocialInsurance()
                                : true
                )
                .insuranceSalary(r.getInsuranceSalary())

                .employerRepresentative(r.getEmployerRepresentative())
                .employerPosition(r.getEmployerPosition())

                .confidentialityClause(r.getConfidentialityClause())
                .technologyConfidentiality(r.getTechnologyConfidentiality())
                .nonCompeteClause(r.getNonCompeteClause())
                .confidentialityPeriodMonths(r.getConfidentialityPeriodMonths())

                .noticePeriodDays(r.getNoticePeriodDays())
                .notes(r.getNotes())
                .build();
    }


    // =========================
    // UPDATE (merge)
    // =========================
    public static void updateEntity(Contracts c, ContractUpdateRequest r) {
        if (c == null || r == null) return;

        if (r.getContractType() != null) c.setContractType(r.getContractType());
        if (r.getStatus() != null) c.setStatus(r.getStatus());

        if (r.getStartDate() != null) c.setStartDate(r.getStartDate());
        if (r.getEndDate() != null) c.setEndDate(r.getEndDate());
        if (r.getSignedDate() != null) c.setSignedDate(r.getSignedDate());

        if (r.getJobTitle() != null) c.setJobTitle(r.getJobTitle());
        if (r.getDepartment() != null) c.setDepartment(r.getDepartment());
        if (r.getJobDescription() != null) c.setJobDescription(r.getJobDescription());

        if (r.getBasicSalary() != null) c.setBasicSalary(r.getBasicSalary());
        if (r.getAllowances() != null) c.setAllowances(r.getAllowances());
        if (r.getAllowanceDetails() != null) c.setAllowanceDetails(r.getAllowanceDetails());

        if (r.getWorkingHoursPerDay() != null) c.setWorkingHoursPerDay(r.getWorkingHoursPerDay());
        if (r.getWorkingDaysPerWeek() != null) c.setWorkingDaysPerWeek(r.getWorkingDaysPerWeek());

        if (r.getProbationPeriod() != null) c.setProbationPeriod(r.getProbationPeriod());
        if (r.getProbationSalaryPercentage() != null)
            c.setProbationSalaryPercentage(r.getProbationSalaryPercentage());

        if (r.getSalaryPaymentMethod() != null)
            c.setSalaryPaymentMethod(r.getSalaryPaymentMethod());
        if (r.getSalaryPaymentDate() != null)
            c.setSalaryPaymentDate(r.getSalaryPaymentDate());

        if (r.getSocialInsurance() != null)
            c.setSocialInsurance(r.getSocialInsurance());
        if (r.getInsuranceSalary() != null)
            c.setInsuranceSalary(r.getInsuranceSalary());

        if (r.getEmployerRepresentative() != null)
            c.setEmployerRepresentative(r.getEmployerRepresentative());
        if (r.getEmployerPosition() != null)
            c.setEmployerPosition(r.getEmployerPosition());

        if (r.getConfidentialityClause() != null)
            c.setConfidentialityClause(r.getConfidentialityClause());
        if (r.getTechnologyConfidentiality() != null)
            c.setTechnologyConfidentiality(r.getTechnologyConfidentiality());
        if (r.getNonCompeteClause() != null)
            c.setNonCompeteClause(r.getNonCompeteClause());
        if (r.getConfidentialityPeriodMonths() != null)
            c.setConfidentialityPeriodMonths(r.getConfidentialityPeriodMonths());

        if (r.getNoticePeriodDays() != null)
            c.setNoticePeriodDays(r.getNoticePeriodDays());
        if (r.getNotes() != null)
            c.setNotes(r.getNotes());
    }

    // =========================
    // RESPONSE
    // =========================
    public static ContractResponse toResponse(Contracts contract) {
        if (contract == null) {
            return null;
        }

        return ContractResponse.builder()
                // basic
                .contractId(contract.getContractId())
                .contractNumber(contract.getContractNumber())

                // company
                .companyId(
                        contract.getCompany() != null
                                ? contract.getCompany().getCompanyId()
                                : null
                )
                .companyName(
                        contract.getCompany() != null
                                ? contract.getCompany().getCompanyName()
                                : null
                )

                // employee
                .employeeId(
                        contract.getEmployee() != null
                                ? contract.getEmployee().getEmployeeId()
                                : null
                )
                .employeeName(
                        contract.getEmployee() != null
                                ? contract.getEmployee().getFullName()
                                : null
                )

                // contract info
                .contractType(contract.getContractType())
                .contractTypeDisplay(
                        contract.getContractType() != null
                                ? contract.getContractType().name()
                                : null
                )

                .startDate(contract.getStartDate())
                .endDate(contract.getEndDate())
                .signedDate(contract.getSignedDate())

                .jobTitle(contract.getJobTitle())
                .department(contract.getDepartment())
                .jobDescription(contract.getJobDescription())

                // salary
                .basicSalary(contract.getBasicSalary())
                .allowances(contract.getAllowances())
                .totalCompensation(contract.getTotalCompensation())

                .salaryPaymentMethod(contract.getSalaryPaymentMethod())
                .salaryPaymentDate(contract.getSalaryPaymentDate())

                // working
                .workingHoursPerDay(contract.getWorkingHoursPerDay())
                .workingDaysPerWeek(contract.getWorkingDaysPerWeek())
                .probationPeriod(contract.getProbationPeriod())
                .probationSalaryPercentage(contract.getProbationSalaryPercentage())

                // insurance
                .socialInsurance(contract.getSocialInsurance())
                .insuranceSalary(contract.getInsuranceSalary())

                // status
                .status(contract.getStatus())
                .statusDisplay(
                        contract.getStatus() != null
                                ? contract.getStatus().name()
                                : null
                )
                .active(contract.isActive())

                // audit
                .createdAt(contract.getCreatedAt())
                .updatedAt(contract.getUpdatedAt())
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
