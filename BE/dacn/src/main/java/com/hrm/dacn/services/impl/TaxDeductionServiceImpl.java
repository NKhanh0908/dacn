package com.hrm.dacn.services.impl;

import com.hrm.dacn.dtos.taxDeduction.TaxDeductionRequestDTO;
import com.hrm.dacn.dtos.taxDeduction.TaxDeductionResponseDTO;
import com.hrm.dacn.entities.TaxDeduction;
import com.hrm.dacn.repositories.TaxDeductionRepository;
import com.hrm.dacn.services.ITaxDeductionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaxDeductionServiceImpl implements ITaxDeductionService {

    private final TaxDeductionRepository repository;

    @Override
    public TaxDeductionResponseDTO create(TaxDeductionRequestDTO dto) {
       return null;
    }

    @Override
    public List<TaxDeductionResponseDTO> getAllByEmployee(Long employId) {
        return null;
    }

    @Override
    public TaxDeductionResponseDTO update(Long id, TaxDeductionRequestDTO dto) {
        TaxDeduction existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu giảm trừ!"));

        // Cập nhật thông tin
        existing.setDependentName(dto.getDependentName());
        existing.setAmount(dto.getAmount());
        existing.setToDate(dto.getToDate());

        return mapToResponseDTO(repository.save(existing));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public TaxDeductionResponseDTO getById(Long id) {
        return repository.findById(id)
                .map(this::mapToResponseDTO)
                .orElseThrow();
    }

    // Manual Mapper sử dụng Builder
    private TaxDeductionResponseDTO mapToResponseDTO(TaxDeduction entity) {
        String status = (entity.getToDate() != null && entity.getToDate().isBefore(LocalDate.now()))
                ? "EXPIRED" : "ACTIVE";

        return TaxDeductionResponseDTO.builder()
                .deductionId(entity.getDeductionId())
                .dependentName(entity.getDependentName())
                .relationship(entity.getRelationship())
                .amount(entity.getAmount())
                .status(status)
                .build();
    }
}