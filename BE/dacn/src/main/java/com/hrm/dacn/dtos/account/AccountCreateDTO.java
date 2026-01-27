package com.hrm.dacn.dtos.account;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccountCreateDTO {

    @NotBlank(message = "Username must not be blank")
    @Size(min = 4, max = 50, message = "Username must be between 4 and 50 characters")
    private String username;

    @NotBlank(message = "Password must not be blank")
    @Size(min = 5, message = "Password must be at least 8 characters")
    private String password;

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Role is required")
    @Pattern(regexp = "ADMIN|HR|MANAGER|SUPERVISOR|EMPLOYEE", message = "Role must be one of: ADMIN, HR, MANAGER, SUPERVISOR, EMPLOYEE")
    private String role;
}
