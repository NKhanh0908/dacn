package com.hrm.dacn.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrm.dacn.entities.Employee;

import jakarta.persistence.criteria.CriteriaBuilder.In;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

}
