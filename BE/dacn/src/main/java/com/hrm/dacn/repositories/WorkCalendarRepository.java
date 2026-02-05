package com.hrm.dacn.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrm.dacn.entities.WorkCalendar;

public interface WorkCalendarRepository
        extends JpaRepository<WorkCalendar, Long> {

    Optional<WorkCalendar> findByYearAndIsActiveTrue(Integer year);

    boolean existsByYear(Integer year);
}
