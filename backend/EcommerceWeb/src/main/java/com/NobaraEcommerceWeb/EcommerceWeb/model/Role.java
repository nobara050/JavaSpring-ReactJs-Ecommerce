package com.NobaraEcommerceWeb.EcommerceWeb.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "role")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String roleName;

    private String description;

    @ManyToMany(mappedBy = "roles")
    // @ToString.Exclude
    // @EqualsAndHashCode.Exclude
    private List<Account> accounts;
}
