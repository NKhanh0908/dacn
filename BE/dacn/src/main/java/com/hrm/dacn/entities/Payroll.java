package com.hrm.dacn.entities;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payrolls")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payroll_id")
    private Long payrollId; // Khóa chính: ID của bảng lương

    // =========================
    // THÔNG TIN CHUNG
    // =========================

    // Liên kết Nhiều-Một: Nhiều bảng lương có thể thuộc về 1 nhân viên
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee; // Thông tin nhân viên nhận lương

    @Column(nullable = false)
    private Integer month; // Tháng tính lương (VD: 3)

    @Column(nullable = false)
    private Integer year;  // Năm tính lương (VD: 2026)

    // =========================
    // CÁC KHOẢN THU NHẬP (EARNINGS)
    // =========================

    @Column(name = "basic_salary")
    private Double basicSalary; // Lương cơ bản (Lấy từ hợp đồng, có thể đã nhân % thử việc)

    @Column(name = "overtime_pay")
    private Double overtimePay; // Tiền lương làm thêm giờ (OT)

    @Column(name = "allowances")
    private Double allowances; // Tổng tiền các khoản phụ cấp (Xăng xe, ăn trưa...)

    @Column(name = "bonus")
    private Double bonus; // Tiền thưởng (Thưởng dự án, thưởng lễ tết...)

    @Column(name = "other_income")
    private Double otherIncome; // Các khoản thu nhập khác

    // =========================
    // CÁC KHOẢN KHẤU TRỪ & BẢO HIỂM (DEDUCTIONS)
    // =========================

    @Column(name = "social_insurance")
    private Double socialInsurance; // Tiền đóng Bảo hiểm xã hội (BHXH) - VD: 8%

    @Column(name = "health_insurance")
    private Double healthInsurance; // Tiền đóng Bảo hiểm y tế (BHYT) - VD: 1.5%

    @Column(name = "unemployment_insurance")
    private Double unemploymentInsurance; // Tiền đóng Bảo hiểm thất nghiệp (BHTN) - VD: 1%

    @Column(name = "personal_income_tax")
    private Double personalIncomeTax; // Thuế thu nhập cá nhân (TNCN) - Sau khi đã tính các mức giảm trừ

    @Column(name = "total_deductions")
    private Double totalDeductions; // Tổng các khoản khấu trừ (Bảo hiểm + Thuế + Phạt...)

    // =========================
    // TỔNG KẾT
    // =========================

    @Column(name = "net_salary")
    private Double netSalary; // Lương thực nhận = (Tổng thu nhập) - (Tổng khấu trừ)

    @Column(name = "status", length = 30)
    private String status; // Trạng thái bảng lương (VD: DRAFT: Bản nháp, PENDING: Chờ duyệt, PAID: Đã thanh toán)

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now(); // Thời gian hệ thống tạo bản ghi lương này
}