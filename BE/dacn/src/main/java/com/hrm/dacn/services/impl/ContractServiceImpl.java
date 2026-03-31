package com.hrm.dacn.services.impl;

import com.hrm.dacn.dtos.PageDTO;
import com.hrm.dacn.dtos.contracts.request.*;
import com.hrm.dacn.dtos.contracts.response.ContractResponse;
import com.hrm.dacn.entities.Account;
import com.hrm.dacn.entities.Contracts;
import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.enums.contracts.ContractStatus;
import com.hrm.dacn.enums.contracts.ContractType;
import com.hrm.dacn.exceptions.CustomException;
import com.hrm.dacn.exceptions.Error;
import com.hrm.dacn.mappers.ContractMapper;
import com.hrm.dacn.repositories.CompanyRepository;
import com.hrm.dacn.repositories.ContractRepository;
import com.hrm.dacn.repositories.EmployeeRepository;
import com.hrm.dacn.services.AccountService;
import com.hrm.dacn.services.ContractService;
import com.hrm.dacn.services.EmployeeService;
import com.hrm.dacn.specifications.ContractSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;
import java.util.Optional;

@Service
public class ContractServiceImpl implements ContractService {
    private final ContractRepository contractRepository;
    private final EmployeeRepository employeeRepository;
    private final CompanyRepository companyRepository;
    private final AccountService accountService;

    public ContractServiceImpl(ContractRepository contractRepository, EmployeeRepository employeeRepository, CompanyRepository companyRepository
    , AccountService accountService) {
        this.contractRepository = contractRepository;
        this.employeeRepository = employeeRepository;
        this.companyRepository = companyRepository;
        this.accountService = accountService;
    }

    @Override
    public ContractResponse create(ContractCreateRequest request) {

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new CustomException(Error.EMPLOYEE_NOT_FOUND));

        validateCreateContract(employee.getEmployeeId(), request);

        Contracts contract = ContractMapper.toEntity(request);
        contract.setEmployee(employee);
        contract.setStatus(ContractStatus.DRAFT);

        Contracts createdContracts = contractRepository.save(contract);

        return ContractMapper.toResponse(createdContracts);
    }

    @Override
    public ContractResponse update(Long Id, ContractUpdateRequest contract) {
        Contracts foundContract = contractRepository.findById(Id)
                .orElseThrow(() -> new CustomException(Error.CONTRACT_NOT_FOUND));

//        if (!foundContract.isEditable()) {
//            throw new CustomException(Error.CONTRACT_ALREADY_SIGNED_CANNOT_EDIT);
//        }

        validateUpdateContract(foundContract, contract);

        ContractMapper.updateEntity(foundContract, contract);

        Contracts updatedContract = contractRepository.save(foundContract);

        return ContractMapper.toResponse(updatedContract);
    }

    @Override
    public ContractResponse signContract(Long contractId, ContractSignRequest request) {
        Contracts contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new CustomException(Error.CONTRACT_NOT_FOUND));

        // Validate
        if (contract.getStatus() != ContractStatus.DRAFT &&
                contract.getStatus() != ContractStatus.PENDING_SIGNATURE) {
            throw new CustomException(Error.CONTRACT_INVALID_STATUS_FOR_SIGNING);
        }

        LocalDateTime now = LocalDateTime.now();

