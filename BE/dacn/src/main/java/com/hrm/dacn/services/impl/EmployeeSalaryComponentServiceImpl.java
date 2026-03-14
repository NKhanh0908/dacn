package com.hrm.dacn.services.impl;

import com.hrm.dacn.dtos.employeeSalaryCompoment.EmpSalaryCompRequestDTO;
import com.hrm.dacn.dtos.employeeSalaryCompoment.EmpSalaryCompResponseDTO;
import com.hrm.dacn.entities.EmployeeSalaryComponent;
import com.hrm.dacn.repositories.EmployeeSalaryComponentRepository;
import com.hrm.dacn.services.IEmployeeSalaryComponentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeSalaryComponentServiceImpl implements IEmployeeSalaryComponentService {

    private final EmployeeSalaryComponentRepository repository;
    // Giả sử bạn có Repository của SalaryComponent để lấy tên loại lương
    // private final SalaryComponentRepository componentRepo;

    @Override
    public EmpSalaryCompResponseDTO assignComponent(EmpSalaryCompRequestDTO dto) {
      return null;
    }

    @Override
    public List<EmpSalaryCompResponseDTO> getByEmployee(Long employId) {
        return null;
    }

    @Override
    public void updateStatus(Long id, String status) {
        EmployeeSalaryComponent entity = repository.findById(id).orElseThrow();
        entity.setStatus(status);
        repository.save(entity);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // Manual Mapper dùng Builder
    private EmpSalaryCompResponseDTO mapToResponseDTO(EmployeeSalaryComponent entity) {
        return null;
    }
}