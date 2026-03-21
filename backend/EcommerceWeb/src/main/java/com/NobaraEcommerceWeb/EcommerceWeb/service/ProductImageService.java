package com.NobaraEcommerceWeb.EcommerceWeb.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

    @Value("${file.upload-dir}")
    private String uploadDir;

    public List<ProductImageResponseDto> getImagesByProductId(Long productId) {
        return productImageDao.findByProductId(productId)
                .stream()
                .map(image -> modelMapper.map(image, ProductImageResponseDto.class))
                .collect(Collectors.toList());
    }

    public ProductImageResponseDto uploadImage(Long productId, MultipartFile file, Boolean isPrimary) {
        Product product = productDao.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productId));

        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            String imageUrl = "http://localhost:8080/" + fileName;

            ProductImage image = new ProductImage();
            image.setProduct(product);
            image.setImageUrl(imageUrl);
            image.setIsPrimary(isPrimary != null ? isPrimary : false);

            return modelMapper.map(productImageDao.save(image), ProductImageResponseDto.class);

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
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
        existing.setIsPrimary(dto.getIsPrimary());
        return modelMapper.map(productImageDao.save(existing), ProductImageResponseDto.class);
    }

    public void deleteImage(Long imageId) {
        ProductImage existing = productImageDao.findById(imageId)
                .orElseThrow(() -> new EntityNotFoundException("ProductImage not found with id: " + imageId));
        productImageDao.delete(existing);
    }
}
