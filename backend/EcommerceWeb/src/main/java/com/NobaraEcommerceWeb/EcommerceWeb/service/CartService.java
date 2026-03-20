package com.NobaraEcommerceWeb.EcommerceWeb.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NobaraEcommerceWeb.EcommerceWeb.dao.AccountDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dao.CartDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.CartResponseDto;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Account;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Cart;

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
        CartResponseDto dto = modelMapper.map(cart, CartResponseDto.class);
        dto.setAccountId(cart.getAccount().getId());
        return dto;
    }

    public CartResponseDto createCart(Long accountId) {
        Account account = accountDao.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with id: " + accountId));
        Cart cart = new Cart();
        cart.setAccount(account);
        Cart saved = cartDao.save(cart);
        CartResponseDto dto = modelMapper.map(saved, CartResponseDto.class);
        dto.setAccountId(accountId);
        return dto;
    }

    public void clearCart(Long cartId) {
        Cart cart = cartDao.findById(cartId)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found with id: " + cartId));
        cart.getCartItemList().clear();
        cartDao.save(cart);
    }
}