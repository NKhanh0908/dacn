package com.hrm.dacn.repositories;

import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.entities.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> , JpaSpecificationExecutor<Payroll> {
    List<Payroll> findByEmployee(Employee employee);
}