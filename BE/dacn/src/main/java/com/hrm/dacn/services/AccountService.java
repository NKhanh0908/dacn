package com.hrm.dacn.services;

import com.hrm.dacn.dtos.account.AccountCreateDTO;
import com.hrm.dacn.dtos.account.AccountDTO;
import com.hrm.dacn.dtos.auth.AuthenticationDTO;
import com.hrm.dacn.dtos.auth.FormLoginDTO;
import com.hrm.dacn.dtos.auth.RefreshTokenDTO;
import com.hrm.dacn.entities.Account;
import com.hrm.dacn.entities.Employee;
import org.springframework.stereotype.Service;

@Service
public interface AccountService {
    AuthenticationDTO signIn(FormLoginDTO formLoginDTO);

    AccountDTO create(AccountCreateDTO accountCreateDTO);

    Account getAccountAuth();

    AccountDTO getAccountByEmployeeId(Integer employeeId);

    AuthenticationDTO refreshToken(RefreshTokenDTO refreshTokenDTO);

    String getUsernameByEmployeeId(Integer employeeId);

    void updateStatus(Employee employee, Boolean status);

}
