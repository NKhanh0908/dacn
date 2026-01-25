package com.hrm.dacn.repositories;

import com.hrm.dacn.entities.Contracts;
import com.hrm.dacn.enums.contracts.ContractStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contracts, Long> {

    boolean existsByEmployIdAndStatus(Long employId, ContractStatus status);

    @Query(value = "SELECT c from Contracts  c where c.status = 'ACTIVE' ")
    Optional<Contracts> findActiveContract(Long employId);

}
