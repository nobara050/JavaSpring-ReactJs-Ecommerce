package com.NobaraEcommerceWeb.EcommerceWeb.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NobaraEcommerceWeb.EcommerceWeb.dao.AccountDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dao.OrderDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dao.PaymentDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.PaymentRequestDto;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.PaymentResponseDto;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Account;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Order;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Payment;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PaymentService {

    @Autowired
    PaymentDao paymentDao;

    @Autowired
    OrderDao orderDao;

    @Autowired
    AccountDao accountDao;

    @Autowired
    ModelMapper modelMapper;

    public PaymentResponseDto getPaymentByOrderId(Long orderId) {
        Payment payment = paymentDao.findByOrderId(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found for order: " + orderId));
        return mapToResponseDto(payment);
    }

    public PaymentResponseDto getPaymentById(Long id) {
        Payment payment = paymentDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found with id: " + id));
        return mapToResponseDto(payment);
    }

    public PaymentResponseDto createPayment(PaymentRequestDto dto) {
        paymentDao.findByOrderId(dto.getOrderId()).ifPresent(p -> {
            throw new IllegalArgumentException("Payment already exists for order: " + dto.getOrderId());
        });

        Order order = orderDao.findById(dto.getOrderId())
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + dto.getOrderId()));

        Account account = accountDao.findById(dto.getAccountId())
                .orElseThrow(() -> new EntityNotFoundException("Account not found with id: " + dto.getAccountId()));

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAccount(account);
        payment.setAmount(dto.getAmount());
        payment.setPaymentStatus(dto.getPaymentStatus());
        payment.setTransactionId(dto.getTransactionId());

        return mapToResponseDto(paymentDao.save(payment));
    }

    public PaymentResponseDto updatePaymentStatus(Long id, String paymentStatus) {
        Payment existing = paymentDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found with id: " + id));
        existing.setPaymentStatus(paymentStatus);
        return mapToResponseDto(paymentDao.save(existing));
    }

    private PaymentResponseDto mapToResponseDto(Payment payment) {
        PaymentResponseDto dto = modelMapper.map(payment, PaymentResponseDto.class);
        dto.setOrderId(payment.getOrder().getId());
        dto.setAccountId(payment.getAccount().getId());
        return dto;
    }
}
