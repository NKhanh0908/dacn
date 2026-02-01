package com.hrm.dacn.specifications;

import com.hrm.dacn.dtos.contracts.request.ContractFilter;
import com.hrm.dacn.entities.Contracts;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ContractSpecification {
    public static Specification<Contracts> filter(ContractFilter filter) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (filter == null) {
                return cb.conjunction();
            }

            // =========================
            // CONTRACT NUMBER (LIKE)
            // =========================
            if (filter.getContractNumber() != null && !filter.getContractNumber().isBlank()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("contractNumber")),
                                "%" + filter.getContractNumber().toLowerCase() + "%"
                        )
                );
            }

            // =========================
            // CONTRACT TYPE
            // =========================
            if (filter.getContractType() != null) {
                predicates.add(
                        cb.equal(root.get("contractType"), filter.getContractType())
                );
            }

            // =========================
            // CONTRACT STATUS
            // =========================
            if (filter.getContractStatus() != null) {
                predicates.add(
                        cb.equal(root.get("status"), filter.getContractStatus())
                );
            }

            // =========================
            // EMPLOYEE ID (JOIN)
            // =========================
            if (filter.getEmployeeId() != null) {
                Join<Object, Object> employeeJoin =
                        root.join("employee", JoinType.INNER);

                predicates.add(
                        cb.equal(employeeJoin.get("employeeId"), filter.getEmployeeId())
                );
            }

            // =========================
            // CREATED DATE FROM
            // =========================
            if (filter.getStartDate() != null) {
                predicates.add(
                        cb.greaterThanOrEqualTo(
                                root.get("createdAt"),
                                filter.getStartDate()
                        )
                );
            }

            // =========================
            // CREATED DATE TO
            // =========================
            if (filter.getEndDate() != null) {
                predicates.add(
                        cb.lessThanOrEqualTo(
                                root.get("createdAt"),
                                filter.getEndDate()
                        )
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
