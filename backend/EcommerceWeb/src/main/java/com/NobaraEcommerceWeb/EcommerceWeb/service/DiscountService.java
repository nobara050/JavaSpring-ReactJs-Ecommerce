package com.NobaraEcommerceWeb.EcommerceWeb.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NobaraEcommerceWeb.EcommerceWeb.dao.DiscountDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.DiscountRequestDto;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.DiscountResponseDto;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Discount;

import jakarta.persistence.EntityNotFoundException;

@Service
public class DiscountService {

    @Autowired
    DiscountDao discountDao;

    @Autowired
    ModelMapper modelMapper;

    public List<DiscountResponseDto> getAllDiscounts() {
        return discountDao.findAll()
                .stream()
                .map(discount -> modelMapper.map(discount, DiscountResponseDto.class))
                .collect(Collectors.toList());
    }

    public DiscountResponseDto getDiscountById(Long id) {
        Discount discount = discountDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Discount not found with id: " + id));
        return modelMapper.map(discount, DiscountResponseDto.class);
    }

    public DiscountResponseDto createDiscount(DiscountRequestDto dto) {
        Discount discount = modelMapper.map(dto, Discount.class);
        return modelMapper.map(discountDao.save(discount), DiscountResponseDto.class);
    }

    public DiscountResponseDto updateDiscount(Long id, DiscountRequestDto dto) {
        Discount existing = discountDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Discount not found with id: " + id));
        existing.setDiscountName(dto.getDiscountName());
        existing.setDiscountAmount(dto.getDiscountAmount());
        existing.setDiscountPercent(dto.getDiscountPercent());
        existing.setStartDate(dto.getStartDate());
        existing.setEndDate(dto.getEndDate());
        existing.setIsActive(dto.getIsActive());
        return modelMapper.map(discountDao.save(existing), DiscountResponseDto.class);
    }

    public void deleteDiscount(Long id) {
        Discount existing = discountDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Discount not found with id: " + id));
        discountDao.delete(existing);
    }
}
