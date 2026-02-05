package com.hrm.dacn.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hrm.dacn.entities.Holiday;
import com.hrm.dacn.enums.Holiday.HolidayType;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HolidayRepository extends JpaRepository<Holiday, Long> {

    // Tìm ngày lễ theo khoảng thời gian
    List<Holiday> findByStartDateBetween(LocalDate start, LocalDate end);

    // Tìm ngày lễ theo loại
    List<Holiday> findByType(HolidayType type);

    // Tìm ngày lễ có trả lương
    List<Holiday> findByIsPaidTrue();

    // Tìm kiếm phức tạp với @Query
    @Query("SELECT h FROM Holiday h WHERE " +
            "(:name IS NULL OR LOWER(h.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:type IS NULL OR h.type = :type) AND " +
            "(:isPaid IS NULL OR h.isPaid = :isPaid) AND " +
            "(:fromDate IS NULL OR h.startDate >= :fromDate) AND " +
            "(:toDate IS NULL OR h.endDate <= :toDate)")
    Page<Holiday> searchHolidays(
            @Param("name") String name,
            @Param("type") HolidayType type,
            @Param("isPaid") Boolean isPaid,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate,
            Pageable pageable);

    // Kiểm tra trùng ngày lễ
    @Query("SELECT COUNT(h) > 0 FROM Holiday h WHERE " +
            "h.startDate <= :endDate AND h.endDate >= :startDate AND " +
            "(h.id <> :excludeId OR :excludeId IS NULL)")
    boolean existsByDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("excludeId") Long excludeId);

    // Lấy ngày lễ trong tháng
    @Query("SELECT h FROM Holiday h WHERE " +
            "YEAR(h.startDate) = :year AND MONTH(h.startDate) = :month")
    List<Holiday> findByYearAndMonth(@Param("year") int year,
            @Param("month") int month);
}
