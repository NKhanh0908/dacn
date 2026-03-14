package com.hrm.dacn.services;

import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.entities.Payroll;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.*;

public class PayrollSpecification {

    // ===============================
    // Filter theo EmployeeId
    // ===============================
    public static Specification<Payroll> hasEmployee(Long employeeId) {
        return (root, query, cb) -> {
            if (employeeId == null) return null;

            Join<Payroll, Employee> employeeJoin = root.join("employee");
            return cb.equal(employeeJoin.get("id"), employeeId);
        };
    }

    // ===============================
    // Filter theo month
    // ===============================
    public static Specification<Payroll> hasMonth(Integer month) {
        return (root, query, cb) -> {
            if (month == null) return null;
            return cb.equal(root.get("month"), month);
        };
    }

    // ===============================
    // Filter theo year
    // ===============================
    public static Specification<Payroll> hasYear(Integer year) {
        return (root, query, cb) -> {
            if (year == null) return null;
            return cb.equal(root.get("year"), year);
        };
    }

    // ===============================
    // Sort theo tháng gần nhất
    // year DESC -> month DESC
    // ===============================
    public static Specification<Payroll> sortNewest() {
        return (root, query, cb) -> {
            query.orderBy(
                    cb.desc(root.get("year")),
                    cb.desc(root.get("month"))
            );
            return null;
        };
    }

    // ===============================
    // Build full filter
    // ===============================
    public static Specification<Payroll> filter(
            Long employeeId,
            Integer month,
            Integer year
    ) {
        return Specification
                .where(hasEmployee(employeeId))
                .and(hasMonth(month))
                .and(hasYear(year))
                .and(sortNewest());
    }
}