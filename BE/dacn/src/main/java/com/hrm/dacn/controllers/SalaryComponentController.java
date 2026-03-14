package com.hrm.dacn.controllers;

import com.hrm.dacn.dtos.SalaryComponentDTO;
import com.hrm.dacn.services.ISalaryComponentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/salary-components")
@RequiredArgsConstructor
public class SalaryComponentController {

    private final ISalaryComponentService service;

    @PostMapping
    public ResponseEntity<SalaryComponentDTO> create(@RequestBody SalaryComponentDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<SalaryComponentDTO>> getAll() {
        return ResponseEntity.ok(service.getAllActive());
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalaryComponentDTO> update(@PathVariable Long id, @RequestBody SalaryComponentDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}