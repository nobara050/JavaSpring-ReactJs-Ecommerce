package com.NobaraEcommerceWeb.EcommerceWeb.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NobaraEcommerceWeb.EcommerceWeb.dao.AccountDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dao.AddressDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.AddressRequestDto;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.AddressResponseDto;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Account;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Address;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AddressService {

    @Autowired
    AddressDao addressDao;

    @Autowired
    AccountDao accountDao;

    @Autowired
    ModelMapper modelMapper;

    public List<AddressResponseDto> getAddressesByAccountId(Long accountId) {
        return addressDao.findByAccountId(accountId)
                .stream()
                .map(address -> {
                    AddressResponseDto dto = modelMapper.map(address, AddressResponseDto.class);
                    dto.setAccountId(accountId);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public AddressResponseDto getAddressById(Long id) {
        Address address = addressDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Address not found with id: " + id));
        AddressResponseDto dto = modelMapper.map(address, AddressResponseDto.class);
        dto.setAccountId(address.getAccount().getId());
        return dto;
    }

    public AddressResponseDto createAddress(Long accountId, AddressRequestDto requestDto) {
        Account account = accountDao.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with id: " + accountId));
        Address address = modelMapper.map(requestDto, Address.class);
        address.setAccount(account);
        Address saved = addressDao.save(address);
        AddressResponseDto dto = modelMapper.map(saved, AddressResponseDto.class);
        dto.setAccountId(accountId);
        return dto;
    }

    public AddressResponseDto updateAddress(Long id, AddressRequestDto requestDto) {
        Address existing = addressDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Address not found with id: " + id));
        existing.setStreet(requestDto.getStreet());
        existing.setCity(requestDto.getCity());
        existing.setState(requestDto.getState());
        existing.setCountry(requestDto.getCountry());
        existing.setIsDefault(requestDto.getIsDefault());
        Address saved = addressDao.save(existing);
        AddressResponseDto dto = modelMapper.map(saved, AddressResponseDto.class);
        dto.setAccountId(saved.getAccount().getId());
        return dto;
    }

    public void deleteAddress(Long id) {
        Address existing = addressDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Address not found with id: " + id));
        addressDao.delete(existing);
    }
}