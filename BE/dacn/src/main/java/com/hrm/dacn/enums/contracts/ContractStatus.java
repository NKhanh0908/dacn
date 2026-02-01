package com.hrm.dacn.enums.contracts;

import lombok.Getter;

/**
 * Trạng thái hợp đồng lao động
 */
@Getter
public enum ContractStatus {

    DRAFT("Bản nháp - Chưa ký"),
    PENDING_SIGNATURE("Chờ ký kết"),
    ACTIVE("Đang hiệu lực"),
    EXPIRED("Hết hạn"),
    TERMINATED("Đã chấm dứt"),
    CANCELLED("Đã hủy");

    private final String description;

    ContractStatus(String description) {
        this.description = description;
    }

}