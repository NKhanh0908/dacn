package com.hrm.dacn.entities;

import lombok.*;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "leave_balances")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false)
    private Integer year;

    @Column(name = "annual_leave_total", nullable = false)
    private Double annualLeaveTotal;

    @Column(name = "annual_leave_used", nullable = false)
    private Double annualLeaveUsed;

    @Column(name = "annual_leave_remaining", nullable = false)
    private Double annualLeaveRemaining;

    @Column(name = "compensatory_leave_total", nullable = false)
    private Double compensatoryLeaveTotal;

    @Column(name = "compensatory_leave_used", nullable = false)
    private Double compensatoryLeaveUsed;

    @Column(name = "compensatory_leave_remaining", nullable = false)
    private Double compensatoryLeaveRemaining;

    @Column(name = "unpaid_leave_used", nullable = false)
    private Double unpaidLeaveUsed;

    @Column(name = "sick_leave_used", nullable = false)
    private Double sickLeaveUsed;

    @Column(name = "maternity_leave_used", nullable = false)
    private Double maternityLeaveUsed;

    @Column(name = "other_leave_used", nullable = false)
    private Double otherLeaveUsed;

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;

    @PrePersist
    protected void onCreate() {
        if (lastUpdated == null) {
            lastUpdated = LocalDateTime.now();
        }
        if (annualLeaveTotal == null)
            annualLeaveTotal = 0.0;
        if (annualLeaveUsed == null)
            annualLeaveUsed = 0.0;
        if (annualLeaveRemaining == null)
            annualLeaveRemaining = annualLeaveTotal;
        if (compensatoryLeaveTotal == null)
            compensatoryLeaveTotal = 0.0;
        if (compensatoryLeaveUsed == null)
            compensatoryLeaveUsed = 0.0;
        if (compensatoryLeaveRemaining == null)
            compensatoryLeaveRemaining = 0.0;
        if (unpaidLeaveUsed == null)
            unpaidLeaveUsed = 0.0;
        if (sickLeaveUsed == null)
            sickLeaveUsed = 0.0;
        if (maternityLeaveUsed == null)
            maternityLeaveUsed = 0.0;
        if (otherLeaveUsed == null)
            otherLeaveUsed = 0.0;
    }

    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
        annualLeaveRemaining = annualLeaveTotal - annualLeaveUsed;
        compensatoryLeaveRemaining = compensatoryLeaveTotal - compensatoryLeaveUsed;
    }
}