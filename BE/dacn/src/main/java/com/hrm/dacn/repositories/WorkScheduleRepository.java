package com.hrm.dacn.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hrm.dacn.entities.WorkSchedule;

import java.util.Optional;

@Repository
public interface WorkScheduleRepository extends JpaRepository<WorkSchedule, Long> {

    // Tìm ca làm việc mặc định

    Optional<WorkSchedule> findByIsDefaultTrue();

    // Tìm ca làm việc theo tên

    Optional<WorkSchedule> findByScheduleName(String scheduleName);
}