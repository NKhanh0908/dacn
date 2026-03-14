package com.hrm.dacn.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "salary_components")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryComponent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "component_id")
    private Long componentId; // Khóa chính: ID của loại cấu phần lương

    @Column(nullable = false, length = 100)
    private String name; // Tên cấu phần (VD: Phụ cấp xăng xe, Phụ cấp ăn trưa, Thưởng KPI...)

    @Column(nullable = false, length = 50)
    private String type; // Loại (VD: EARNING - Khoản thu nhập cộng vào, DEDUCTION - Khoản khấu trừ đi)

    @Column(name = "is_taxable", nullable = false)
    private Boolean isTaxable; // Có dùng khoản này để tính Thuế TNCN không? (True = Có)

    @Column(name = "is_insurance_base", nullable = false)
    private Boolean isInsuranceBase; // Khoản này có cộng vào lương cơ sở để đóng BHXH không? (True = Có)

    @Column(length = 500)
    private String description; // Mô tả chi tiết về cấu phần lương này

    @Column(length = 30)
    @Builder.Default
    private String status = "ACTIVE"; // Trạng thái: ACTIVE (Đang sử dụng), INACTIVE (Ngừng sử dụng)
}