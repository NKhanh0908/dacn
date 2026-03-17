package com.hrm.dacn.services;

import java.util.List;

import com.hrm.dacn.dtos.ResultPagination;
import com.hrm.dacn.dtos.Employee.Request.EmployeeCreateRequest;
import com.hrm.dacn.dtos.Employee.Request.EmployeeUpdateRequest;
import com.hrm.dacn.dtos.Employee.Response.EmployeeResponse;
import com.hrm.dacn.dtos.payroll.PayrollResponseDTO;
import com.hrm.dacn.entities.Employee;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public interface EmployeeService {

    EmployeeResponse getCurrentUser();

    Employee getCurrentEntity();

    EmployeeResponse create(EmployeeCreateRequest request);

    EmployeeResponse update(Long id, EmployeeUpdateRequest request);

    EmployeeResponse getById(Long id);

    ResultPagination getAll(Specification<Employee> spec, Pageable pageable);

    void delete(Long id);


}