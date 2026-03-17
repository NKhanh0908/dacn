package com.hrm.dacn.controllers;

import com.hrm.dacn.dtos.taxDeduction.TaxDeductionRequestDTO;
import com.hrm.dacn.dtos.taxDeduction.TaxDeductionResponseDTO;
import com.hrm.dacn.services.ITaxDeductionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tax-deductions")
@RequiredArgsConstructor
public class TaxDeductionController {

    private final ITaxDeductionService service;

    @PostMapping
    public ResponseEntity<TaxDeductionResponseDTO> create(@RequestBody TaxDeductionRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @GetMapping("/employee/{employId}")
    public ResponseEntity<List<TaxDeductionResponseDTO>> getByEmployee(@PathVariable Long employId) {
        return ResponseEntity.ok(service.getAllByEmployee(employId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaxDeductionResponseDTO> update(@PathVariable Long id, @RequestBody TaxDeductionRequestDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}