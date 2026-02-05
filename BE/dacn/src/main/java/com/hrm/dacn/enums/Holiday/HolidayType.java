package com.hrm.dacn.enums.Holiday;

import lombok.*;

@Getter
@AllArgsConstructor
public enum HolidayType {

    NATIONAL_HOLIDAY("Ngày lễ quốc gia", 2.0, true),
    COMPANY_HOLIDAY("Ngày nghỉ công ty", 1.5, true),
    SPECIAL_EVENT("Sự kiện đặc biệt", 1.0, true),
    WEEKEND("Cuối tuần", 0.0, false);

    private final String description;
    private final Double defaultSalaryMultiplier;
    private final Boolean defaultPaid;
}
