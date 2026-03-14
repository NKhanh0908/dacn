package com.hrm.dacn.specifications;

import com.hrm.dacn.dtos.contracts.request.ContractFilter;
import com.hrm.dacn.entities.Contracts;
import com.hrm.dacn.enums.contracts.ContractStatus;
import com.hrm.dacn.enums.contracts.ContractType;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
public class ContractSpecification {

    public static Specification<Contracts> filter(ContractFilter filter) {

        return (root, query, cb) -> {

            if (filter == null) {
                return cb.conjunction();
            }

            List<Predicate> predicates = new ArrayList<>();

            // =========================
            // CONTRACT NUMBER (LIKE - case insensitive)
            // =========================
            if (filter.getContractNumber() != null &&
                    !filter.getContractNumber().trim().isEmpty()) {

                String keyword = filter.getContractNumber().trim().toLowerCase();

                predicates.add(
                        cb.like(
                                cb.lower(root.get("contractNumber")),
                                "%" + keyword + "%"
                        )
                );
            }

            // =========================
            // CONTRACT TYPE
            // =========================
            if (filter.getContractType() != null &&
                    !filter.getContractType().isBlank()) {

                predicates.add(
                        cb.equal(
                                root.get("contractType"),
                                ContractType.valueOf(filter.getContractType())
                        )
                );
            }

            // =========================
            // CONTRACT STATUS
            // =========================
            if (filter.getContractStatus() != null &&
            !filter.getContractStatus().isBlank()) {
                predicates.add(
                        cb.equal(root.get("status"), ContractStatus.valueOf(filter.getContractStatus()))
                );
            }

            // =========================
            // EMPLOYEE ID (ignore 0 or null)
            // =========================
            if (filter.getEmployeeId() != null &&
                    filter.getEmployeeId() > 0) {

                Join<Object, Object> employeeJoin =
                        root.join("employee", JoinType.INNER);

                predicates.add(
                        cb.equal(employeeJoin.get("employeeId"),
                                filter.getEmployeeId())
                );
            }

            // =========================
            // START DATE
            // =========================
            if (filter.getStartDate() != null) {
                predicates.add(
                        cb.greaterThanOrEqualTo(
                                root.get("startDate"),
                                filter.getStartDate()
                        )
                );
            }

            // =========================
            // END DATE
            // =========================
            if (filter.getEndDate() != null) {
                predicates.add(
                        cb.lessThanOrEqualTo(
                                root.get("startDate"), // nếu bạn filter theo startDate range
                                filter.getEndDate()
                        )
                );
            }

            return predicates.isEmpty()
                    ? cb.conjunction()
                    : cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}