package com.hrm.dacn.enums;

public enum Gender {
    MALE("Nam"),
    FEMALE("Nữ"),
    OTHER("Khác");

    private final String displayName;

    Gender(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static Gender fromDisplayName(String displayName) {
        for (Gender gender : Gender.values()) {
            if (gender.displayName.equalsIgnoreCase(displayName)) {
                return gender;
            }
        }
        throw new IllegalArgumentException("Giới tính không hợp lệ: " + displayName);
    }
}