package com.NobaraEcommerceWeb.EcommerceWeb.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.NobaraEcommerceWeb.EcommerceWeb.model.Notification;

@Repository
public interface NotificationDao extends JpaRepository<Notification, Long> {
    List<Notification> findByAccountId(Long accountId);
    List<Notification> findByAccountIdAndIsRead(Long accountId, Boolean isRead);
}
