package com.NobaraEcommerceWeb.EcommerceWeb.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.NobaraEcommerceWeb.EcommerceWeb.dto.ProductImageRequestDto;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.ProductImageResponseDto;
import com.NobaraEcommerceWeb.EcommerceWeb.service.ProductImageService;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/product")
public class ProductImageController {

    @Autowired
    ProductImageService productImageService;

    @GetMapping("/{productId}/images")
    public ResponseEntity<List<ProductImageResponseDto>> getImagesByProductId(@PathVariable Long productId) {
        try {
            return new ResponseEntity<>(productImageService.getImagesByProductId(productId), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Upload file tu may
    @PostMapping("/{productId}/images/upload")
    public ResponseEntity<ProductImageResponseDto> uploadImage(
            @PathVariable Long productId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "isPrimary", defaultValue = "false") Boolean isPrimary) {
        try {
            return new ResponseEntity<>(productImageService.uploadImage(productId, file, isPrimary), HttpStatus.CREATED);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Them bang URL
    @PostMapping("/{productId}/images")
    public ResponseEntity<ProductImageResponseDto> addImage(
            @PathVariable Long productId,
            @RequestBody ProductImageRequestDto dto) {
        try {
            return new ResponseEntity<>(productImageService.addImage(productId, dto), HttpStatus.CREATED);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{productId}/images/{imageId}")
    public ResponseEntity<ProductImageResponseDto> updateImage(
            @PathVariable Long productId,
            @PathVariable Long imageId,
            @RequestBody ProductImageRequestDto dto) {
        try {
            return new ResponseEntity<>(productImageService.updateImage(imageId, dto), HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{productId}/images/{imageId}")
    public ResponseEntity<Void> deleteImage(
            @PathVariable Long productId,
            @PathVariable Long imageId) {
        try {
            productImageService.deleteImage(imageId);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
