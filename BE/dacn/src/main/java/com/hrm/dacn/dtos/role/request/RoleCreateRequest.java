package com.hrm.dacn.dtos.role.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleCreateRequest {
    private String name;
    private String description;
}
