package com.hrm.dacn.dtos.Holiday.Request;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

import com.hrm.dacn.enums.Holiday.HolidayType;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HolidayRequest {

    @NotBlank(message = "Tên ngày lễ không được để trống")
    private String name;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    @FutureOrPresent(message = "Ngày bắt đầu phải là hiện tại hoặc tương lai")
    private LocalDate startDate;

    private LocalDate endDate;

    @NotNull(message = "Loại ngày lễ không được để trống")
    private HolidayType type;

    private Boolean isPaid;

    @DecimalMin(value = "0.0", message = "Hệ số lương phải >= 0")
    @DecimalMax(value = "5.0", message = "Hệ số lương phải <= 5")
    private Double salaryMultiplier;

    @Size(max = 500, message = "Mô tả tối đa 500 ký tự")
    private String description;
}
