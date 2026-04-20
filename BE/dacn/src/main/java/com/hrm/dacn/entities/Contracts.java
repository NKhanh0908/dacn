package com.hrm.dacn.entities;

import com.hrm.dacn.enums.contracts.ContractStatus;
import com.hrm.dacn.enums.contracts.ContractType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;

@Entity
@Table(name = "contracts")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Contracts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contract_id")
    private Long contractId;

    // =========================
    // THÔNG TIN CƠ BẢN HỢP ĐỒNG
    // =========================

    @Column(name = "contract_number", nullable = false, unique = true, length = 50)
    @NotBlank(message = "Contract number must not be blank")
    private String contractNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "contract_type", nullable = false, length = 50)
    @NotNull(message = "Contract type must not be null")
    private ContractType contractType;

    @Column(name = "start_date", nullable = false)
    @NotNull(message = "Start date must not be null")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate; // NULL for indefinite-term contracts

    @Column(name = "signed_date")
    private LocalDate signedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 30)
    private ContractStatus status = ContractStatus.DRAFT;

    // =========================
    // THÔNG TIN BÊN THUÊ LAO ĐỘNG
    // =========================

    @Column(name = "employer_representative", length = 100)
    private String employerRepresentative; // Người đại diện ký HĐ

    @Column(name = "employer_position", length = 100)
    private String employerPosition; // Chức vụ người ký

    // =========================
    // THÔNG TIN NGƯỜI LAO ĐỘNG
    // =========================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    // =========================
    // CÔNG VIỆC VÀ ĐỊA ĐIỂM LÀM VIỆC
    // =========================
    @Column(name = "job_title", nullable = false, length = 200)
    @NotBlank(message = "Tên công việc/chức danh không được để trống")
    private String jobTitle;

    @Column(name = "job_description", columnDefinition = "TEXT")
    private String jobDescription; // Mô tả công việc chi tiết

    @Column(name = "department", length = 100)
    private String department;

    // =========================
    // THỜI GIỜ LÀM VIỆC VÀ NGHỈ NGƠI
    // =========================

    @Column(name = "working_hours_per_day", precision = 4, scale = 2)
    @Positive(message = "Số giờ làm việc/ngày phải lớn hơn 0")
    private BigDecimal workingHoursPerDay = BigDecimal.valueOf(8);

    @Column(name = "working_days_per_month")
    @Min(value = 1, message = "Số ngày làm việc/tháng ít nhất là 1")
    @Max(value = 30, message = "Số ngày làm việc/tháng không quá 30")
    private Integer workingDaysPerMonth = 26;

    @Column(name = "overtime_policy", length = 1000)
    private String overtimePolicy; // Quy định làm thêm giờ

    @Column(name = "annual_leave_days")
    @Min(value = 0, message = "Số ngày nghỉ phép không âm")
    private Integer annualLeaveDays = 12; // Nghỉ phép năm

    @Column(name = "available_annual_leave_days")
    private Integer availableAnnualLeaveDays; 

    // =========================
    // TIỀN LƯƠNG VÀ PHỤ CẤP
    // =========================

    @Column(name = "basic_salary", nullable = false, precision = 15, scale = 2)
    @NotNull(message = "Basic salary must not be null")
    @Positive(message = "Basic salary must be greater than 0")
    private BigDecimal basicSalary;

    @Column(name = "salary_payment_method", length = 100)
    private String salaryPaymentMethod; // Hình thức trả lương: chuyển khoản, tiền mặt

    @Column(name = "salary_payment_date")
    private Integer salaryPaymentDate; // Ngày trả lương hàng tháng (1-31)

    @Column(name = "allowances", precision = 15, scale = 2)
    @PositiveOrZero(message = "Phụ cấp phải >= 0")
    private BigDecimal allowances = BigDecimal.ZERO;

    @Column(name = "allowance_details", length = 1000)
    private String allowanceDetails;
    // Chi tiết các loại phụ cấp: ăn trưa, đi lại, điện thoại, nhà ở...

    // =========================
    // CHÍNH SÁCH KHẤU TRỪ LƯƠNG
    // =========================

    /**
     * % basicSalary bị trừ cho mỗi ngày nghỉ phép vượt quá hạn mức annualLeaveDays.
     * Default: 100% (trừ nguyên 1 ngày lương).
     */
    @Column(name = "paid_leave_deduction_rate", precision = 5, scale = 2)
    @DecimalMin(value = "0.0", message = "Tỷ lệ trừ nghỉ phép không âm")
    @DecimalMax(value = "100.0", message = "Tỷ lệ trừ nghỉ phép không quá 100%")
    private BigDecimal paidLeaveDeductionRate;

    /**
     * % basicSalary bị trừ cho mỗi ngày nghỉ không phép (vắng không lý do).
     * Default: 100% (trừ nguyên 1 ngày lương).
     */
    @Column(name = "unpaid_leave_deduction_rate", precision = 5, scale = 2)
    @DecimalMin(value = "0.0", message = "Tỷ lệ trừ nghỉ không phép không âm")
    @DecimalMax(value = "100.0", message = "Tỷ lệ trừ nghỉ không phép không quá 100%")
    private BigDecimal unpaidLeaveDeductionRate;

    /**
     * % basicSalary bị trừ cho mỗi lần đi trễ.
     * Default: 0.5% basicSalary mỗi lần trễ.
     */
    @Column(name = "late_deduction_rate", precision = 5, scale = 2)
    @DecimalMin(value = "0.0", message = "Tỷ lệ trừ đi trễ không âm")
    @DecimalMax(value = "100.0", message = "Tỷ lệ trừ đi trễ không quá 100%")
    private BigDecimal lateDeductionRate;

    // =========================
    // BẢO HIỂM XÃ HỘI
    // =========================

    @Column(name = "social_insurance")
    private Boolean socialInsurance = true;

    @Column(name = "insurance_salary", precision = 15, scale = 2)
    private BigDecimal insuranceSalary; // Mức lương đóng BH


    // =========================
    // THỬ VIỆC
    // =========================

    @Column(name = "probation_period")
    @Min(value = 0, message = "Thời gian thử việc không âm")
    private Integer probationPeriod; // Số tháng thử việc

    @Column(name = "probation_salary_percentage")
    @Min(value = 0, message = "Tỷ lệ lương thử việc không âm")
    @Max(value = 100, message = "Tỷ lệ lương thử việc không quá 100%")
    private Integer probationSalaryPercentage = 85; // % lương chính thức

    @Column(name = "probation_end_date")
    private LocalDate probationEndDate;

    // =========================
    // CHẤM DỨT HỢP ĐỒNG
    // =========================
    @Column(name = "termination_date")
    private LocalDate terminationDate;

    @Column(name = "termination_reason", length = 1000)
    private String terminationReason;

    @Column(name = "notice_period_days")
    private Integer noticePeriodDays; // Thời gian báo trước khi chấm dứt

    // =========================
    // FILE HỢP ĐỒNG
    // =========================

    @Column(name = "file_url")
    private String fileUrl; // Link file PDF hợp đồng đã ký

    @Column(name = "draft_file_url")
    private String draftFileUrl; // Link file bản nháp


    // =========================
    // GHI CHÚ
    // =========================

    @Column(name = "notes", length = 2000)
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private Long createdBy; // ID người tạo

    @Column(name = "updated_by")
    private Long updatedBy; // ID người cập nhật

    // =========================
    // LIFECYCLE CALLBACKS
    // =========================

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.availableAnnualLeaveDays = this.annualLeaveDays;

        // Tính ngày kết thúc thử việc
        if (probationPeriod != null && probationPeriod > 0) {
            this.probationEndDate = startDate.plusMonths(probationPeriod);
        }

        applyDeductionRateDefaults();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();

        applyDeductionRateDefaults();
    }

    private void applyDeductionRateDefaults() {
        if (paidLeaveDeductionRate == null) {
            paidLeaveDeductionRate = new BigDecimal("100.00"); // trừ 100% lương ngày/ngày vượt phép
        }
        if (unpaidLeaveDeductionRate == null) {
            unpaidLeaveDeductionRate = new BigDecimal("100.00"); // trừ 100% lương ngày/ngày vắng
        }
        if (lateDeductionRate == null) {
            lateDeductionRate = new BigDecimal("0.50"); // trừ 0.5% basicSalary/lần trễ
        }
    }

    // =========================
    // Business logic (Transient)
    // =========================


    /**
     * Tổng thu nhập = lương cơ bản + phụ cấp
     */
    @Transient
    public BigDecimal getTotalCompensation() {
        return basicSalary.add(allowances != null ? allowances : BigDecimal.ZERO);
    }

    /**
     * Kiểm tra hợp đồng có đang hoạt động không
     */
    @Transient
    public boolean isActive() {
        LocalDate now = LocalDate.now();

        if (status != ContractStatus.ACTIVE) {
            return false;
        }

        // Chưa đến ngày bắt đầu
        if (startDate.isAfter(now)) {
            return false;
        }

        // Hợp đồng vô thời hạn
        if (contractType == ContractType.INDEFINITE_TERM) {
            return true;
        }

        // Hợp đồng có thời hạn
        return endDate != null && !endDate.isBefore(now);
    }

    /**
     * Thời hạn hợp đồng (tháng)
     */
    @Transient
    public int getContractDurationInMonths() {
        if (endDate == null) return 0;
        return Period.between(startDate, endDate).getMonths() +
                (Period.between(startDate, endDate).getYears() * 12);
    }

    /**
     * Kiểm tra hợp đồng đã hết hạn chưa
     */
    @Transient
    public boolean isExpired() {
        if (contractType == ContractType.INDEFINITE_TERM) {
            return false;
        }
        return endDate != null && endDate.isBefore(LocalDate.now());
    }

    /**
     * Kiểm tra hợp đồng đã được ký đầy đủ chưa
     */
