package com.NobaraEcommerceWeb.EcommerceWeb.model;

import java.sql.Date;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.GenerationType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    private String password;

    @Column(unique = true)
    private String email;

    private String fullName;
    
    private String phone;
    
    private String avatar;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;

    private Boolean isActive = true;

    @ManyToMany
    private List<Role> role;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    private List<Address> addressList;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    private List<Cart> cartList;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    private List<Order> orderList;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    private List<Review> reviewList;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    private List<Notification> accountNotificationList;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    private List<Payment> paymentList;
}
