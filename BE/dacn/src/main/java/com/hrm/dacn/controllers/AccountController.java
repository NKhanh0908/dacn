package com.hrm.dacn.controllers;

import com.hrm.dacn.dtos.APIResponse;
import com.hrm.dacn.dtos.account.AccountCreateDTO;
import com.hrm.dacn.dtos.account.AccountDTO;
import com.hrm.dacn.dtos.auth.AuthenticationDTO;
import com.hrm.dacn.dtos.auth.FormLoginDTO;
import com.hrm.dacn.dtos.auth.RefreshTokenDTO;
import com.hrm.dacn.services.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
@Tag(name = "Account Controller", description = "Manage user accounts and authentication")
public class AccountController {
    private final AccountService accountService;

    @PostMapping("/sign-in")
    @Operation(
            summary = "Sign In",
            description = "Authenticate user and return access information",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "User login credentials",
                    required = true,
                    content = @Content(schema = @Schema(implementation = FormLoginDTO.class))
            ),
            responses = {
                    @ApiResponse(responseCode = "200",
                            description = "Authentication successful",
                            content = @Content(schema = @Schema(implementation = AuthenticationDTO.class))
                    ),
                    @ApiResponse(responseCode = "401", description = "Invalid credentials")
            }
    )
    public ResponseEntity<APIResponse<AuthenticationDTO>> signIn(@RequestBody FormLoginDTO formLoginDTO, HttpServletRequest request) {
        AuthenticationDTO authDTO = accountService.signIn(formLoginDTO);
        return ResponseEntity.ok(new APIResponse<>(
                true,
                "Authentication successful",
                authDTO,
                null,
                request.getRequestURI()));
    }

    @PostMapping
    @Operation(
            summary = "Create Account",
            description = "Creates a new user account in the system",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Account creation information",
                    required = true,
                    content = @Content(schema = @Schema(implementation = AccountCreateDTO.class))
            ),
            responses = {
                    @ApiResponse(responseCode = "201",
                            description = "Account created successfully",
                            content = @Content(schema = @Schema(implementation = AccountDTO.class))
                    )
            }
    )
    public ResponseEntity<APIResponse<AccountDTO>> create(@RequestBody AccountCreateDTO accountCreateDTO, HttpServletRequest request) {
        AccountDTO accountDTO = accountService.create(accountCreateDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new APIResponse<>(
                        true,
                        "Account created successfully",
                        accountDTO,
                        null,
                        request.getRequestURI()));
    }


    @PostMapping("/refresh-token")
    @Operation(
            summary = "Refresh Token",
            description = "Refreshes the authentication token",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Refresh token data",
                    required = true,
                    content = @Content(schema = @Schema(implementation = RefreshTokenDTO.class))
            ),
            responses = {
                    @ApiResponse(responseCode = "200",
                            description = "Token refreshed successfully",
                            content = @Content(schema = @Schema(implementation = AuthenticationDTO.class))
                    ),
                    @ApiResponse(responseCode = "401", description = "Invalid refresh token")
            }
    )
    public ResponseEntity<APIResponse<AuthenticationDTO>> refreshToken(
            @Valid @RequestBody RefreshTokenDTO refreshTokenDTO,
            HttpServletRequest request) {

        AuthenticationDTO authDTO = accountService.refreshToken(refreshTokenDTO);

        return ResponseEntity.ok(new APIResponse<>(
                true,
                "Token refreshed successfully",
                authDTO,
                null,
                request.getRequestURI()
        ));
    }

}
