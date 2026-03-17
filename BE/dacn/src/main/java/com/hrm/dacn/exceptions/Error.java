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
        PROBATION_CONTRACT_NO_PROBATION_PERIOD(400, "Hợp đồng thử việc không có thời gian thử việc riêng",
                        HttpStatus.BAD_REQUEST),

        FIXED_TERM_CONTRACT_MUST_HAVE_END_DATE(400, "Hợp đồng có thời hạn phải có ngày kết thúc",
                        HttpStatus.BAD_REQUEST),
        FIXED_TERM_CONTRACT_EXCEEDS_MAX_DURATION(400, "Hợp đồng có thời hạn không được vượt quá 36 tháng (3 năm)",
                        HttpStatus.BAD_REQUEST),

        INDEFINITE_CONTRACT_SHOULD_NOT_HAVE_END_DATE(400, "Hợp đồng vô thời hạn không nên có ngày kết thúc",
                        HttpStatus.BAD_REQUEST),

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
        VALIDATION_ERROR(4005, "Check-out time cannot be before check-in time", HttpStatus.BAD_REQUEST),

        // Work Schedule errors
        WORK_SCHEDULE_NOT_FOUND(4101, "Work schedule not found", HttpStatus.NOT_FOUND),
        WORK_SCHEDULE_INACTIVE(4102, "Work schedule is inactive", HttpStatus.BAD_REQUEST),
        WORK_SCHEDULE_TIME_INVALID(4103, "Work schedule time is invalid", HttpStatus.BAD_REQUEST),
        WORK_SCHEDULE_BREAK_TIME_INVALID(4104, "Work schedule break time is invalid", HttpStatus.BAD_REQUEST),
        WORK_SCHEDULE_ALREADY_DEFAULT(4105, "Work schedule is already default", HttpStatus.CONFLICT),

        // Holiday errors
        HOLIDAY_NOT_FOUND(5001, "Holiday not found", HttpStatus.NOT_FOUND),
        HOLIDAY_ALREADY_EXISTS(5002, "Holiday already exists in the given date range", HttpStatus.CONFLICT),
        HOLIDAY_DATE_INVALID(5003, "Holiday date range is invalid", HttpStatus.BAD_REQUEST),
        HOLIDAY_IN_PAST(5004, "Cannot modify past holiday", HttpStatus.BAD_REQUEST),
        HOLIDAY_DUPLICATE_DATE(5005, "Duplicate holiday date", HttpStatus.CONFLICT),

        // ===================== Monthly Summary Errors =====================
        MONTHLY_SUMMARY_NOT_FOUND(42001, "Monthly summary not found", HttpStatus.NOT_FOUND),

        MONTHLY_SUMMARY_ALREADY_FINALIZED(
                        42002,
                        "Monthly summary is already finalized",
                        HttpStatus.BAD_REQUEST),

        MONTHLY_SUMMARY_NOT_FINALIZED(
                        42003,
                        "Monthly summary is not finalized",
                        HttpStatus.BAD_REQUEST),

        MONTHLY_SUMMARY_UNAPPROVED_ATTENDANCE(
                        42004,
                        "Monthly summary contains unapproved attendance records",
                        HttpStatus.CONFLICT),

        MONTHLY_SUMMARY_GENERATION_FAILED(
                        42005,
                        "Failed to generate monthly summary",
                        HttpStatus.INTERNAL_SERVER_ERROR),

        // ===================== Attendance Request Errors =====================

        ATTENDANCE_REQUEST_NOT_FOUND(
                        43001,
                        "Attendance request not found",
                        HttpStatus.NOT_FOUND),

        ATTENDANCE_REQUEST_ALREADY_PENDING(
                        43002,
                        "Attendance request already pending for this date",
                        HttpStatus.CONFLICT),

        ATTENDANCE_REQUEST_ALREADY_REVIEWED(
                        43003,
                        "Attendance request has already been reviewed",
                        HttpStatus.BAD_REQUEST),

        ATTENDANCE_REQUEST_INVALID_TIME(
                        43004,
                        "Invalid check-in or check-out time in attendance request",
                        HttpStatus.BAD_REQUEST),

        ATTENDANCE_REQUEST_NOT_PENDING(
                        43005,
                        "Only pending attendance requests can be modified",
                        HttpStatus.BAD_REQUEST),

        ATTENDANCE_REQUEST_NOT_OWNER(
                        43006,
                        "You can only operate on your own attendance requests",
                        HttpStatus.FORBIDDEN),

        ATTENDANCE_REQUEST_ATTENDANCE_EXISTS(
                        43007,
                        "Attendance already exists for this date",
                        HttpStatus.CONFLICT),

        ATTENDANCE_REQUEST_CREATION_FAILED(
                        43008,
                        "Failed to create attendance request",
                        HttpStatus.INTERNAL_SERVER_ERROR),

        // ================= WORK CALENDAR =================

        WORK_CALENDAR_NOT_FOUND(
                        7001,
                        "Không tìm thấy lịch làm việc",
                        HttpStatus.NOT_FOUND),

        WORK_CALENDAR_ALREADY_EXISTS(
                        7002,
                        "Lịch làm việc cho năm này đã tồn tại",
                        HttpStatus.BAD_REQUEST),

        WORK_CALENDAR_YEAR_INVALID(
                        7003,
                        "Năm của lịch làm việc không hợp lệ",
                        HttpStatus.BAD_REQUEST),

        // ===================== Leave Request Errors =====================
        LEAVE_REQUEST_NOT_FOUND(44001, "Leave request not found", HttpStatus.NOT_FOUND),
        LEAVE_REQUEST_ALREADY_PENDING(44002, "You already have a pending leave request for this date range",
                        HttpStatus.CONFLICT),
        LEAVE_REQUEST_ALREADY_REVIEWED(44003, "This leave request has already been reviewed", HttpStatus.BAD_REQUEST),
        LEAVE_REQUEST_NOT_PENDING(44004, "Only pending requests can be modified or cancelled", HttpStatus.BAD_REQUEST),
        LEAVE_REQUEST_NOT_OWNER(44005, "You can only operate on your own leave requests", HttpStatus.FORBIDDEN),
        LEAVE_REQUEST_OVERLAP(44006, "Leave request overlaps with existing approved or pending request",
                        HttpStatus.CONFLICT),
        LEAVE_REQUEST_INVALID_DATES(44007, "Start date must be before or equal to end date", HttpStatus.BAD_REQUEST),
        LEAVE_REQUEST_EXCEEDS_BALANCE(44008, "Requested days exceed remaining leave balance", HttpStatus.BAD_REQUEST),
        LEAVE_REQUEST_ATTENDANCE_EXISTS(44009, "Attendance records already exist for some dates in this range",
                        HttpStatus.CONFLICT),
        LEAVE_REQUEST_REJECT_REASON_REQUIRED(
                        44010, "Reject reason is required when rejecting a leave request", HttpStatus.BAD_REQUEST),

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