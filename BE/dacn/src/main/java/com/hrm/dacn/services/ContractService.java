package com.hrm.dacn.services;

import com.hrm.dacn.dtos.contracts.request.ContractCreateRequest;
import com.hrm.dacn.dtos.contracts.request.ContractSignRequest;
import com.hrm.dacn.dtos.contracts.request.ContractTerminateRequest;
import com.hrm.dacn.dtos.contracts.request.ContractUpdateRequest;
import com.hrm.dacn.dtos.contracts.response.ContractResponse;
import io.micrometer.common.lang.internal.Contract;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ContractService {
    ContractResponse create(ContractCreateRequest contract);

    ContractResponse update(Long Id, ContractUpdateRequest contract);

    ContractResponse signContract(Long contractId, ContractSignRequest request);

    ContractResponse terminateContract(Long contractId, ContractTerminateRequest request);

    ContractResponse findById(Long id);

    List<Contract> findAll();

    void delete(Long Id);


}
