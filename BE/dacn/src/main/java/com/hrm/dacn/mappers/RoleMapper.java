package com.hrm.dacn.mappers;

import com.hrm.dacn.dtos.Employee.Request.EmployeeCreateRequest;
import com.hrm.dacn.dtos.role.request.RoleCreateRequest;
import com.hrm.dacn.dtos.role.response.RoleResponse;
import com.hrm.dacn.entities.Role;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {
    private RoleMapper() {}

    public static Role toEntity(RoleCreateRequest request) {
        return Role.builder()
                .name(request.getName())
                .description(request.getDescription() != null ? request.getDescription() : null)
                .build();
    }

    public static RoleResponse toResponse(Role role) {
        return RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .description(role.getDescription() != null ? role.getDescription() : null)
                .build();
    }
}
