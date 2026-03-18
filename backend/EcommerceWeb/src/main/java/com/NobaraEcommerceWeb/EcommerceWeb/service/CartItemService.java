package com.NobaraEcommerceWeb.EcommerceWeb.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NobaraEcommerceWeb.EcommerceWeb.dao.CartDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dao.CartItemDao;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Cart;
import com.NobaraEcommerceWeb.EcommerceWeb.model.CartItem;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Product;

import jakarta.persistence.EntityNotFoundException;

@Service
public class CartItemService {

    @Autowired
    CartItemDao cartItemDao;

    @Autowired
    CartDao cartDao;

    @Autowired
    ProductDao productDao;

    public CartItem addItem(Long cartId, Long productId, Integer quantity) {
        Cart cart = cartDao.findById(cartId)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found with id: " + cartId));

        Product product = productDao.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productId));

        CartItem cartItem = new CartItem();
        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(quantity);
        cartItem.setPriceAtAdd(product.getPrice());

        return cartItemDao.save(cartItem);
    }

    public CartItem updateQuantity(Long cartItemId, Integer quantity) {
        CartItem cartItem = cartItemDao.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("CartItem not found with id: " + cartItemId));
        cartItem.setQuantity(quantity);
        return cartItemDao.save(cartItem);
    }

    public void removeItem(Long cartItemId) {
        CartItem cartItem = cartItemDao.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("CartItem not found with id: " + cartItemId));
        cartItemDao.delete(cartItem);
    }
}
