package com.hrm.dacn.entities;

import com.hrm.dacn.enums.Holiday.LeaveDuration;
import com.hrm.dacn.enums.Holiday.LeaveStatus;
import com.hrm.dacn.enums.Holiday.LeaveType;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_requests")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "leave_type", nullable = false, length = 50)
    private LeaveType leaveType;

    @Enumerated(EnumType.STRING)
    @Column(name = "duration", nullable = false, length = 50)
    private LeaveDuration duration;

    @Column(name = "total_days", nullable = false)
    private Double totalDays;

    @Column(length = 1000)
    private String reason;

    @Column(name = "attachment_url")
    private String attachmentUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private LeaveStatus status; // dùng LeaveStatus

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private Employee approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "reject_reason", length = 1000)
    private String rejectReason;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "attendance_generated", nullable = false)
    private Boolean attendanceGenerated;

    @PrePersist
    protected void onCreate() {
        if (status == null)
            status = LeaveStatus.PENDING;
        if (createdAt == null)
            createdAt = LocalDateTime.now();
        if (attendanceGenerated == null)
            attendanceGenerated = false;
        if (totalDays == null)
            totalDays = 0.0;
    }
}