package com.hrm.dacn.services;

import java.util.List;

import com.hrm.dacn.dtos.Employee.Request.EmployeeCreateRequest;
import com.hrm.dacn.dtos.Employee.Request.EmployeeUpdateRequest;
import com.hrm.dacn.dtos.Employee.Response.EmployeeResponse;

public interface EmployeeService {

    EmployeeResponse create(EmployeeCreateRequest request);

    EmployeeResponse update(Long id, EmployeeUpdateRequest request);

    EmployeeResponse getById(Long id);

    List<EmployeeResponse> getAll();

    void delete(Long id);
}