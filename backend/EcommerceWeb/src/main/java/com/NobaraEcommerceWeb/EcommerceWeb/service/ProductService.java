package com.NobaraEcommerceWeb.EcommerceWeb.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NobaraEcommerceWeb.EcommerceWeb.dao.CategoryDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dao.DiscountDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dao.ProductDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.ProductRequestDto;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.ProductResponseDto;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Category;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Discount;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Product;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ProductService {

    @Autowired
    ProductDao productDao;

    @Autowired
    DiscountDao discountDao;

    @Autowired
    CategoryDao categoryDao;

    @Autowired
    ModelMapper modelMapper;

    public List<ProductResponseDto> getAllProducts() {
        return productDao.findAll()
                .stream()
                .map(product -> modelMapper.map(product, ProductResponseDto.class))
                .collect(Collectors.toList());
    }

    public ProductResponseDto getProductById(Long id) {
        Product product = productDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        return modelMapper.map(product, ProductResponseDto.class);
    }

    public ProductResponseDto createProduct(ProductRequestDto dto) {
        Product product = modelMapper.map(dto, Product.class);

        if (dto.getDiscountId() != null) {
            Discount discount = discountDao.findById(dto.getDiscountId())
                    .orElseThrow(() -> new EntityNotFoundException("Discount not found with id: " + dto.getDiscountId()));
            product.setDiscount(discount);
        }

        if (dto.getCategoryIds() != null && !dto.getCategoryIds().isEmpty()) {
            List<Category> categories = dto.getCategoryIds().stream()
                    .map(categoryId -> categoryDao.findById(categoryId)
                            .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + categoryId)))
                    .collect(Collectors.toList());
            product.setCategory(categories);
        }

        return modelMapper.map(productDao.save(product), ProductResponseDto.class);
    }

    public ProductResponseDto updateProduct(Long id, ProductRequestDto dto) {
        Product existing = productDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));

        existing.setProductName(dto.getProductName());
        existing.setDescription(dto.getDescription());
        existing.setPrice(dto.getPrice());
        existing.setStockQuantity(dto.getStockQuantity());

        if (dto.getDiscountId() != null) {
            Discount discount = discountDao.findById(dto.getDiscountId())
                    .orElseThrow(() -> new EntityNotFoundException("Discount not found with id: " + dto.getDiscountId()));
            existing.setDiscount(discount);
        } else {
            existing.setDiscount(null);
        }

        if (dto.getCategoryIds() != null && !dto.getCategoryIds().isEmpty()) {
            List<Category> categories = dto.getCategoryIds().stream()
                    .map(categoryId -> categoryDao.findById(categoryId)
                            .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + categoryId)))
                    .collect(Collectors.toList());
            existing.setCategory(categories);
        }

        return modelMapper.map(productDao.save(existing), ProductResponseDto.class);
    }

    public void deleteProduct(Long id) {
        Product existing = productDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        productDao.delete(existing);
    }
}