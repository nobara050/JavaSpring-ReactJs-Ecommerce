package com.NobaraEcommerceWeb.EcommerceWeb.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NobaraEcommerceWeb.EcommerceWeb.dao.CartDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dao.CartItemDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dao.ProductDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.CartItemRequestDto;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.CartItemResponseDto;
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

    @Autowired
    ModelMapper modelMapper;

    public CartItemResponseDto addItem(Long cartId, CartItemRequestDto dto) {
        Cart cart = cartDao.findById(cartId)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found with id: " + cartId));
        Product product = productDao.findById(dto.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + dto.getProductId()));

        CartItem cartItem = new CartItem();
        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(dto.getQuantity());
        cartItem.setPriceAtAdd(product.getPrice());

        CartItem saved = cartItemDao.save(cartItem);
        CartItemResponseDto response = modelMapper.map(saved, CartItemResponseDto.class);
        response.setProductId(product.getId());
        response.setProductName(product.getProductName());
        return response;
    }

    public CartItemResponseDto updateQuantity(Long cartItemId, Integer quantity) {
        CartItem cartItem = cartItemDao.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("CartItem not found with id: " + cartItemId));
        cartItem.setQuantity(quantity);
        CartItem saved = cartItemDao.save(cartItem);
        CartItemResponseDto response = modelMapper.map(saved, CartItemResponseDto.class);
        response.setProductId(saved.getProduct().getId());
        response.setProductName(saved.getProduct().getProductName());
        return response;
    }

    public void removeItem(Long cartItemId) {
        CartItem cartItem = cartItemDao.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("CartItem not found with id: " + cartItemId));
        cartItemDao.delete(cartItem);
    }
}