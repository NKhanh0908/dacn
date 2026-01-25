package com.hrm.dacn.repositories;

import com.hrm.dacn.entities.Contracts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContractRepository extends JpaRepository<Contracts, Long> {
}
