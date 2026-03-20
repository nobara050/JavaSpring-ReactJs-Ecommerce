package com.NobaraEcommerceWeb.EcommerceWeb.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NobaraEcommerceWeb.EcommerceWeb.dao.AccountDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dao.NotificationDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dao.OrderDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.NotificationRequestDto;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.NotificationResponseDto;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Account;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Notification;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Order;

import jakarta.persistence.EntityNotFoundException;

@Service
public class NotificationService {

    @Autowired
    NotificationDao notificationDao;

    @Autowired
    AccountDao accountDao;

    @Autowired
    OrderDao orderDao;

    @Autowired
    ModelMapper modelMapper;

    public List<NotificationResponseDto> getNotificationsByAccountId(Long accountId) {
        return notificationDao.findByAccountId(accountId)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public List<NotificationResponseDto> getUnreadNotifications(Long accountId) {
        return notificationDao.findByAccountIdAndIsRead(accountId, false)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public NotificationResponseDto createNotification(NotificationRequestDto dto) {
        Account account = accountDao.findById(dto.getAccountId())
                .orElseThrow(() -> new EntityNotFoundException("Account not found with id: " + dto.getAccountId()));

        Notification notification = new Notification();
        notification.setAccount(account);
        notification.setMessage(dto.getMessage());
        notification.setNotificationType(dto.getNotificationType());

        if (dto.getOrderId() != null) {
            Order order = orderDao.findById(dto.getOrderId())
                    .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + dto.getOrderId()));
            notification.setOrder(order);
        }

        return mapToResponseDto(notificationDao.save(notification));
    }

    public NotificationResponseDto markAsRead(Long id) {
        Notification existing = notificationDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found with id: " + id));
        existing.setIsRead(true);
        return mapToResponseDto(notificationDao.save(existing));
    }

    public void deleteNotification(Long id) {
        Notification existing = notificationDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found with id: " + id));
        notificationDao.delete(existing);
    }

    private NotificationResponseDto mapToResponseDto(Notification notification) {
        NotificationResponseDto dto = modelMapper.map(notification, NotificationResponseDto.class);
        dto.setAccountId(notification.getAccount().getId());
        if (notification.getOrder() != null) {
            dto.setOrderId(notification.getOrder().getId());
        }
        return dto;
    }
}
