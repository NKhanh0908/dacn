package com.hrm.dacn.dtos.role.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class RoleResponse {
    private Long id;

    private String name;

    private String description;
}
