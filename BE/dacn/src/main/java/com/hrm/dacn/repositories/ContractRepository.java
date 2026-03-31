package com.hrm.dacn.repositories;

import com.hrm.dacn.entities.Contracts;
import com.hrm.dacn.enums.contracts.ContractStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contracts, Long>, JpaSpecificationExecutor<Contracts> {

    @Query("SELECT c FROM Contracts c WHERE c.employee.employeeId = :employeeId AND c.status = 'ACTIVE'")
    Optional<Contracts> findActiveContract(@Param("employeeId") Long employeeId);
    @Query("SELECT COUNT(c) > 0 FROM Contracts c WHERE c.employee.employeeId = :employeeId AND c.status = 'ACTIVE'")
    boolean existsActiveContract(@Param("employeeId") Long employeeId);

    @Query("SELECT c FROM Contracts c WHERE c.status = 'ACTIVE' AND c.endDate IS NOT NULL AND c.endDate < CURRENT_DATE")
    List<Contracts> findExpiredActiveContracts();

}
