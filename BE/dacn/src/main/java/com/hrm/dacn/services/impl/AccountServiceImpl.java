package com.hrm.dacn.services.impl;

import com.hrm.dacn.dtos.account.AccountCreateDTO;
import com.hrm.dacn.dtos.account.AccountDTO;
import com.hrm.dacn.dtos.auth.AuthenticationDTO;
import com.hrm.dacn.dtos.auth.FormLoginDTO;
import com.hrm.dacn.dtos.auth.RefreshTokenDTO;
import com.hrm.dacn.entities.Account;
import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.exceptions.CustomException;
import com.hrm.dacn.mappers.AccountMapper;
import com.hrm.dacn.repositories.AccountRepository;
import com.hrm.dacn.repositories.EmployeeRepository;
import com.hrm.dacn.services.AccountService;
import com.hrm.dacn.exceptions.Error;
import com.hrm.dacn.utils.JwtTokenUtil;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;


@Service
public class AccountServiceImpl implements AccountService {

    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;

    private final AccountRepository accountRepository;
    private final EmployeeRepository employeeRepository;

    private final AccountMapper accountMapper;


    public AccountServiceImpl(PasswordEncoder passwordEncoder, JwtTokenUtil jwtTokenUtil, AccountRepository accountRepository, EmployeeRepository employeeRepository, AccountMapper accountMapper) {
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenUtil = jwtTokenUtil;
        this.accountRepository = accountRepository;
        this.employeeRepository = employeeRepository;
        this.accountMapper = accountMapper;
    }

    @Override
    public AuthenticationDTO signIn(FormLoginDTO formLoginDTO) {
        try {
            String name = formLoginDTO.getUsername().trim().toLowerCase();

            Account account = accountRepository.findByUsername(name)
                    .orElseThrow(() -> new CustomException(Error.ACCOUNT_NOT_FOUND));

            if (account.isAccountNonLocked() && !account.isEnabled()) {
                throw new CustomException(Error.ACCOUNT_DISABLED);
            }

            try {
                String jwtToken = jwtTokenUtil.generateToken((UserDetails) account);
                String refreshToken = jwtTokenUtil.generateRefreshToken((UserDetails) account);
                return AuthenticationDTO.builder()
                        .token(jwtToken)
                        .refreshToken(refreshToken)
                        .role(account.getRole().name())
                        .build();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public AccountDTO create(AccountCreateDTO accountCreateDTO) {
        String usernameRegister = accountCreateDTO.getUsername();

        if(usernameRegister.length() < 5){throw new CustomException(Error.ACCOUNT_USERNAME_TO_SHORT);}
        if(usernameRegister.length()> 25){throw new CustomException(Error.ACCOUNT_USERNAME_TO_LONG);}
        if(accountCreateDTO.getPassword().length()<5){throw new CustomException(Error.ACCOUNT_PASSWORD_TO_SHORT);}

        if (usernameExists(accountCreateDTO.getUsername())) {
            throw new CustomException(Error.ACCOUNT_ALREADY_EXISTS);
        }

        Employee employees = employeeRepository.findById(accountCreateDTO.getEmployeeId())
                .orElseThrow(() -> new CustomException(Error.EMPLOYEE_NOT_FOUND));

        Account account = accountMapper.convertCreateDTOToEntity(accountCreateDTO, employees);
        account.setPassword(passwordEncoder.encode(accountCreateDTO.getPassword()));

        return accountMapper.toDTO(accountRepository.save(account));
    }

    @Override
    public Account getAccountAuth() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new CustomException(Error.UNAUTHORIZED);
        }

        Account account = (Account) authentication.getPrincipal();

        return account;
    }

    @Override
    public AccountDTO getAccountByEmployeeId(Integer employeeId) {
        return null;
    }

    @Override
    public AuthenticationDTO refreshToken(RefreshTokenDTO refreshTokenDTO) {
        try {
            String refreshToken = refreshTokenDTO.getRefreshToken();
            if (!jwtTokenUtil.isTokenExpired(refreshToken)) {
                throw new CustomException(Error.REFRESH_TOKEN_NOT_EXPIRED);
            }

            String username = jwtTokenUtil.extractTokenGetUsername(refreshToken);
            Account account = accountRepository.findByUsername(username)
                    .orElseThrow(() -> new CustomException(Error.ACCOUNT_NOT_FOUND));

            String jwtToken = jwtTokenUtil.generateToken((UserDetails) account);
            String newRefreshToken = jwtTokenUtil.generateRefreshToken((UserDetails) account);

            return AuthenticationDTO.builder()
                    .token(jwtToken)
                    .refreshToken(newRefreshToken)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Login processing failed", e);
        }
    }

    @Override
    public String getUsernameByEmployeeId(Integer employeeId) {
        return "";
    }

    @Override
    public void updateStatus(Employee employee, Boolean status) {
        Account account = accountRepository.findAccountsByEmployees(employee)
                .orElseThrow();

        account.setStatus(status);
        accountRepository.save(account);
    }

    private boolean usernameExists(String username) {
        return accountRepository.findByUsername(username).isPresent();
    }

}
