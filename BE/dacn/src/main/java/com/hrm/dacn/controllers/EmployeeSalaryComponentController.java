package com.hrm.dacn.controllers;

import com.hrm.dacn.dtos.employeeSalaryCompoment.EmpSalaryCompRequestDTO;
import com.hrm.dacn.dtos.employeeSalaryCompoment.EmpSalaryCompResponseDTO;
import com.hrm.dacn.services.IEmployeeSalaryComponentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/employee-salary-components")
@RequiredArgsConstructor
public class EmployeeSalaryComponentController {

    private final IEmployeeSalaryComponentService service;

    @PostMapping("/assign")
    public ResponseEntity<EmpSalaryCompResponseDTO> assign(@RequestBody EmpSalaryCompRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.assignComponent(dto));
    }

    @GetMapping("/employee/{employId}")
    public ResponseEntity<List<EmpSalaryCompResponseDTO>> getByEmployee(@PathVariable Long employId) {
        return ResponseEntity.ok(service.getByEmployee(employId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable Long id, @RequestParam String status) {
        service.updateStatus(id, status);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}