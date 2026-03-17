package com.hrm.dacn.entities;

import java.beans.Transient;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.hrm.dacn.enums.Employee.EmployeeStatus;
import com.hrm.dacn.enums.Employee.EmployeeType;
import com.hrm.dacn.enums.Employee.Gender;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "employees")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id")
    private Long employeeId;

    @Column(name = "full_name", nullable = false, length = 100)
    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", length = 10)
    private Gender gender;

    @Column(name = "id_card", unique = true, length = 20)
    private String idCard;

    @Column(name = "phone", length = 15)
    @Pattern(regexp = "^(0|\\+84)[0-9]{9,10}$", message = "Số điện thoại không hợp lệ")
    private String phone;

    @Column(name = "email", length = 100)
    @Email(message = "Email không hợp lệ")
    private String email;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "department", length = 100)
    private String department;

    @Column(name = "position", length = 100)
    private String position;

    @Column(name = "start_date", nullable = false)
    @NotNull(message = "Ngày bắt đầu làm việc không được để trống")
    private LocalDate startDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private EmployeeStatus status = EmployeeStatus.WORKING;

    @Column(name = "bank_account", length = 50)
    private String bankAccount;

    @Column(name = "bank_name", length = 100)
    private String bankName;

    @Column(name = "tax_code", length = 20)
    private String taxCode;

    @Column(name = "social_insurance_number", length = 20)
    private String socialInsuranceNumber;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "emergency_contact_name", length = 100)
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone", length = 15)
    private String emergencyContactPhone;

    @Column(name = "emergency_contact_relationship", length = 50)
    private String emergencyContactRelationship;

    // @Column(name = "work_start_time")
    // private LocalTime workStartTime = LocalTime.of(8, 30);
    //
    // @Column(name = "work_end_time")
    // private LocalTime workEndTime = LocalTime.of(17, 30);

     @CreationTimestamp
     @Column(name = "created_at", updatable = false)
     private LocalDateTime createdAt;

     @UpdateTimestamp
     @Column(name = "updated_at")
     private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn
    private Role role;

    // Tính tuổi
    @Transient
    public int getAge() {
        if (dateOfBirth == null)
            return 0;
        return LocalDate.now().getYear() - dateOfBirth.getYear();
    }

    // Tính thâm niên (năm)
    @Transient
    public int getYearsOfService() {
        if (startDate == null)
            return 0;
        return LocalDate.now().getYear() - startDate.getYear();
    }

    public Object getId() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getId'");
    }
}
