package com.hrm.dacn.controllers;

import com.hrm.dacn.dtos.payroll.PayrollRequestDTO;
import com.hrm.dacn.dtos.payroll.PayrollResponseDTO;
import com.hrm.dacn.services.PayrollService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payrolls")
@RequiredArgsConstructor
@Tag(name = "Payroll API", description = "Quản lý bảng lương nhân viên")
public class PayrollController {

    // Inject Interface để đảm bảo tính lỏng lẻo (Loose Coupling)
    private final PayrollService payrollService;
    @Operation(
            summary = "Tạo bảng lương",
            description = "Tạo bảng lương mới cho nhân viên"
    )
    @ApiResponse(responseCode = "201", description = "Tạo payroll thành công")
    @PostMapping
    public ResponseEntity<PayrollResponseDTO> createPayroll(
            @Valid @RequestBody PayrollRequestDTO requestDTO) {

        PayrollResponseDTO response = payrollService.calculateAutoPayroll(requestDTO.getEmployId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(
            summary = "Tìm kiếm payroll",
            description = "Cho phép tìm kiếm bảng lương theo employee, company, department, month và year"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lấy danh sách payroll thành công"),
            @ApiResponse(responseCode = "400", description = "Request không hợp lệ")
    })
    @GetMapping("/search")
    public ResponseEntity<List<PayrollResponseDTO>> searchPayroll(

            @Parameter(description = "ID nhân viên")
            @RequestParam(required = false) Long employeeId,

            @Parameter(description = "ID công ty")
            @RequestParam(required = false) Long companyId,

            @Parameter(description = "Phòng ban")
            @RequestParam(required = false) String department,

            @Parameter(description = "Tháng")
            @RequestParam(required = false) Integer month,

            @Parameter(description = "Năm")
            @RequestParam(required = false) Integer year
    ) {

        List<PayrollResponseDTO> result =
                payrollService.search(
                        employeeId,
                        month,
                        year,
                        companyId,
                        department
                );

        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Lấy danh sách payroll",
            description = "Lấy tất cả bảng lương"
    )
    @ApiResponse(responseCode = "200", description = "Danh sách payroll")
    @GetMapping
    public ResponseEntity<List<PayrollResponseDTO>> getAllPayrolls() {
        return ResponseEntity.ok(payrollService.findAll());
    }

    @Operation(
            summary = "Lấy payroll theo ID"
    )
    @ApiResponse(responseCode = "200", description = "Payroll tìm thấy")
    @ApiResponse(responseCode = "404", description = "Không tìm thấy payroll")
    @GetMapping("/{id}")
    public ResponseEntity<PayrollResponseDTO> getPayrollById(
            @Parameter(description = "ID của payroll")
            @PathVariable Long id) {

        return ResponseEntity.ok(payrollService.findById(id));
    }

    @Operation(summary = "Cập nhật payroll")
    @PutMapping("/{id}")
    public ResponseEntity<PayrollResponseDTO> updatePayroll(
            @PathVariable Long id,
            @Valid @RequestBody PayrollRequestDTO requestDTO) {

        return ResponseEntity.ok(payrollService.update(id, requestDTO));
    }

    @Operation(summary = "Xóa payroll")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayroll(@PathVariable Long id) {

        payrollService.delete(id);
        return ResponseEntity.noContent().build();
    }
    @Operation(
            summary = "Tính lương cho tất cả nhân viên",
            description = "Tự động tính payroll cho tất cả nhân viên đang làm việc (không bao gồm RESIGNED)"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tính lương thành công"),
            @ApiResponse(responseCode = "500", description = "Lỗi khi tính lương")
    })
    @PostMapping("/calculate-all")
    public ResponseEntity<List<PayrollResponseDTO>> calculateAllPayroll() {

        List<PayrollResponseDTO> payrolls = payrollService.calculateAllPayroll();

        return ResponseEntity.ok(payrolls);
    }
}
