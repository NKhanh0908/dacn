package com.hrm.dacn.entities;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.beans.Transient;
import java.time.LocalTime;

import com.hrm.dacn.enums.Employee.EmployeeStatus;
import com.hrm.dacn.enums.Employee.EmployeeType;
import com.hrm.dacn.enums.Employee.Gender;
import com.hrm.dacn.enums.Holiday.HolidayType;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "holidays")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Holiday {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private HolidayType type;

    @Column(name = "is_paid", nullable = false)
    private Boolean isPaid;

    @Column(name = "salary_multiplier", nullable = false)
    private Double salaryMultiplier;

    @Column(length = 500)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private Employee createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (endDate == null) {
            endDate = startDate;
        }
        if (isPaid == null) {
            isPaid = true;
        }
        if (salaryMultiplier == null) {
            salaryMultiplier = 2.0;
        }
    }
}
