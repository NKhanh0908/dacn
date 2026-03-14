package com.hrm.dacn.repositories;

import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.entities.EmployeeSalaryComponent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeSalaryComponentRepository extends JpaRepository<EmployeeSalaryComponent, Long> {

    // Tìm tất cả các khoản lương của 1 nhân viên
    List<EmployeeSalaryComponent> findByEmployee(Employee employee);


}