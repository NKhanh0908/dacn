package com.hrm.dacn.enums.Attendance;

public enum AttendanceStatus {
    PRESENT, // Có mặt
    ON_TIME, // Đúng giờ
    LATE, // Trễ
    EARLY_LEAVE, // Về sớm
    LATE_AND_EARLY_LEAVE,
    ABSENT, // Vắng
    OVERTIME, // Làm thêm giờ
    LEAVE, // Nghỉ phép
    HOLIDAY, // Ngày lễ
    WEEKEND, // Cuối tuần
    BUSINESS_TRIP, // Công tác
    REMOTE_WORK, // Làm việc từ xa
    PENDING, // Chờ xử lý
    OT_PENDING_APPROVAL,
    OT_REJECTED,
}