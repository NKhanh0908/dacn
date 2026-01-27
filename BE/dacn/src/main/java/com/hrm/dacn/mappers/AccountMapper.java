package com.hrm.dacn.mappers;

import com.hrm.dacn.dtos.account.AccountCreateDTO;
import com.hrm.dacn.dtos.account.AccountDTO;
import com.hrm.dacn.entities.Account;
import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.enums.AccountRole;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AccountMapper {
    public AccountDTO toDTO(Account account){
        return AccountDTO.builder()
                .id(account.getId())
                .username(account.getUsername())
                .createAt(account.getCreateAt())
                .status(account.getStatus())
                .employeeId(account.getEmployees().getEmployeeId())
                .role(account.getRole().name())
                .build();
    }

    public Account convertCreateDTOToEntity(AccountCreateDTO accountCreateDTO, Employee employees){
        return Account.builder()
                .username(accountCreateDTO.getUsername())
                .createAt(LocalDateTime.now())
                .status(false)
                .employees(employees)
                .role(AccountRole.valueOf(accountCreateDTO.getRole()))
                .build();
    }

}
