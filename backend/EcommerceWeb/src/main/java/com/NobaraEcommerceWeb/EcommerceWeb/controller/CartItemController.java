package com.NobaraEcommerceWeb.EcommerceWeb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.NobaraEcommerceWeb.EcommerceWeb.dto.CartItemRequestDto;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.CartItemResponseDto;
import com.NobaraEcommerceWeb.EcommerceWeb.service.CartItemService;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/cart")
public class CartItemController {

    @Autowired
    CartItemService cartItemService;

    @PostMapping("/{cartId}/items")
    public ResponseEntity<CartItemResponseDto> addItem(
            @PathVariable Long cartId,
            @RequestBody CartItemRequestDto dto) {
        try {
            return new ResponseEntity<>(cartItemService.addItem(cartId, dto), HttpStatus.CREATED);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{cartId}/items/{cartItemId}")
    public ResponseEntity<CartItemResponseDto> updateQuantity(
            @PathVariable Long cartId,
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity) {
        try {
            return new ResponseEntity<>(cartItemService.updateQuantity(cartItemId, quantity), HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{cartId}/items/{cartItemId}")
    public ResponseEntity<Void> removeItem(
            @PathVariable Long cartId,
            @PathVariable Long cartItemId) {
        try {
            cartItemService.removeItem(cartItemId);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}