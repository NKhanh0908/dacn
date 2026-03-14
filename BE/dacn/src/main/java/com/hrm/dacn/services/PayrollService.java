package com.hrm.dacn.services;

import com.hrm.dacn.dtos.payroll.PayrollRequestDTO;
import com.hrm.dacn.dtos.payroll.PayrollResponseDTO;
import com.hrm.dacn.entities.Payroll;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


    public interface PayrollService {
        PayrollResponseDTO create(PayrollRequestDTO dto);
        List<PayrollResponseDTO> findAll();
        PayrollResponseDTO findById(Long id);
        PayrollResponseDTO update(Long id, PayrollRequestDTO dto);
        void delete(Long id);
        PayrollResponseDTO calculateAutoPayroll(Long employId);

        @Transactional
        List<PayrollResponseDTO> calculateAllPayroll();

        List<PayrollResponseDTO> search(Long employeeId, Integer month, Integer year,Long companyId,String department);


    }

