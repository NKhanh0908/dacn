package com.hrm.dacn.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "monthly_attendance_summary")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlySummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(name = "month", nullable = false)
    private Integer month;

    @Column(name = "total_working_days")
    private Integer totalWorkingDays;

    @Column(name = "total_present_days")
    private Integer totalPresentDays;

    @Column(name = "total_absent_days")
    private Integer totalAbsentDays;

    @Column(name = "total_late_days")
    private Integer totalLateDays;

    @Column(name = "total_late_minutes")
    private Integer totalLateMinutes;

    @Column(name = "total_early_leave_days")
    private Integer totalEarlyLeaveDays;

    @Column(name = "total_early_leave_minutes")
    private Integer totalEarlyLeaveMinutes;

    @Column(name = "total_overtime_hours")
    private Double totalOvertimeHours;

    @Column(name = "total_leave_days")
    private Integer totalLeaveDays;

    @Column(name = "total_business_trip_days")
    private Integer totalBusinessTripDays;

    @Column(name = "total_work_hours")
    private Double totalWorkHours;

    @Column(name = "is_finalized")
    private Boolean isFinalized;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "finalized_by")
    private Employee finalizedBy;

    @Column(name = "finalized_at")
    private LocalDateTime finalizedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isFinalized == null) {
            isFinalized = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
