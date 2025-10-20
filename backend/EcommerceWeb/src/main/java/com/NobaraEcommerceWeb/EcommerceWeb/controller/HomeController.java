package com.NobaraEcommerceWeb.EcommerceWeb.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @GetMapping("/")
    public String home() {
        return new String ("Welcome to Nobara Ecommerce Web!");
    }
}
