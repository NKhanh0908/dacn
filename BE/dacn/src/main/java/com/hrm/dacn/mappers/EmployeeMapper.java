package com.hrm.dacn.mappers;

import org.springframework.stereotype.Component;

import com.hrm.dacn.dtos.Employee.Request.EmployeeCreateRequest;
import com.hrm.dacn.dtos.Employee.Request.EmployeeUpdateRequest;
import com.hrm.dacn.dtos.Employee.Response.EmployeeResponse;
import com.hrm.dacn.entities.Employee;

@Component
public class EmployeeMapper {

    public Employee toEntity(EmployeeCreateRequest request) {
        Employee employee = new Employee();
        employee.setFullName(request.getFullName());
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setGender(request.getGender());
        employee.setIdCard(request.getIdCard());
        employee.setPhone(request.getPhone());
        employee.setEmail(request.getEmail());
        employee.setAddress(request.getAddress());
        employee.setDepartment(request.getDepartment());
        employee.setPosition(request.getPosition());
        employee.setRoleId(request.getRoleId());
        employee.setStartDate(request.getStartDate());
        employee.setStatus(request.getStatus());
        employee.setBankAccount(request.getBankAccount());
        employee.setBankName(request.getBankName());
        employee.setTaxCode(request.getTaxCode());
        employee.setSocialInsuranceNumber(request.getSocialInsuranceNumber());
        employee.setAvatarUrl(request.getAvatarUrl());
        employee.setEmergencyContactName(request.getEmergencyContactName());
        employee.setEmergencyContactPhone(request.getEmergencyContactPhone());
        employee.setEmergencyContactRelationship(request.getEmergencyContactRelationship());
        return employee;
    }

    public void updateEntity(Employee employee, EmployeeUpdateRequest request) {
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
        if (request.getRoleId() != null)
            employee.setRoleId(request.getRoleId());
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
        if (request.getAvatarUrl() != null)
            employee.setAvatarUrl(request.getAvatarUrl());
        if (request.getEmergencyContactName() != null)
            employee.setEmergencyContactName(request.getEmergencyContactName());
        if (request.getEmergencyContactPhone() != null)
            employee.setEmergencyContactPhone(request.getEmergencyContactPhone());
        if (request.getEmergencyContactRelationship() != null)
            employee.setEmergencyContactRelationship(request.getEmergencyContactRelationship());
    }

    public EmployeeResponse toResponse(Employee employee) {
        return EmployeeResponse.builder()
                .employeeId(employee.getEmployeeId())
                .fullName(employee.getFullName())
                .dateOfBirth(employee.getDateOfBirth())
                .age(employee.getAge())
                .gender(employee.getGender())
                .genderDisplay(employee.getGender() != null ? employee.getGender().getDisplayName() : null)
                .idCard(employee.getIdCard())
                .phone(employee.getPhone())
                .email(employee.getEmail())
                .address(employee.getAddress())
                .department(employee.getDepartment())
                .position(employee.getPosition())
                .roleId(employee.getRoleId())
                // .roleName(employee.getRole() != null ? employee.getRole().getRoleName() :
                // null)
                .startDate(employee.getStartDate())
                .yearsOfService(employee.getYearsOfService())
                .status(employee.getStatus())
                .statusDisplay(employee.getStatus() != null ? employee.getStatus().getDisplayName() : null)
                .bankAccount(employee.getBankAccount())
                .bankName(employee.getBankName())
                .taxCode(employee.getTaxCode())
                .socialInsuranceNumber(employee.getSocialInsuranceNumber())
                .avatarUrl(employee.getAvatarUrl())
                .emergencyContactName(employee.getEmergencyContactName())
                .emergencyContactPhone(employee.getEmergencyContactPhone())
                .emergencyContactRelationship(employee.getEmergencyContactRelationship())
                // .createdAt(employee.getCreatedAt())
                // .updatedAt(employee.getUpdatedAt())
                .build();
    }

}