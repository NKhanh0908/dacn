package com.hrm.dacn.services;

import com.hrm.dacn.entities.Company;
import com.hrm.dacn.entities.Contracts;
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
    // Filter theo Company
    // ===============================
    public static Specification<Payroll> hasCompany(Long companyId) {
        return (root, query, cb) -> {
            if (companyId == null) return null;

            Subquery<Long> subquery = query.subquery(Long.class);
            Root<Contracts> contractRoot = subquery.from(Contracts.class);

            subquery.select(contractRoot.get("employee").get("employeeId"))
                    .where(cb.and(
                            cb.equal(contractRoot.get("company").get("companyId"), companyId),
                            cb.equal(contractRoot.get("status"), com.hrm.dacn.enums.contracts.ContractStatus.ACTIVE)
                    ));

            return cb.in(root.get("employee").get("employeeId")).value(subquery);
        };
    }

    // ===============================
    // Filter theo Department
    // ===============================
    public static Specification<Payroll> hasDepartment(String department) {
        return (root, query, cb) -> {
            if (department == null || department.isBlank()) return null;

            // Tạo một Subquery để tìm kiếm trong bảng Contracts
            Subquery<Long> subquery = query.subquery(Long.class);
            Root<Contracts> contractRoot = subquery.from(Contracts.class);

            // Lấy ra EmployeeId từ những hợp đồng thỏa mãn điều kiện phòng ban
            subquery.select(contractRoot.get("employee").get("employeeId"))
                    .where(cb.and(
                            cb.like(cb.lower(contractRoot.get("department")), "%" + department.toLowerCase() + "%"),
                            cb.equal(contractRoot.get("status"), com.hrm.dacn.enums.contracts.ContractStatus.ACTIVE)
                    ));

            // So khớp: Employee của Payroll phải nằm trong danh sách EmployeeId có hợp đồng thỏa mãn ở trên
            return cb.in(root.get("employee").get("employeeId")).value(subquery);
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
            Integer year,
            Long companyId,
            String department
    ) {
        return Specification
                .where(hasEmployee(employeeId))
                .and(hasMonth(month))
                .and(hasYear(year))
                .and(hasCompany(companyId))
                .and(hasDepartment(department))
                .and(sortNewest());
    }
}