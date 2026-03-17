package com.hrm.dacn.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "employ_salary_components")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeSalaryComponent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Khóa chính

    // =========================
    // LIÊN KẾT KHÓA NGOẠI
    // =========================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee; // Liên kết: Cấu phần lương này gắn cho nhân viên nào?

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "component_id", nullable = false)
    private SalaryComponent salaryComponent; // Liên kết: Đây là loại cấu phần nào? (Ăn trưa, Xăng xe...)

    // =========================
    // CHI TIẾT GÁN LƯƠNG
    // =========================
    @Column(nullable = false)
    private Double amount; // Số tiền áp dụng thực tế cho nhân viên này (VD: Phụ cấp ăn trưa 700k/tháng)

    @Column(name = "effective_from", nullable = false)
    private LocalDate effectiveFrom; // Ngày bắt đầu có hiệu lực được hưởng khoản tiền này

    @Column(name = "effective_to")
    private LocalDate effectiveTo; // Ngày hết hạn hưởng khoản tiền này (Để null nếu được hưởng vô thời hạn)

    @Column(length = 30)
    @Builder.Default
    private String status = "ACTIVE"; // Trạng thái: ACTIVE (Đang được hưởng), INACTIVE (Đã cắt/hết hạn)
}