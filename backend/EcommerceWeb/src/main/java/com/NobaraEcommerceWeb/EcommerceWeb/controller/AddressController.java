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
import org.springframework.web.bind.annotation.RestController;

import com.NobaraEcommerceWeb.EcommerceWeb.dto.AddressRequestDto;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.AddressResponseDto;
import com.NobaraEcommerceWeb.EcommerceWeb.service.AddressService;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/account")
public class AddressController {

    @Autowired
    AddressService addressService;

    @GetMapping("/{accountId}/addresses")
    public ResponseEntity<List<AddressResponseDto>> getAddressesByAccountId(@PathVariable Long accountId) {
        try {
            return new ResponseEntity<>(addressService.getAddressesByAccountId(accountId), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/addresses/{id}")
    public ResponseEntity<AddressResponseDto> getAddressById(@PathVariable Long id) {
        try {
            return new ResponseEntity<>(addressService.getAddressById(id), HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{accountId}/addresses")
    public ResponseEntity<AddressResponseDto> createAddress(
            @PathVariable Long accountId,
            @RequestBody AddressRequestDto dto) {
        try {
            return new ResponseEntity<>(addressService.createAddress(accountId, dto), HttpStatus.CREATED);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/addresses/{id}")
    public ResponseEntity<AddressResponseDto> updateAddress(
            @PathVariable Long id,
            @RequestBody AddressRequestDto dto) {
        try {
            return new ResponseEntity<>(addressService.updateAddress(id, dto), HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        try {
            addressService.deleteAddress(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}