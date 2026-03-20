package com.NobaraEcommerceWeb.EcommerceWeb.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NobaraEcommerceWeb.EcommerceWeb.model.Address;

@Repository
public interface AddressDao extends JpaRepository<Address, Long> {
    List<Address> findByAccountId(Long accountId);
}
