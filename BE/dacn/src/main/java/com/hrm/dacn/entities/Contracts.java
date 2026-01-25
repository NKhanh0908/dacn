package com.hrm.dacn.entities;

import com.hrm.dacn.enums.contracts.ContractStatus;
import com.hrm.dacn.enums.contracts.ContractType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
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

    @Column(name = "basic_salary", nullable = false, precision = 15, scale = 2)
    @NotNull(message = "Basic salary must not be null")
    @Positive(message = "Basic salary must be greater than 0")
    private BigDecimal basicSalary;

    @Column(name = "allowances", precision = 15, scale = 2)
    @PositiveOrZero(message = "Allowances must be zero or positive")
    private BigDecimal allowances = BigDecimal.ZERO;

    @Column(name = "working_hours_per_day", precision = 4, scale = 2)
    @Positive(message = "Working hours per day must be greater than 0")
    private BigDecimal workingHoursPerDay = BigDecimal.valueOf(8);

    @Column(name = "working_days_per_week")
    @Min(value = 1, message = "Working days per week must be at least 1")
    @Max(value = 7, message = "Working days per week must not exceed 7")
    private Integer workingDaysPerWeek = 5;

    @Column(name = "probation_period")
    @Min(value = 0, message = "Probation period must not be negative")
    private Integer probationPeriod; // Number of probation months

    @Column(name = "job_description", length = 500)
    private String jobDescription;

    @Column(name = "signed_date")
    private LocalDate signedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 30)
    private ContractStatus status = ContractStatus.ACTIVE;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // =========================
    // Lifecycle callbacks
    // =========================
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // =========================
    // Relationship (optional)
    // =========================
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "employ_id", insertable = false, updatable = false)
    // private Employee employee;

    // =========================
    // Business logic (Transient)
    // =========================

    /**
     * Total compensation = basic salary + allowances
     */
    @Transient
    public BigDecimal getTotalCompensation() {
        return basicSalary.add(allowances != null ? allowances : BigDecimal.ZERO);
    }

    /**
     * Check whether the contract is currently active
     */
    @Transient
    public boolean isActive() {
        if (contractType == ContractType.INDEFINITE_TERM) {
            return status == ContractStatus.ACTIVE;
        }
        return endDate != null && endDate.isAfter(LocalDate.now());
    }

    @Transient
    public int getContractDurationInMonths() {
        if (endDate == null) return 0;
        return Period.between(startDate, endDate).getMonths();
    }

    @Transient
    public boolean isExpired() {
        return endDate != null && endDate.isBefore(LocalDate.now());
    }


}
