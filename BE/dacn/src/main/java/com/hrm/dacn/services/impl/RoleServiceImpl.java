package com.hrm.dacn.services.impl;

import com.hrm.dacn.dtos.role.request.RoleCreateRequest;
import com.hrm.dacn.dtos.role.response.RoleResponse;
import com.hrm.dacn.entities.Role;
import com.hrm.dacn.mappers.RoleMapper;
import com.hrm.dacn.repositories.RoleRepository;
import com.hrm.dacn.services.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    private final RoleRepository roleRepository;


    @Override
    public RoleResponse create(RoleCreateRequest request) {

        Role role = RoleMapper.toEntity(request);
        roleRepository.save(role);

        return RoleMapper.toResponse(role);
    }

    @Override
    public RoleResponse findById(Long id) {
        return RoleMapper.toResponse(roleRepository.findById(id)
                .orElseThrow());
    }

    @Override
    public List<RoleResponse> findAll() {
        return roleRepository.findAll().stream()
                .map(RoleMapper::toResponse)
                .collect(Collectors.toList());
    }


}
