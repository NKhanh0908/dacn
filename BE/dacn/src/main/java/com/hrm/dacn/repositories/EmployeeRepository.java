package com.hrm.dacn.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrm.dacn.entities.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

}
