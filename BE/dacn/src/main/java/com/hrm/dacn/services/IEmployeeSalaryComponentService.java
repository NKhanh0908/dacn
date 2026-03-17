package com.hrm.dacn.services;

import com.hrm.dacn.dtos.employeeSalaryCompoment.EmpSalaryCompRequestDTO;
import com.hrm.dacn.dtos.employeeSalaryCompoment.EmpSalaryCompResponseDTO;

import java.util.List;

public interface IEmployeeSalaryComponentService {
    EmpSalaryCompResponseDTO assignComponent(EmpSalaryCompRequestDTO dto);
    List<EmpSalaryCompResponseDTO> getByEmployee(Long employId);
    void updateStatus(Long id, String status);
    void delete(Long id);
}