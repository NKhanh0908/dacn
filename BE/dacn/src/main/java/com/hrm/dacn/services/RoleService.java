package com.hrm.dacn.services;

import com.hrm.dacn.dtos.role.request.RoleCreateRequest;
import com.hrm.dacn.dtos.role.response.RoleResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RoleService {
    RoleResponse create(RoleCreateRequest request);

    RoleResponse findById(Long id);

    List<RoleResponse> findAll();


}
