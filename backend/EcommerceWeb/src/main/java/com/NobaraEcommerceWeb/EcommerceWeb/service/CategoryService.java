package com.NobaraEcommerceWeb.EcommerceWeb.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NobaraEcommerceWeb.EcommerceWeb.dao.CategoryDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.CategoryRequestDto;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.CategoryResponseDto;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Category;

import jakarta.persistence.EntityNotFoundException;

@Service
public class CategoryService {

    @Autowired
    CategoryDao categoryDao;

    @Autowired
    ModelMapper modelMapper;

    public List<CategoryResponseDto> getAllCategories() {
        return categoryDao.findAll()
                .stream()
                .map(category -> modelMapper.map(category, CategoryResponseDto.class))
                .collect(Collectors.toList());
    }

    public CategoryResponseDto getCategoryById(Long id) {
        Category category = categoryDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + id));
        return modelMapper.map(category, CategoryResponseDto.class);
    }

    public CategoryResponseDto createCategory(CategoryRequestDto categoryRequestDto) {
        Category category = modelMapper.map(categoryRequestDto, Category.class);
        Category saved = categoryDao.save(category);
        return modelMapper.map(saved, CategoryResponseDto.class);
    }

    public CategoryResponseDto updateCategory(Long id, CategoryRequestDto categoryRequestDto) {
        Category existing = categoryDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + id));
        existing.setCategoryName(categoryRequestDto.getCategoryName());
        existing.setDescription(categoryRequestDto.getDescription());
        Category saved = categoryDao.save(existing);
        return modelMapper.map(saved, CategoryResponseDto.class);
    }

    public void deleteCategory(Long id) {
        Category existing = categoryDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + id));

        if (existing.getProductList() != null && !existing.getProductList().isEmpty()) {
            throw new IllegalStateException("Không thể xóa danh mục đang có sản phẩm");
        }

        categoryDao.delete(existing);
    }
}
