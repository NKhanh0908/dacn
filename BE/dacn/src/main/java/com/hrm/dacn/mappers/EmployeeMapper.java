package com.hrm.dacn.mappers;

import com.hrm.dacn.dtos.Employee.Request.EmployeeCreateRequest;
import com.hrm.dacn.dtos.Employee.Request.EmployeeUpdateRequest;
import com.hrm.dacn.dtos.Employee.Response.EmployeeResponse;
import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.enums.Employee.EmployeeStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
@Component
public class EmployeeMapper {

    private EmployeeMapper() {
        // Utility class
    }

    // =========================
    // CREATE
    // =========================
    public static Employee toEntity(EmployeeCreateRequest request) {
        if (request == null) {
            return null;
        }

        return Employee.builder()
                .fullName(request.getFullName())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .idCard(request.getIdCard())
                .phone(request.getPhone())
                .email(request.getEmail())
                .address(request.getAddress())
                .department(request.getDepartment())
                .position(request.getPosition())
                .startDate(
                        request.getStartDate() != null
                                ? request.getStartDate()
                                : LocalDate.now())
                .status(
                        request.getStatus() != null
                                ? request.getStatus()
                                : EmployeeStatus.WORKING)
                .bankAccount(request.getBankAccount())
                .bankName(request.getBankName())
                .taxCode(request.getTaxCode())
                .socialInsuranceNumber(request.getSocialInsuranceNumber())
                .emergencyContactName(request.getEmergencyContactName())
                .emergencyContactPhone(request.getEmergencyContactPhone())
                .emergencyContactRelationship(request.getEmergencyContactRelationship())
                .build();
    }

    // =========================
    // UPDATE (PARTIAL)
    // =========================
    public static void updateEntity(Employee employee, EmployeeUpdateRequest request) {
        if (employee == null || request == null) {
            return;
        }

        if (request.getFullName() != null)
            employee.setFullName(request.getFullName());
        if (request.getDateOfBirth() != null)
            employee.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null)
            employee.setGender(request.getGender());
        if (request.getIdCard() != null)
            employee.setIdCard(request.getIdCard());
        if (request.getPhone() != null)
            employee.setPhone(request.getPhone());
        if (request.getEmail() != null)
            employee.setEmail(request.getEmail());
        if (request.getAddress() != null)
            employee.setAddress(request.getAddress());
        if (request.getDepartment() != null)
            employee.setDepartment(request.getDepartment());
        if (request.getPosition() != null)
            employee.setPosition(request.getPosition());
        if (request.getStartDate() != null)
            employee.setStartDate(request.getStartDate());
        if (request.getStatus() != null)
            employee.setStatus(request.getStatus());
        if (request.getBankAccount() != null)
            employee.setBankAccount(request.getBankAccount());
        if (request.getBankName() != null)
            employee.setBankName(request.getBankName());
        if (request.getTaxCode() != null)
            employee.setTaxCode(request.getTaxCode());
        if (request.getSocialInsuranceNumber() != null)
            employee.setSocialInsuranceNumber(request.getSocialInsuranceNumber());
        if (request.getEmergencyContactName() != null)
            employee.setEmergencyContactName(request.getEmergencyContactName());
        if (request.getEmergencyContactPhone() != null)
            employee.setEmergencyContactPhone(request.getEmergencyContactPhone());
        if (request.getEmergencyContactRelationship() != null)
            employee.setEmergencyContactRelationship(request.getEmergencyContactRelationship());
    }

    // =========================
    // RESPONSE
    // =========================
    public static EmployeeResponse toResponse(Employee employee) {
        if (employee == null) {
            return null;
        }

        return EmployeeResponse.builder()
                .employeeId(employee.getEmployeeId())
                .fullName(employee.getFullName())
                .dateOfBirth(employee.getDateOfBirth())
                .age(employee.getAge())
                .gender(employee.getGender())
                .genderDisplay(
                        employee.getGender() != null
                                ? employee.getGender().getDisplayName()
                                : null)
                .idCard(employee.getIdCard())
                .phone(employee.getPhone())
                .email(employee.getEmail())
                .address(employee.getAddress())
                .department(employee.getDepartment())
                .position(employee.getPosition())
                .roleId(employee.getRole().getId())
                .roleName(employee.getRole().getName())
                .startDate(employee.getStartDate())
                .yearsOfService(employee.getYearsOfService())
                .status(employee.getStatus())
                .statusDisplay(
                        employee.getStatus() != null
                                ? employee.getStatus().getDisplayName()
                                : null)
                .bankAccount(employee.getBankAccount())
                .bankName(employee.getBankName())
                .taxCode(employee.getTaxCode())
                .socialInsuranceNumber(employee.getSocialInsuranceNumber())
                .avatarUrl(employee.getAvatarUrl())
                .emergencyContactName(employee.getEmergencyContactName())
                .emergencyContactPhone(employee.getEmergencyContactPhone())
                .emergencyContactRelationship(employee.getEmergencyContactRelationship())
                .createdAt(employee.getCreatedAt())
                .updatedAt(employee.getUpdatedAt())
                .build();
    }

    // =========================
    // LIST RESPONSE
    // =========================
    public static List<EmployeeResponse> toResponseList(List<Employee> employees) {
        if (employees == null) {
            return List.of();
        }

        return employees.stream()
                .map(EmployeeMapper::toResponse)
                .collect(Collectors.toList());
    }
}