//        // Ký bởi nhân viên
//        if ("EMPLOYEE".equals(request.getSignedBy())) {
//            contract.setSignedByEmployee(true);
//            contract.setEmployeeSignedDate(now);
//        }
//        // Ký bởi nhà tuyển dụng
//        else if ("EMPLOYER".equals(request.getSignedBy())) {
//            contract.setSignedByEmployer(true);
//            contract.setEmployerSignedDate(now);
//        }
//
//        // Nếu cả hai bên đã ký
//        if (contract.isFullySigned()) {
//            contract.setStatus(ContractStatus.ACTIVE);
//            contract.setSignedDate(LocalDate.now());
//        } else {
//            contract.setStatus(ContractStatus.PENDING_SIGNATURE);
//        }

        Contracts signedContract = contractRepository.save(contract);
        return ContractMapper.toResponse(signedContract);
    }

    @Override
    public ContractResponse sign(Long contractId) {
        Contracts contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new CustomException(Error.CONTRACT_NOT_FOUND));

        if(contract.getStatus() == ContractStatus.PENDING_SIGNATURE
                || contract.getStatus() == ContractStatus.DRAFT
        ) {
            throw new CustomException(Error.CONTRACT_INVALID_STATUS_FOR_SIGNING);
        }

        contract.setStatus(ContractStatus.ACTIVE);

        return ContractMapper.toResponse(contractRepository.save(contract));
    }

    @Override
    public ContractResponse terminateContract(Long contractId, ContractTerminateRequest request) {
        Contracts contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new CustomException(Error.CONTRACT_NOT_FOUND));

        // Validate
        if (contract.getStatus() != ContractStatus.ACTIVE) {
            throw new CustomException(Error.CONTRACT_NOT_ACTIVE);
        }

        // Cập nhật thông tin chấm dứt
        contract.setStatus(ContractStatus.TERMINATED);
        contract.setTerminationDate(request.getTerminationDate() != null ?
                request.getTerminationDate() : LocalDate.now());
        contract.setTerminationReason(request.getTerminationReason());

        Contracts terminatedContract = contractRepository.save(contract);
        return ContractMapper.toResponse(terminatedContract);
    }


    @Override
    public ContractResponse findById(Long id) {

        Contracts contracts = contractRepository.findById(id)
                .orElseThrow(() -> new CustomException(Error.CONTRACT_NOT_FOUND));

        return ContractMapper.toResponse(contracts);
    }

    @Scheduled(cron = "0 0 1 * * ?")
    @Transactional
    @Override
    public void expireContractsJob() {

        List<Contracts> expiredContracts = contractRepository.findExpiredActiveContracts();

        if (expiredContracts.isEmpty()) {
            return;
        }

        for (Contracts contract : expiredContracts) {
            contract.setStatus(ContractStatus.EXPIRED);
        }

        contractRepository.saveAll(expiredContracts);

    }

    @Override
    public PageDTO<ContractResponse> filter(ContractFilter filter, int page, int size) {
        Account account = accountService.getAccountAuth();
        Long employeeId = 0L;
        if(account.getRole().name().equals("EMPLOYEE")){
            employeeId = account.getEmployees().getEmployeeId();
        }
        filter.setEmployeeId(employeeId);

        Specification<Contracts> spec = ContractSpecification.filter(filter);
        Pageable pageable = PageRequest.of(page, size);
        Page<Contracts> contractsPage = contractRepository.findAll(spec, pageable);

        return ContractMapper.toContractPageDTO(contractsPage);
    }

    @Override
    public void delete(Long contractId) {
        Contracts contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new CustomException(Error.CONTRACT_NOT_FOUND));

