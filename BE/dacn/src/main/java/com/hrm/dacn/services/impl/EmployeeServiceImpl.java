package com.hrm.dacn.services.impl;

import java.util.List;
import java.util.Map;
import java.util.Set;

import com.hrm.dacn.dtos.payroll.PayrollResponseDTO;
import com.hrm.dacn.entities.Account;
import com.hrm.dacn.entities.Role;
import com.hrm.dacn.enums.Employee.EmployeeStatus;
import com.hrm.dacn.exceptions.CustomException;
import com.hrm.dacn.exceptions.Error;
import com.hrm.dacn.repositories.RoleRepository;
import com.hrm.dacn.services.AccountService;
import com.hrm.dacn.utils.CloudinaryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.query.Meta;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.hrm.dacn.dtos.ResultPagination;
import com.hrm.dacn.dtos.Employee.Request.EmployeeCreateRequest;
import com.hrm.dacn.dtos.Employee.Request.EmployeeUpdateRequest;
import com.hrm.dacn.dtos.Employee.Response.EmployeeResponse;
import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.mappers.EmployeeMapper;
import com.hrm.dacn.repositories.EmployeeRepository;
import com.hrm.dacn.services.EmployeeService;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;
    private final RoleRepository roleRepository;
    private final CloudinaryService cloudinaryService;

    private final AccountService accountService;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository, EmployeeMapper employeeMapper,
            RoleRepository roleRepository,
                               CloudinaryService cloudinaryService,
                               AccountService accountService) {
        this.employeeRepository = employeeRepository;
        this.employeeMapper = employeeMapper;
        this.roleRepository = roleRepository;
        this.cloudinaryService = cloudinaryService;
        this.accountService = accountService;
    }

    @Override
    public EmployeeResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new CustomException(Error.UNAUTHORIZED);
        }

        Account account = (Account) authentication.getPrincipal();

        return EmployeeMapper.toResponse(account.getEmployees());
    }

    @Override
    public EmployeeResponse create(EmployeeCreateRequest request) {
        Employee employee = employeeMapper.toEntity(request);

        if (request.getImage() != null && !request.getImage().isEmpty()) {
            Map<String, Object> imageUrl = cloudinaryService.uploadFile(request.getImage(), "product");
            employee.setAvatarUrl((String) imageUrl.get("url"));
        } 
        // else {
        //     employee.setAvatarUrl(null);
        // }

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow();
        employee.setRole(role);
        employeeRepository.save(employee);
        return employeeMapper.toResponse(employee);
    }

    @Override
    public EmployeeResponse update(Long id, EmployeeUpdateRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Lưu trạng thái cũ (để tối ưu nếu cần)
        EmployeeStatus oldStatus = employee.getStatus();

        employeeMapper.updateEntity(employee, request);
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            Map<String, Object> imageUrl = cloudinaryService.uploadFile(request.getImage(), "product");
            employee.setAvatarUrl((String) imageUrl.get("url"));
        }

        Employee saved = employeeRepository.save(employee);
        boolean isActive = Set.of(
                EmployeeStatus.WORKING,
                EmployeeStatus.PROBATION,
                EmployeeStatus.ON_LEAVE
        ).contains(saved.getStatus());

        if (oldStatus != saved.getStatus()) {
            accountService.updateStatus(saved, isActive);
        }

        return employeeMapper.toResponse(saved);
    }

    @Override
    public EmployeeResponse getById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return employeeMapper.toResponse(employee);
    }

    @Override
    public ResultPagination getAll(Specification<Employee> spec, Pageable pageable) {

        Page<Employee> page = employeeRepository.findAll(spec, pageable);

        ResultPagination.Meta meta = new ResultPagination.Meta();
        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(page.getTotalPages());
        meta.setTotal(page.getTotalElements());

        ResultPagination result = new ResultPagination();
        result.setMeta(meta);
        result.setData(
                EmployeeMapper.toResponseList(page.getContent()));

        return result;
    }

    @Override
    public void delete(Long id) {
        employeeRepository.deleteById(id);
    }



    @Override
    public Employee getCurrentEntity() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new CustomException(Error.UNAUTHORIZED);
        }

        Account account = (Account) authentication.getPrincipal();

        return account.getEmployees();
    }

}
