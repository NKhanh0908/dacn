package com.hrm.dacn.enums.Employee;

public enum EmployeeStatus {
    WORKING("Đang làm việc"),
    RESIGNED("Nghỉ việc"),
    ON_LEAVE("Tạm nghỉ"),
    PROBATION("Thử việc");

    private final String displayName;

    EmployeeStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static EmployeeStatus fromDisplayName(String displayName) {
        for (EmployeeStatus status : EmployeeStatus.values()) {
            if (status.displayName.equalsIgnoreCase(displayName)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Trạng thái không hợp lệ: " + displayName);
    }
}