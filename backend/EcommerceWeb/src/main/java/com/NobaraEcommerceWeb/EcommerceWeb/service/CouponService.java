package com.NobaraEcommerceWeb.EcommerceWeb.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NobaraEcommerceWeb.EcommerceWeb.dao.CouponDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.CouponRequestDto;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.CouponResponseDto;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Coupon;

import jakarta.persistence.EntityNotFoundException;

@Service
public class CouponService {

    @Autowired
    CouponDao couponDao;

    @Autowired
    ModelMapper modelMapper;

    public List<CouponResponseDto> getAllCoupons() {
        return couponDao.findAll()
                .stream()
                .map(coupon -> modelMapper.map(coupon, CouponResponseDto.class))
                .collect(Collectors.toList());
    }

    public CouponResponseDto getCouponById(Long id) {
        Coupon coupon = couponDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Coupon not found with id: " + id));
        return modelMapper.map(coupon, CouponResponseDto.class);
    }

    public CouponResponseDto getCouponByCode(String code) {
        Coupon coupon = couponDao.findByCode(code)
                .orElseThrow(() -> new EntityNotFoundException("Coupon not found with code: " + code));
        return modelMapper.map(coupon, CouponResponseDto.class);
    }

    public CouponResponseDto createCoupon(CouponRequestDto dto) {
        couponDao.findByCode(dto.getCode()).ifPresent(c -> {
            throw new IllegalArgumentException("Coupon code already exists: " + dto.getCode());
        });
        Coupon coupon = modelMapper.map(dto, Coupon.class);
        return modelMapper.map(couponDao.save(coupon), CouponResponseDto.class);
    }

    public CouponResponseDto updateCoupon(Long id, CouponRequestDto dto) {
        Coupon existing = couponDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Coupon not found with id: " + id));
        existing.setCode(dto.getCode());
        existing.setDiscountAmount(dto.getDiscountAmount());
        existing.setDiscountPercent(dto.getDiscountPercent());
        existing.setMinOrderValue(dto.getMinOrderValue());
        existing.setMaxUses(dto.getMaxUses());
        existing.setStartDate(dto.getStartDate());
        existing.setEndDate(dto.getEndDate());
        existing.setIsActive(dto.getIsActive());
        return modelMapper.map(couponDao.save(existing), CouponResponseDto.class);
    }

    public void deleteCoupon(Long id) {
        Coupon existing = couponDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Coupon not found with id: " + id));
        couponDao.delete(existing);
    }
}