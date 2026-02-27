package com.hrm.dacn.services.impl;

import com.hrm.dacn.dtos.Holiday.Request.HolidayRequest;
import com.hrm.dacn.dtos.Holiday.Response.HolidayResponse;
import com.hrm.dacn.entities.Employee;
import com.hrm.dacn.entities.Holiday;
import com.hrm.dacn.exceptions.CustomException;
import com.hrm.dacn.exceptions.Error;
import com.hrm.dacn.mappers.HolidayMapper;
import com.hrm.dacn.repositories.EmployeeRepository;
import com.hrm.dacn.repositories.HolidayRepository;
import com.hrm.dacn.services.HolidayService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class HolidayServiceImpl implements HolidayService {

        private final HolidayRepository holidayRepository;

        private final EmployeeRepository employeeRepository;

        private final HolidayMapper holidayMapper;

        @Override
        public HolidayResponse createHoliday(
                        HolidayRequest requestDTO,
                        Long createdByEmployeeId) {

                log.info("Creating holiday: {}", requestDTO.getName());

                // Kiểm tra tính hợp lệ của khoảng ngày
                // - endDate không được trước startDate
                // - thời gian ngày lễ không quá 30 ngày
                validateDateRange(
                                requestDTO.getStartDate(),
                                requestDTO.getEndDate(),
                                null);

                // Kiểm tra trùng ngày lễ
                // Tránh tạo nhiều ngày lễ chồng chéo nhau
                if (holidayRepository.existsByDateRange(
                                requestDTO.getStartDate(),
                                requestDTO.getEndDate() != null
                                                ? requestDTO.getEndDate()
                                                : requestDTO.getStartDate(),
                                null)) {
                        throw new CustomException(Error.HOLIDAY_ALREADY_EXISTS);
                }

                // Kiểm tra nhân viên tạo ngày lễ có tồn tại không

                Holiday holiday = holidayMapper.toEntity(requestDTO, null);

                Holiday savedHoliday = holidayRepository.save(holiday);

                log.info("Holiday created successfully with ID: {}", savedHoliday.getId());

                return holidayMapper.toResponseDTO(savedHoliday);
        }

        /**
         * =========================================================
         * CẬP NHẬT NGÀY LỄ
         * =========================================================
         */
        @Override
        public HolidayResponse updateHoliday(
                        Long id,
                        HolidayRequest requestDTO) {

                log.info("Updating holiday with ID: {}", id);

                // 1. Lấy ngày lễ hiện tại
                Holiday existingHoliday = holidayRepository.findById(id)
                                .orElseThrow(() -> new CustomException(Error.HOLIDAY_NOT_FOUND));

                // 2. Không cho sửa ngày lễ đã diễn ra (rule HRM)
                if (existingHoliday.getStartDate().isBefore(LocalDate.now())) {
                        throw new CustomException(Error.HOLIDAY_IN_PAST);
                }

                // 3. Validate lại khoảng ngày
                validateDateRange(
                                requestDTO.getStartDate(),
                                requestDTO.getEndDate(),
                                id);

                // 4. Kiểm tra trùng ngày (loại trừ chính nó)
                if (holidayRepository.existsByDateRange(
                                requestDTO.getStartDate(),
                                requestDTO.getEndDate() != null
                                                ? requestDTO.getEndDate()
                                                : requestDTO.getStartDate(),
                                id)) {
                        throw new CustomException(Error.HOLIDAY_DUPLICATE_DATE);
                }

                // 5. Cập nhật thủ công từng trường

                // Tên ngày lễ
                existingHoliday.setName(requestDTO.getName());

                // Ngày bắt đầu
                existingHoliday.setStartDate(requestDTO.getStartDate());

                // Ngày kết thúc
                // Nếu không nhập endDate -> mặc định bằng startDate
                existingHoliday.setEndDate(
                                requestDTO.getEndDate() != null
                                                ? requestDTO.getEndDate()
                                                : requestDTO.getStartDate());

                // Loại ngày lễ
                existingHoliday.setType(requestDTO.getType());

                // Hưởng lương hay không
                // Nếu không truyền -> lấy mặc định theo loại ngày lễ
                existingHoliday.setIsPaid(
                                requestDTO.getIsPaid() != null
                                                ? requestDTO.getIsPaid()
                                                : existingHoliday.getType().getDefaultPaid());

                // Hệ số lương
                // Nếu không truyền -> lấy mặc định theo loại ngày lễ
                existingHoliday.setSalaryMultiplier(
                                requestDTO.getSalaryMultiplier() != null
                                                ? requestDTO.getSalaryMultiplier()
                                                : existingHoliday.getType().getDefaultSalaryMultiplier());

                // Mô tả
                existingHoliday.setDescription(requestDTO.getDescription());

                // 6. Lưu cập nhật
                Holiday updatedHoliday = holidayRepository.save(existingHoliday);

                log.info("Holiday updated successfully with ID: {}", id);

                return holidayMapper.toResponseDTO(updatedHoliday);
        }

        /**
         * =========================================================
         * LẤY CHI TIẾT NGÀY LỄ THEO ID
         * =========================================================
         */
        @Override
        @Transactional(readOnly = true)
        public HolidayResponse getHolidayById(Long id) {

                log.debug("Fetching holiday with ID: {}", id);

                Holiday holiday = holidayRepository.findById(id)
                                .orElseThrow(() -> new CustomException(Error.HOLIDAY_NOT_FOUND));

                return holidayMapper.toResponseDTO(holiday);
        }

        /**
         * =========================================================
         * XOÁ NGÀY LỄ
         * =========================================================
         */
        @Override
        public void deleteHoliday(Long id) {

                log.info("Deleting holiday with ID: {}", id);

                Holiday holiday = holidayRepository.findById(id)
                                .orElseThrow(() -> new CustomException(Error.HOLIDAY_NOT_FOUND));

                // Không cho xoá ngày lễ đã diễn ra
                if (holiday.getStartDate().isBefore(LocalDate.now())) {
                        throw new CustomException(Error.HOLIDAY_IN_PAST);
                }

                holidayRepository.delete(holiday);

                log.info("Holiday deleted successfully with ID: {}", id);
        }

        /**
         * =========================================================
         * LẤY DANH SÁCH NGÀY LỄ THEO KHOẢNG NGÀY
         * =========================================================
         */
        @Override
        @Transactional(readOnly = true)
        public List<HolidayResponse> getHolidaysByDateRange(
                        LocalDate from,
                        LocalDate to) {

                log.debug("Fetching holidays from {} to {}", from, to);

                if (from.isAfter(to)) {
                        throw new CustomException(Error.HOLIDAY_DATE_INVALID);
                }

                List<Holiday> holidays = holidayRepository.findByStartDateBetween(from, to);

                return holidays.stream()
                                .map(holidayMapper::toResponseDTO)
                                .collect(Collectors.toList());
        }

        /**
         * =========================================================
         * KIỂM TRA MỘT NGÀY CÓ PHẢI NGÀY LỄ HAY KHÔNG
         * =========================================================
         */
        @Override
        @Transactional(readOnly = true)
        public boolean isHoliday(LocalDate date) {

                return holidayRepository.findByStartDateBetween(date, date)
                                .stream()
                                .anyMatch(holiday -> !date.isBefore(holiday.getStartDate())
                                                && !date.isAfter(holiday.getEndDate()));
        }

        /**
         * =========================================================
         * LẤY HỆ SỐ LƯƠNG THEO NGÀY
         * =========================================================
         * - Nếu là nhiều ngày lễ trùng nhau:
         * -> lấy hệ số lương CAO NHẤT
         * - Nếu không phải ngày lễ:
         * -> hệ số = 1.0
         */
        @Override
        @Transactional(readOnly = true)
        public Double getSalaryMultiplier(LocalDate date) {

                return holidayRepository.findByStartDateBetween(date, date)
                                .stream()
                                .filter(holiday -> !date.isBefore(holiday.getStartDate())
                                                && !date.isAfter(holiday.getEndDate()))
                                .filter(Holiday::getIsPaid)
                                .map(Holiday::getSalaryMultiplier)
                                .max(Double::compare)
                                .orElse(1.0);
        }

        /**
         * =========================================================
         * VALIDATE KHOẢNG NGÀY NGÀY LỄ
         * =========================================================
         */
        private void validateDateRange(
                        LocalDate startDate,
                        LocalDate endDate,
                        Long excludeId) {

                // endDate không được nhỏ hơn startDate
                if (endDate != null && endDate.isBefore(startDate)) {
                        throw new CustomException(Error.HOLIDAY_DATE_INVALID);
                }

                // Không cho ngày lễ kéo dài quá 30 ngày
                LocalDate effectiveEndDate = endDate != null ? endDate : startDate;

                if (startDate.until(effectiveEndDate).getDays() > 30) {
                        throw new CustomException(Error.HOLIDAY_DATE_INVALID);
                }
        }
}
