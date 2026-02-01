package com.hrm.dacn.repositories;

import com.hrm.dacn.entities.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Long> {
}