//        if (contract.getStatus() != ContractStatus.DRAFT && contract.isFullySigned()) {
//            throw new CustomException(Error.CONTRACT_CANNOT_DELETE);
//        }

        contractRepository.deleteById(contractId);
    }

    /**
     * Validate khi tạo hợp đồng mới
     */
    private void validateCreateContract(Long employeeId, ContractCreateRequest request) {

        // 1. Kiểm tra nhân viên đã có hợp đồng ACTIVE chưa
        Optional<Contracts> activeContract = contractRepository.findActiveContract(employeeId);
        if (activeContract.isPresent()) {
            throw new CustomException(Error.CONTRACT_ALREADY_ACTIVATED);
        }

        // 2. Validate theo loại hợp đồng
        validateContractType(request);

        // 3. Validate ngày tháng
        validateDates(request.getStartDate(), request.getEndDate(), request.getContractType());

        // 4. Validate thử việc
        if (request.getProbationPeriod() != null && request.getProbationPeriod() > 0) {
            validateProbationPeriod(request.getProbationPeriod(), request.getContractType());
        }

        // 5. Validate lương
        if (request.getBasicSalary() == null || request.getBasicSalary().signum() <= 0) {
            throw new CustomException(Error.INVALID_SALARY);
        }
    }

    /**
     * Validate khi cập nhật hợp đồng
     */
    private void validateUpdateContract(Contracts contract, ContractUpdateRequest request) {

        // Validate ngày tháng nếu có thay đổi
        if (request.getStartDate() != null || request.getEndDate() != null) {
            LocalDate startDate = request.getStartDate() != null ?
                    request.getStartDate() : contract.getStartDate();
            LocalDate endDate = request.getEndDate() != null ?
                    request.getEndDate() : contract.getEndDate();

            validateDates(startDate, endDate, contract.getContractType());
        }
    }

    /**
     * Validate theo loại hợp đồng
     */
    private void validateContractType(ContractCreateRequest request) {

        ContractType type = request.getContractType();

        switch (type) {
            case PROBATION:
                // Hợp đồng thử việc: tối đa 60 ngày (2 tháng)
                if (request.getEndDate() == null) {
                    throw new CustomException(Error.PROBATION_CONTRACT_MUST_HAVE_END_DATE);
                }

                long days = Period.between(request.getStartDate(), request.getEndDate()).getDays();
                if (days > 60) {
                    throw new CustomException(Error.PROBATION_CONTRACT_TOO_LONG);
                }
                break;

            case FIXED_TERM:
                // Hợp đồng có thời hạn: tối đa 36 tháng (3 năm)
                if (request.getEndDate() == null) {
                    throw new CustomException(Error.FIXED_TERM_CONTRACT_MUST_HAVE_END_DATE);
                }

                int months = Period.between(request.getStartDate(), request.getEndDate()).getMonths() +
                        (Period.between(request.getStartDate(), request.getEndDate()).getYears() * 12);

                if (months > 36) {
                    throw new CustomException(Error.FIXED_TERM_CONTRACT_EXCEEDS_MAX_DURATION);
                }
                break;

            case INDEFINITE_TERM:
                // Hợp đồng vô thời hạn: không có ngày kết thúc
                if (request.getEndDate() != null) {
                    throw new CustomException(Error.INDEFINITE_CONTRACT_SHOULD_NOT_HAVE_END_DATE);
                }
                break;
        }
    }

    /**
     * Validate ngày bắt đầu và kết thúc
     */
    private void validateDates(LocalDate startDate, LocalDate endDate, ContractType contractType) {

        if (startDate == null) {
            throw new CustomException(Error.START_DATE_REQUIRED);
        }

        // Hợp đồng có thời hạn và thử việc phải có ngày kết thúc
        if (contractType != ContractType.INDEFINITE_TERM) {
            if (endDate == null) {
                throw new CustomException(Error.END_DATE_REQUIRED);
            }

            // Ngày kết thúc phải sau ngày bắt đầu
            if (!endDate.isAfter(startDate)) {
                throw new CustomException(Error.END_DATE_MUST_AFTER_START_DATE);
            }
        }
    }

    /**
     * Validate thời gian thử việc
     */
    private void validateProbationPeriod(Integer probationMonths, ContractType contractType) {

        // Hợp đồng thử việc không có thời gian thử việc riêng
        if (contractType == ContractType.PROBATION) {
            throw new CustomException(Error.PROBATION_CONTRACT_NO_PROBATION_PERIOD);
        }

        // Thời gian thử việc tối đa:
        // - 60 ngày đối với công việc yêu cầu trình độ cao đẳng trở lên
        // - 30 ngày đối với công việc yêu cầu trình độ trung cấp, công nhân kỹ thuật
        // - 6 ngày làm việc đối với công việc khác

        if (probationMonths > 2) { // Quy đổi tối đa 60 ngày ~ 2 tháng
            throw new CustomException(Error.PROBATION_PERIOD_TOO_LONG);
        }
    }

}
