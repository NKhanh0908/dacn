package com.hrm.dacn.services;

import com.hrm.dacn.dtos.SalaryComponentDTO;

import java.util.List;

public interface ISalaryComponentService {
    SalaryComponentDTO create(SalaryComponentDTO dto);
    List<SalaryComponentDTO> getAllActive();
    SalaryComponentDTO update(Long id, SalaryComponentDTO dto);
    void delete(Long id); // Thường là Soft Delete (đổi status)
}