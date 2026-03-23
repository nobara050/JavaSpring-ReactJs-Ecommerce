package com.NobaraEcommerceWeb.EcommerceWeb.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NobaraEcommerceWeb.EcommerceWeb.dao.AccountDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dao.CartDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.CartItemResponseDto;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.CartResponseDto;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Account;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Cart;
import com.NobaraEcommerceWeb.EcommerceWeb.model.CartItem;

import jakarta.persistence.EntityNotFoundException;

@Service
public class CartService {

    @Autowired
    CartDao cartDao;

    @Autowired
    AccountDao accountDao;

    @Autowired
    ModelMapper modelMapper;

    public CartResponseDto getCartByAccountId(Long accountId) {
        Cart cart = cartDao.findByAccountId(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found for account: " + accountId));
        return buildCartResponse(cart);
    }

    public CartResponseDto createCart(Long accountId) {
        Account account = accountDao.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with id: " + accountId));
        Cart cart = new Cart();
        cart.setAccount(account);
        Cart saved = cartDao.save(cart);
        return buildCartResponse(saved);
    }

    public void clearCart(Long cartId) {
        Cart cart = cartDao.findById(cartId)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found with id: " + cartId));
        cart.getCartItemList().clear();
        cartDao.save(cart);
    }

    private CartResponseDto buildCartResponse(Cart cart) {
        CartResponseDto dto = new CartResponseDto();
        dto.setId(cart.getId());
        dto.setAccountId(cart.getAccount().getId());
        dto.setCreatedAt(cart.getCreatedAt());
        dto.setUpdatedAt(cart.getUpdatedAt());

        if (cart.getCartItemList() != null) {
            List<CartItemResponseDto> itemDtos = cart.getCartItemList().stream()
                    .map(this::buildCartItemResponse)
                    .collect(Collectors.toList());
            dto.setCartItemList(itemDtos);
        }

        return dto;
    }

    private CartItemResponseDto buildCartItemResponse(CartItem cartItem) {
        CartItemResponseDto dto = modelMapper.map(cartItem, CartItemResponseDto.class);
        dto.setProductId(cartItem.getProduct().getId());
        dto.setProductName(cartItem.getProduct().getProductName());

        // Lay anh primary cua san pham
        if (cartItem.getProduct().getProductImageList() != null) {
            cartItem.getProduct().getProductImageList().stream()
                    .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                    .findFirst()
                    .ifPresent(img -> dto.setPrimaryImageUrl(img.getImageUrl()));
        }

        return dto;
    }
}