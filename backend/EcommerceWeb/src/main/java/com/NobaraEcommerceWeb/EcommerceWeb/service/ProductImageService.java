package com.NobaraEcommerceWeb.EcommerceWeb.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NobaraEcommerceWeb.EcommerceWeb.dao.ProductDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dao.ProductImageDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.ProductImageRequestDto;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.ProductImageResponseDto;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Product;
import com.NobaraEcommerceWeb.EcommerceWeb.model.ProductImage;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ProductImageService {

    @Autowired
    ProductImageDao productImageDao;

    @Autowired
    ProductDao productDao;

    @Autowired
    ModelMapper modelMapper;

    public List<ProductImageResponseDto> getImagesByProductId(Long productId) {
        return productImageDao.findByProductId(productId)
                .stream()
                .map(image -> modelMapper.map(image, ProductImageResponseDto.class))
                .collect(Collectors.toList());
    }

    public ProductImageResponseDto addImage(Long productId, ProductImageRequestDto dto) {
        Product product = productDao.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productId));
        ProductImage image = modelMapper.map(dto, ProductImage.class);
        image.setProduct(product);
        return modelMapper.map(productImageDao.save(image), ProductImageResponseDto.class);
    }

    public ProductImageResponseDto updateImage(Long imageId, ProductImageRequestDto dto) {
        ProductImage existing = productImageDao.findById(imageId)
                .orElseThrow(() -> new EntityNotFoundException("ProductImage not found with id: " + imageId));
        existing.setImageUrl(dto.getImageUrl());
        existing.setPrimary(dto.getIsPrimary());
        return modelMapper.map(productImageDao.save(existing), ProductImageResponseDto.class);
    }

    public void deleteImage(Long imageId) {
        ProductImage existing = productImageDao.findById(imageId)
                .orElseThrow(() -> new EntityNotFoundException("ProductImage not found with id: " + imageId));
        productImageDao.delete(existing);
    }
}
