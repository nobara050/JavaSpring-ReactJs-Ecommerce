package com.NobaraEcommerceWeb.EcommerceWeb.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NobaraEcommerceWeb.EcommerceWeb.dao.AccountDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dao.CartDao;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Account;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Cart;

import jakarta.persistence.EntityNotFoundException;

@Service
public class CartService {

    @Autowired
    CartDao cartDao;

    @Autowired
    AccountDao accountDao;

    public Cart getCartByAccountId(Long accountId) {
        return cartDao.findByAccountId(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found for account: " + accountId));
    }

    public Cart createCart(Long accountId) {
        Account account = accountDao.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with id: " + accountId));

        Cart cart = new Cart();
        cart.setAccount(account);
        return cartDao.save(cart);
    }

    public void clearCart(Long cartId) {
        Cart cart = cartDao.findById(cartId)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found with id: " + cartId));
        cart.getCartItemList().clear();
        cartDao.save(cart);
    }
}