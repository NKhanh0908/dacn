package com.hrm.dacn.entities;

import java.time.DayOfWeek;
import java.util.Set;

import com.hrm.dacn.enums.Holiday.HolidayPolicy;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "work_calendars", uniqueConstraints = @UniqueConstraint(columnNames = { "year" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkCalendar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Năm áp dụng (VD: 2026)
     * → mỗi năm chỉ có 1 lịch
     */
    @Column(nullable = false)
    private Integer year;

    /**
     * Tên lịch (VD: Lịch làm việc 2026)
     */
    @Column(nullable = false)
    private String name;

    /**
     * Các THỨ được coi là ngày làm việc
     * VD: MONDAY → FRIDAY
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "work_calendar_working_days", joinColumns = @JoinColumn(name = "calendar_id"))
    @Column(name = "day_of_week")
    private Set<DayOfWeek> workingDays;

    /**
     * Chính sách ngày lễ
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HolidayPolicy holidayPolicy;

    /**
     * Lịch đang được sử dụng hay không
     * → chỉ 1 lịch active cho mỗi năm
     */
    @Column(nullable = false)
    private Boolean isActive;

    /**
     * Ghi chú
     */
    private String description;
}
