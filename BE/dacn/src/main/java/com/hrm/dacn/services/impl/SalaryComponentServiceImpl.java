package com.hrm.dacn.services.impl;

import com.hrm.dacn.dtos.SalaryComponentDTO;
import com.hrm.dacn.entities.SalaryComponent;
import com.hrm.dacn.repositories.SalaryComponentRepository;
import com.hrm.dacn.services.ISalaryComponentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SalaryComponentServiceImpl implements ISalaryComponentService {

    private final SalaryComponentRepository repository;

    @Override
    public SalaryComponentDTO create(SalaryComponentDTO dto) {
        SalaryComponent entity = SalaryComponent.builder()
                .name(dto.getName())
                .type(dto.getType())
                .isTaxable(dto.getIsTaxable())
                .isInsuranceBase(dto.getIsInsuranceBase())
                .description(dto.getDescription())
                .status("ACTIVE")
                .build();
        return mapToDTO(repository.save(entity));
    }

    @Override
    public List<SalaryComponentDTO> getAllActive() {
        return repository.findByStatus("ACTIVE").stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public SalaryComponentDTO update(Long id, SalaryComponentDTO dto) {
        SalaryComponent existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cấu phần lương!"));

        existing.setName(dto.getName());
        existing.setIsTaxable(dto.getIsTaxable());
        existing.setIsInsuranceBase(dto.getIsInsuranceBase());
        existing.setDescription(dto.getDescription());

        return mapToDTO(repository.save(existing));
    }

    @Override
    public void delete(Long id) {
        // Thực hiện Soft Delete để không mất dữ liệu lịch sử ở các bảng liên quan
        SalaryComponent entity = repository.findById(id).orElseThrow();
        entity.setStatus("INACTIVE");
        repository.save(entity);
    }

    private SalaryComponentDTO mapToDTO(SalaryComponent entity) {
        return SalaryComponentDTO.builder()
                .componentId(entity.getComponentId())
                .name(entity.getName())
                .type(entity.getType())
                .isTaxable(entity.getIsTaxable())
                .isInsuranceBase(entity.getIsInsuranceBase())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .build();
    }
}