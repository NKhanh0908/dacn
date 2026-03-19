package com.hrm.dacn.repositories;

import com.hrm.dacn.entities.Account;
import com.hrm.dacn.entities.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByUsername(String username);

    @Query(value = """
            select a.username
                from account a inner join employees e
                    on a.employees_id = e.id
                where e.id = :employeeId""", nativeQuery = true)
    String getUserNameByEmployeeId(@Param("employeeId") Integer employeeId);


    Optional<Account> findAccountsByEmployees(Employee employees);

    @Query(value = """
            select a.*
                from account a inner join employees e
                    on a.employees_id = e.id
                where e.email = :email""", nativeQuery = true)
    Optional<Account> getAccountByEmail(@Param("email") String email);
}
