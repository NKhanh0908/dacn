package com.hrm.dacn.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hrm.dacn.entities.WorkSchedule;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkScheduleRepository extends JpaRepository<WorkSchedule, Long> {

    // Tìm ca làm việc mặc định
    // Dùng để lấy ca cho tất cả nhân viên khi check-in/out

    Optional<WorkSchedule> findByIsDefaultTrue();

    List<WorkSchedule> findByIsActiveTrue();

    // Tìm ca làm việc theo tên

    Optional<WorkSchedule> findByScheduleName(String scheduleName);
}