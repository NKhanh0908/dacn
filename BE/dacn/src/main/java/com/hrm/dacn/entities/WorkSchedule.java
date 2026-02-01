package com.hrm.dacn.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

@Entity
@Table(name = "work_schedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "schedule_name", nullable = false)
    private String scheduleName;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "break_start_time")
    private LocalTime breakStartTime;

    @Column(name = "break_end_time")
    private LocalTime breakEndTime;

    @Column(name = "late_tolerance_minutes")
    private Integer lateToleranceMinutes; // Số phút cho phép đi trễ

    @Column(name = "early_leave_tolerance_minutes")
    private Integer earlyLeaveToleranceMinutes; // Số phút cho phép về sớm

    @Column(name = "is_default")
    private Boolean isDefault;

    @Column(name = "is_active")
    private Boolean isActive;

    @PrePersist
    protected void onCreate() {
        if (isDefault == null) {
            isDefault = false;
        }
        if (isActive == null) {
            isActive = true;
        }
        if (lateToleranceMinutes == null) {
            lateToleranceMinutes = 0;
        }
        if (earlyLeaveToleranceMinutes == null) {
            earlyLeaveToleranceMinutes = 0;
        }
    }
}