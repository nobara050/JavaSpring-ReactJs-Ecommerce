package com.NobaraEcommerceWeb.EcommerceWeb.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NobaraEcommerceWeb.EcommerceWeb.dao.AccountDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dao.ProductDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dao.ReviewDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.ReviewRequestDto;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.ReviewResponseDto;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Account;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Product;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Review;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ReviewService {

    @Autowired
    ReviewDao reviewDao;

    @Autowired
    AccountDao accountDao;

    @Autowired
    ProductDao productDao;

    @Autowired
    ModelMapper modelMapper;

    public List<ReviewResponseDto> getReviewsByProductId(Long productId) {
        return reviewDao.findByProductId(productId)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public List<ReviewResponseDto> getReviewsByAccountId(Long accountId) {
        return reviewDao.findByAccountId(accountId)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public ReviewResponseDto getReviewById(Long id) {
        Review review = reviewDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review not found with id: " + id));
        return mapToResponseDto(review);
    }

    public ReviewResponseDto createReview(ReviewRequestDto dto) {
        Account account = accountDao.findById(dto.getAccountId())
                .orElseThrow(() -> new EntityNotFoundException("Account not found with id: " + dto.getAccountId()));

        Product product = productDao.findById(dto.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + dto.getProductId()));

        Review review = new Review();
        review.setAccount(account);
        review.setProduct(product);
        review.setComment(dto.getComment());
        review.setRating(dto.getRating());

        return mapToResponseDto(reviewDao.save(review));
    }

    public ReviewResponseDto updateReview(Long id, ReviewRequestDto dto) {
        Review existing = reviewDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review not found with id: " + id));
        existing.setComment(dto.getComment());
        existing.setRating(dto.getRating());
        return mapToResponseDto(reviewDao.save(existing));
    }

    public void deleteReview(Long id) {
        Review existing = reviewDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review not found with id: " + id));
        reviewDao.delete(existing);
    }

    private ReviewResponseDto mapToResponseDto(Review review) {
        ReviewResponseDto dto = modelMapper.map(review, ReviewResponseDto.class);
        dto.setAccountId(review.getAccount().getId());
        dto.setProductId(review.getProduct().getId());
        dto.setProductName(review.getProduct().getProductName());
        return dto;
    }
}
