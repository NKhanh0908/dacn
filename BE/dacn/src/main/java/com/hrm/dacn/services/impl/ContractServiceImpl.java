package com.hrm.dacn.services.impl;

import com.hrm.dacn.dtos.contracts.request.ContractCreateRequest;
import com.hrm.dacn.dtos.contracts.request.ContractUpdateRequest;
import com.hrm.dacn.dtos.contracts.response.ContractResponse;
import com.hrm.dacn.entities.Contracts;
import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.enums.contracts.ContractType;
import com.hrm.dacn.exceptions.CustomException;
import com.hrm.dacn.exceptions.Error;
import com.hrm.dacn.mappers.ContractMapper;
import com.hrm.dacn.repositories.ContractRepository;
import com.hrm.dacn.repositories.EmployeeRepository;
import com.hrm.dacn.services.ContractService;
import com.hrm.dacn.services.EmployeeService;
import io.micrometer.common.lang.internal.Contract;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContractServiceImpl implements ContractService {
    private final ContractRepository contractRepository;
    private final EmployeeRepository employeeRepository;

    public ContractServiceImpl(ContractRepository contractRepository, EmployeeRepository employeeRepository) {
        this.contractRepository = contractRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public ContractResponse create(ContractCreateRequest contract) {

        Employee employee = employeeRepository.findById(contract.getEmployeeId())
                .orElseThrow(() -> new CustomException(Error.EMPLOYEE_NOT_FOUND));

        validateCreateContract(employee.getEmployeeId(), contract);

        Contracts contracts = ContractMapper.toEntity(contract);

        Contracts createdContracts = contractRepository.save(contracts);

        return ContractMapper.toResponse(createdContracts);
    }

    @Override
    public ContractResponse update(Long Id, ContractUpdateRequest contract) {
        Contracts foundContract = contractRepository.findById(Id)
                .orElseThrow(() -> new CustomException(Error.CONTRACT_NOT_FOUND));

        ContractMapper.updateEntity(foundContract, contract);

        Contracts updatedContract = contractRepository.save(foundContract);

        return ContractMapper.toResponse(updatedContract);
    }

    @Override
    public ContractResponse findById(Long id) {

        Contracts contracts = contractRepository.findById(id)
                .orElseThrow(() -> new CustomException(Error.CONTRACT_NOT_FOUND));

        return ContractMapper.toResponse(contracts);
    }

    @Override
    public List<Contract> findAll() {
        return List.of();
    }

    @Override
    public void delete(Long Id) {

        Contracts contracts = contractRepository.findById(Id)
                        .orElseThrow(() -> new CustomException(Error.CONTRACT_NOT_FOUND));

        contractRepository.deleteById(Id);
    }

    private void validateCreateContract(Long employeeId, ContractCreateRequest request) {

        Optional<Contracts> activeContract =
                contractRepository.findActiveContract(employeeId);

        if (activeContract.isPresent()) {
            throw new CustomException(Error.CONTRACT_ALREADY_ACTIVATED);
        }

        if (request.getContractType() == ContractType.FIXED_TERM) {
            if (request.getEndDate() == null ||
                    !request.getEndDate().isAfter(request.getStartDate())) {
                throw new CustomException(Error.CONTRACT_DATE_INVALID);
            }
        }

        if (request.getContractType() == ContractType.INDEFINITE_TERM &&
                request.getEndDate() != null) {

        }
    }

}
