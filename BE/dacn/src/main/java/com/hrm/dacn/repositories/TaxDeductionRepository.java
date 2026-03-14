package com.hrm.dacn.repositories;

import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.entities.TaxDeduction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaxDeductionRepository extends JpaRepository<TaxDeduction, Long> {
    // Tìm danh sách giảm trừ của 1 nhân viên cụ thể
    List<TaxDeduction> findByEmployee(Employee employee);

    // Tìm các giảm trừ đang còn hiệu lực

}