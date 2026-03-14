package com.hrm.dacn.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tax_deductions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaxDeduction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "deduction_id")
    private Long deductionId; // Khóa chính

    // =========================
    // LIÊN KẾT NHÂN VIÊN
    // =========================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee; // Liên kết: Nhân viên nào được hưởng khoản giảm trừ này

    // =========================
    // THÔNG TIN NGƯỜI PHỤ THUỘC
    // =========================
    @Column(name = "dependent_name", nullable = false, length = 100)
    private String dependentName; // Họ và tên người phụ thuộc (VD: Nguyễn Văn A)

    @Column(length = 50)
    private String relationship; // Mối quan hệ với nhân viên (VD: Con ruột, Bố/Mẹ đẻ...)

    @Column(name = "id_card", length = 20)
    private String idCard; // Số CCCD/CMND hoặc mã số thuế của người phụ thuộc

    // =========================
    // THỜI HẠN & MỨC GIẢM TRỪ
    // =========================
    @Column(name = "from_date", nullable = false)
    private LocalDate fromDate; // Tháng/Năm bắt đầu tính giảm trừ

    @Column(name = "to_date")
    private LocalDate toDate; // Tháng/Năm kết thúc giảm trừ (Con cái đủ 18 tuổi chẳng hạn)

    @Column(nullable = false)
    private Double amount; // Số tiền được giảm trừ mỗi tháng (Quy định hiện hành là 4,400,000 VNĐ/người)

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now(); // Thời điểm tạo bản ghi
}