package com.NobaraEcommerceWeb.EcommerceWeb.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.NobaraEcommerceWeb.EcommerceWeb.dto.NotificationRequestDto;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.NotificationResponseDto;
import com.NobaraEcommerceWeb.EcommerceWeb.service.NotificationService;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/notification")
public class NotificationController {

    @Autowired
    NotificationService notificationService;

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<NotificationResponseDto>> getNotificationsByAccountId(@PathVariable Long accountId) {
        try {
            return new ResponseEntity<>(notificationService.getNotificationsByAccountId(accountId), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/account/{accountId}/unread")
    public ResponseEntity<List<NotificationResponseDto>> getUnreadNotifications(@PathVariable Long accountId) {
        try {
            return new ResponseEntity<>(notificationService.getUnreadNotifications(accountId), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<NotificationResponseDto> createNotification(@RequestBody NotificationRequestDto dto) {
        try {
            return new ResponseEntity<>(notificationService.createNotification(dto), HttpStatus.CREATED);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponseDto> markAsRead(@PathVariable Long id) {
        try {
            return new ResponseEntity<>(notificationService.markAsRead(id), HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        try {
            notificationService.deleteNotification(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