//    @Transient
//    public boolean isFullySigned() {
//        return Boolean.TRUE.equals(signedByEmployee) &&
//                Boolean.TRUE.equals(signedByEmployer);
//    }

    /**
     * Kiểm tra có thể sửa hợp đồng không (chỉ sửa được khi chưa ký)
     */
//    @Transient
//    public boolean isEditable() {
//        return status == ContractStatus.DRAFT || !isFullySigned();
//    }

    /**
     * Kiểm tra đang trong thời gian thử việc
     */
    @Transient
    public boolean isInProbation() {
        return false;
    }

    /**
     * Số ngày còn lại đến hết hạn
     */
    @Transient
    public long getDaysUntilExpiry() {
        if (endDate == null) {
            return Long.MAX_VALUE;
        }
        return Period.between(LocalDate.now(), endDate).getDays();
    }

    // =========================
    // TÍNH LƯƠNG ĐƠN VỊ (Transient)
    // =========================

    /**
     * Lương cơ bản 1 ngày công = basicSalary / totalWorkingDays.
     */
    @Transient
    public BigDecimal getDailyBasicSalary() {
        if (workingDaysPerMonth <= 0) {
            throw new IllegalArgumentException("Tổng ngày công phải lớn hơn 0");
        }
        return basicSalary.divide(BigDecimal.valueOf(this.workingDaysPerMonth), 2, RoundingMode.HALF_UP);
    }

    @Transient
    public BigDecimal getPaidLeaveDeductionAmount(int excessLeaveDays) {
        if (excessLeaveDays <= 0) return BigDecimal.ZERO;
        return getDailyBasicSalary()
                .multiply(paidLeaveDeductionRate.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP))
                .multiply(BigDecimal.valueOf(excessLeaveDays))
                .setScale(2, RoundingMode.HALF_UP);
    }

    @Transient
    public BigDecimal getUnpaidLeaveDeductionAmount(int unpaidLeaveDays) {
        if (unpaidLeaveDays <= 0 || availableAnnualLeaveDays <= 0) {
            return BigDecimal.ZERO;
        }

        // Chỉ tính khấu trừ cho số ngày nằm trong hạn mức phép còn lại
        int daysToDeduct = Math.min(unpaidLeaveDays, availableAnnualLeaveDays);

        this.availableAnnualLeaveDays -= daysToDeduct;

        return getDailyBasicSalary()
                .multiply(unpaidLeaveDeductionRate.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP))
                .multiply(BigDecimal.valueOf(daysToDeduct))
                .setScale(2, RoundingMode.HALF_UP);
    }

    @Transient
    public BigDecimal getLateDeductionAmount(int lateTimes) {
        if (lateTimes <= 0) return BigDecimal.ZERO;
        return basicSalary
                .multiply(lateDeductionRate.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP))
                .multiply(BigDecimal.valueOf(lateTimes))
                .setScale(2, RoundingMode.HALF_UP);
    }


}
