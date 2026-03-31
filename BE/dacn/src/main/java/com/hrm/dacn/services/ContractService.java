package com.hrm.dacn.services;

import com.hrm.dacn.dtos.PageDTO;
import com.hrm.dacn.dtos.contracts.request.*;
import com.hrm.dacn.dtos.contracts.response.ContractResponse;
import org.springframework.stereotype.Service;


@Service
public interface ContractService {
    ContractResponse create(ContractCreateRequest contract);

    ContractResponse update(Long Id, ContractUpdateRequest contract);

    ContractResponse signContract(Long contractId, ContractSignRequest request);

    ContractResponse sign(Long contractId);

    ContractResponse terminateContract(Long contractId, ContractTerminateRequest request);

    ContractResponse findById(Long id);

    void expireContractsJob();

    PageDTO<ContractResponse> filter(ContractFilter filter, int page, int size);

    void delete(Long Id);


}
