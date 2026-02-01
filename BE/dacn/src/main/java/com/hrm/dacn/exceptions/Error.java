package com.hrm.dacn.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum Error {
    // Client Error
    NOT_FOUND(404, "Resource not found", HttpStatus.NOT_FOUND),
    BAD_REQUEST(400, "Bad request", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(401, "Unauthorized", HttpStatus.UNAUTHORIZED),
    FORBIDDEN(403, "Forbidden", HttpStatus.FORBIDDEN),
    CONFLICT(409, "Conflict", HttpStatus.CONFLICT),
    METHOD_NOT_ALLOWED(405, "Method not allowed", HttpStatus.METHOD_NOT_ALLOWED),
    TOO_MANY_REQUESTS(429, "Too many requests", HttpStatus.TOO_MANY_REQUESTS),
    INVALID_ENUM(422, "Invalid enum", HttpStatus.BAD_REQUEST),

    // Server Error
    UNCATEGORIZED_EXCEPTION(9999, "Unclassified error", HttpStatus.INTERNAL_SERVER_ERROR),
    // Database Error
    DATABASE_ACCESS_ERROR(9998, "Database access error", HttpStatus.INTERNAL_SERVER_ERROR),
    DUPLICATE_KEY(9996, "Duplicate key found", HttpStatus.CONFLICT),
    EMPTY_RESULT(9995, "No result found", HttpStatus.NOT_FOUND),
    NON_UNIQUE_RESULT(9994, "Non-unique result found", HttpStatus.CONFLICT),

    // Account-related errors
    ACCOUNT_NOT_FOUND(1001, "Account not found", HttpStatus.NOT_FOUND),
    ACCOUNT_ALREADY_EXISTS(1002, "Account already exists", HttpStatus.CONFLICT),
    ACCOUNT_UNABLE_TO_SAVE(1003, "Unable to save account", HttpStatus.INTERNAL_SERVER_ERROR),
    ACCOUNT_UNABLE_TO_UPDATE(1004, "Unable to update account", HttpStatus.INTERNAL_SERVER_ERROR),
    ACCOUNT_UNABLE_TO_DELETE(1005, "Unable to delete account", HttpStatus.INTERNAL_SERVER_ERROR),
    ACCOUNT_INVALID_USERNAME(1006, "Invalid username", HttpStatus.BAD_REQUEST),
    ACCOUNT_INVALID_PASSWORD(1007, "Invalid password", HttpStatus.BAD_REQUEST),
    ACCOUNT_LOCKED(1008, "Account is locked", HttpStatus.FORBIDDEN),
    ACCOUNT_USERNAME_TO_SHORT(1008, "Username account to short", HttpStatus.BAD_REQUEST),
    ACCOUNT_USERNAME_TO_LONG(1008, "Username account to long", HttpStatus.BAD_REQUEST),
    ACCOUNT_PASSWORD_TO_SHORT(1008, "Password account to short", HttpStatus.BAD_REQUEST),
    ACCOUNT_LOCKED_TEMPORARILY(1009, "Account is temporarily locked due to too many failed login attempts",
            HttpStatus.FORBIDDEN),
    PASSWORD_RESET_FAILED(1010, "Password reset failed", HttpStatus.INTERNAL_SERVER_ERROR),
    PASSWORD_RESET_INVALID_REQUEST(1011, "Invalid password reset request", HttpStatus.BAD_REQUEST),
    ACCOUNT_EMAIL_ALREADY_EXISTS(1012, "Email already exists", HttpStatus.CONFLICT),
    ACCOUNT_USERNAME_ALREADY_EXISTS(1013, "Username already exists", HttpStatus.CONFLICT),
    ACCOUNT_DISABLED(1014, "Account is disabled", HttpStatus.FORBIDDEN),
    REFRESH_TOKEN_NOT_EXPIRED(1013, "Refresh token is not expired", HttpStatus.BAD_REQUEST),

    // JWT token-related errors
    JWT_INVALID(14001, "Invalid JWT token", HttpStatus.UNAUTHORIZED),
    JWT_EXPIRED(14002, "JWT token expired", HttpStatus.UNAUTHORIZED),
    JWT_MALFORMED(14003, "Malformed JWT token", HttpStatus.UNAUTHORIZED),
    INVALID_REFRESH_TOKEN(14004, "Invalid refresh token", HttpStatus.UNAUTHORIZED),

    // Employee errors
    EMPLOYEE_NOT_FOUND(2001, "Employee not found", HttpStatus.NOT_FOUND),

    // Contract errors
    CONTRACT_NOT_FOUND(3001, "Contract not found", HttpStatus.NOT_FOUND),
    CONTRACT_DATE_INVALID(3002, "Contract date valid", HttpStatus.BAD_REQUEST),
    CONTRACT_ALREADY_ACTIVATED(3003, "Contract already activated", HttpStatus.BAD_REQUEST),

    // ========== COMPANY ERRORS ==========
    COMPANY_NOT_FOUND(404, "Company not found", HttpStatus.NOT_FOUND),
    COMPANY_ALREADY_EXISTS(409, "Company already exists", HttpStatus.CONFLICT),

    // ========== CONTRACT VALIDATION ERRORS ==========
    CONTRACT_ALREADY_SIGNED_CANNOT_EDIT(400, "Hợp đồng đã được ký, không thể chỉnh sửa", HttpStatus.BAD_REQUEST),
    CONTRACT_CANNOT_DELETE(400, "Không thể xóa hợp đồng đã được ký", HttpStatus.BAD_REQUEST),
    CONTRACT_NOT_ACTIVE(400, "Hợp đồng không ở trạng thái hoạt động", HttpStatus.BAD_REQUEST),
    CONTRACT_INVALID_STATUS_FOR_SIGNING(400, "Trạng thái hợp đồng không hợp lệ để ký", HttpStatus.BAD_REQUEST),

    // ========== CONTRACT DATE ERRORS ==========
    START_DATE_REQUIRED(400, "Ngày bắt đầu hợp đồng là bắt buộc", HttpStatus.BAD_REQUEST),
    END_DATE_REQUIRED(400, "Ngày kết thúc hợp đồng là bắt buộc", HttpStatus.BAD_REQUEST),
    END_DATE_MUST_AFTER_START_DATE(400, "Ngày kết thúc phải sau ngày bắt đầu", HttpStatus.BAD_REQUEST),

    // ========== CONTRACT TYPE SPECIFIC ERRORS ==========
    PROBATION_CONTRACT_MUST_HAVE_END_DATE(400, "Hợp đồng thử việc phải có ngày kết thúc", HttpStatus.BAD_REQUEST),
    PROBATION_CONTRACT_TOO_LONG(400, "Hợp đồng thử việc không được quá 60 ngày", HttpStatus.BAD_REQUEST),
    PROBATION_CONTRACT_NO_PROBATION_PERIOD(400, "Hợp đồng thử việc không có thời gian thử việc riêng", HttpStatus.BAD_REQUEST),

    FIXED_TERM_CONTRACT_MUST_HAVE_END_DATE(400, "Hợp đồng có thời hạn phải có ngày kết thúc", HttpStatus.BAD_REQUEST),
    FIXED_TERM_CONTRACT_EXCEEDS_MAX_DURATION(400, "Hợp đồng có thời hạn không được vượt quá 36 tháng (3 năm)", HttpStatus.BAD_REQUEST),

    INDEFINITE_CONTRACT_SHOULD_NOT_HAVE_END_DATE(400, "Hợp đồng vô thời hạn không nên có ngày kết thúc", HttpStatus.BAD_REQUEST),

    // ========== PROBATION ERRORS ==========
    PROBATION_PERIOD_TOO_LONG(400, "Thời gian thử việc quá dài (tối đa 60 ngày)", HttpStatus.BAD_REQUEST),

    // ========== SALARY ERRORS ==========
    INVALID_SALARY(400, "Mức lương không hợp lệ", HttpStatus.BAD_REQUEST),
    SALARY_BELOW_MINIMUM_WAGE(400, "Lương thấp hơn mức lương tối thiểu", HttpStatus.BAD_REQUEST),

    // Attendance errors
    ATTENDANCE_NOT_FOUND(4001, "Attendance not found", HttpStatus.NOT_FOUND),
    ALREADY_CHECKED_IN(4002, "You have already checked in today", HttpStatus.BAD_REQUEST),
    NOT_CHECKED_IN(4003, "You haven't checked in today", HttpStatus.BAD_REQUEST),
    ALREADY_CHECKED_OUT(4004, "You have already checked out today", HttpStatus.BAD_REQUEST),

    // Work Schedule errors
    WORK_SCHEDULE_NOT_FOUND(4101, "Work schedule not found", HttpStatus.NOT_FOUND),
    WORK_SCHEDULE_INACTIVE(4102, "Work schedule is inactive", HttpStatus.BAD_REQUEST),
    WORK_SCHEDULE_TIME_INVALID(4103, "Work schedule time is invalid", HttpStatus.BAD_REQUEST),
    WORK_SCHEDULE_BREAK_TIME_INVALID(4104, "Work schedule break time is invalid", HttpStatus.BAD_REQUEST),
    WORK_SCHEDULE_ALREADY_DEFAULT(4105, "Work schedule is already default", HttpStatus.CONFLICT),

    // Business logic errors
    INSUFFICIENT_PRIVILEGES(34001, "Insufficient privileges to perform this action", HttpStatus.FORBIDDEN),
    OPERATION_NOT_PERMITTED(34002, "Operation not permitted in current state", HttpStatus.BAD_REQUEST),
    RESOURCE_IN_USE(34003, "Resource is currently in use and cannot be modified", HttpStatus.CONFLICT),
    DEADLINE_EXCEEDED(34004, "Deadline has been exceeded", HttpStatus.BAD_REQUEST),
    QUOTA_EXCEEDED(34005, "Quota limit exceeded", HttpStatus.BAD_REQUEST),
    WORKFLOW_VIOLATION(34006, "Action violates workflow rules", HttpStatus.BAD_REQUEST),
    DATA_INTEGRITY_VIOLATION(34007, "Data integrity constraint violation", HttpStatus.CONFLICT),

    ;

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;

    /**
     * Constructor for ErrorCode.
     *
     * @param code       the error code
     * @param message    the error message
     * @param statusCode the corresponding HTTP status code
     */
    Error(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}