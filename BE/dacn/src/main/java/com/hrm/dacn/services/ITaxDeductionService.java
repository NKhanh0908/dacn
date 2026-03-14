package com.hrm.dacn.services;

import com.hrm.dacn.dtos.taxDeduction.TaxDeductionRequestDTO;
import com.hrm.dacn.dtos.taxDeduction.TaxDeductionResponseDTO;

import java.util.List;

public interface ITaxDeductionService {
    TaxDeductionResponseDTO create(TaxDeductionRequestDTO dto);
    List<TaxDeductionResponseDTO> getAllByEmployee(Long employId);
    TaxDeductionResponseDTO update(Long id, TaxDeductionRequestDTO dto);
    void delete(Long id);
    TaxDeductionResponseDTO getById(Long id);
}