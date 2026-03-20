package com.NobaraEcommerceWeb.EcommerceWeb.dto;

import lombok.Data;

@Data
public class AddressRequestDto {
    private String street;
    private String city;
    private String state;
    private String country;
    private Boolean isDefault;
}