package com.hrm.dacn.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "companies")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id")
    private Long companyId;

    @Column(name = "company_name", nullable = false, length = 200)
    @NotBlank(message = "Tên công ty không được để trống")
    private String companyName;

    @Column(name = "company_name_en", length = 200)
    private String companyNameEn;

    @Column(name = "tax_code", nullable = false, unique = true, length = 20)
    @NotBlank(message = "Mã số thuế không được để trống")
    private String taxCode;

    @Column(name = "business_registration_number", length = 50)
    private String businessRegistrationNumber;

    @Column(name = "registration_date")
    private java.time.LocalDate registrationDate;

    @Column(name = "legal_representative", nullable = false, length = 100)
    @NotBlank(message = "Người đại diện pháp luật không được để trống")
    private String legalRepresentative;

    @Column(name = "position_of_representative", length = 100)
    private String positionOfRepresentative; // Chức vụ người đại diện

    @Column(name = "phone", length = 15)
    @Pattern(regexp = "^(0|\\+84)[0-9]{9,10}$", message = "Số điện thoại không hợp lệ")
    private String phone;

    @Column(name = "email", length = 100)
    @Email(message = "Email không hợp lệ")
    private String email;

    @Column(name = "website", length = 200)
    private String website;

    @Column(name = "fax", length = 20)
    private String fax;

    @Column(name = "head_office_address", nullable = false, length = 500)
    @NotBlank(message = "Địa chỉ trụ sở chính không được để trống")
    private String headOfficeAddress;

    @Column(name = "business_sector", length = 200)
    private String businessSector; // Ngành nghề kinh doanh

    @Column(name = "number_of_employees")
    private Integer numberOfEmployees;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "company_seal_url")
    private String companySealUrl; // Con dấu công ty

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
