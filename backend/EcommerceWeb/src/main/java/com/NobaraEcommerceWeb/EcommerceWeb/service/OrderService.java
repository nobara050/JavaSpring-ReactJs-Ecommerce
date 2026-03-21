package com.NobaraEcommerceWeb.EcommerceWeb.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.NobaraEcommerceWeb.EcommerceWeb.dao.AccountDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dao.AddressDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dao.CouponDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dao.OrderDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dao.ProductDao;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.OrderItemResponseDto;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.OrderRequestDto;
import com.NobaraEcommerceWeb.EcommerceWeb.dto.OrderResponseDto;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Account;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Address;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Coupon;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Order;
import com.NobaraEcommerceWeb.EcommerceWeb.model.OrderItem;
import com.NobaraEcommerceWeb.EcommerceWeb.model.Product;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class OrderService {

    @Autowired
    OrderDao orderDao;

    @Autowired
    AccountDao accountDao;

    @Autowired
    AddressDao addressDao;

    @Autowired
    CouponDao couponDao;

    @Autowired
    ProductDao productDao;

    @Autowired
    ModelMapper modelMapper;
    
    public List<OrderResponseDto> getAllOrders() {
        return orderDao.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }
    
    public List<OrderResponseDto> getOrdersByAccountId(Long accountId) {
        return orderDao.findByAccountId(accountId)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public OrderResponseDto getOrderById(Long id) {
        Order order = orderDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + id));
        return mapToResponseDto(order);
    }

    @Transactional
    public OrderResponseDto createOrder(OrderRequestDto dto) {
        Account account = accountDao.findById(dto.getAccountId())
                .orElseThrow(() -> new EntityNotFoundException("Account not found with id: " + dto.getAccountId()));

        Address address = addressDao.findById(dto.getAddressId())
                .orElseThrow(() -> new EntityNotFoundException("Address not found with id: " + dto.getAddressId()));

        Order order = new Order();
        order.setAccount(account);
        order.setAddress(address);
        order.setPaymentMethod(dto.getPaymentMethod());
        order.setStatus("CHO_XAC_NHAN");

        if (dto.getCouponId() != null) {
            Coupon coupon = couponDao.findById(dto.getCouponId())
                    .orElseThrow(() -> new EntityNotFoundException("Coupon not found with id: " + dto.getCouponId()));
            order.setCoupon(coupon);
            coupon.setUsesCount(coupon.getUsesCount() + 1);
            couponDao.save(coupon);
        }

        List<OrderItem> orderItems = dto.getOrderItems().stream().map(itemDto -> {
            Product product = productDao.findById(itemDto.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + itemDto.getProductId()));

            if (product.getStockQuantity() < itemDto.getQuantity()) {
                throw new IllegalArgumentException("Not enough stock for product: " + product.getProductName());
            }

            product.setStockQuantity(product.getStockQuantity() - itemDto.getQuantity());
            productDao.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPriceAtPurchase(product.getPrice());
            return orderItem;
        }).collect(Collectors.toList());

        order.setOrderItemList(orderItems);

        BigDecimal total = orderItems.stream()
                .map(item -> item.getPriceAtPurchase().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalAmount(total);

        return mapToResponseDto(orderDao.save(order));
    }

    public OrderResponseDto updateStatus(Long id, String status) {
        Order existing = orderDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + id));
        existing.setStatus(status);
        return mapToResponseDto(orderDao.save(existing));
    }

    private OrderResponseDto mapToResponseDto(Order order) {
        OrderResponseDto dto = modelMapper.map(order, OrderResponseDto.class);
        dto.setAccountId(order.getAccount().getId());
        dto.setAddressId(order.getAddress().getId());
        if (order.getCoupon() != null) {
            dto.setCouponId(order.getCoupon().getId());
        }
        dto.setOrderItemList(order.getOrderItemList().stream().map(item -> {
            OrderItemResponseDto itemDto = modelMapper.map(item, OrderItemResponseDto.class);
            itemDto.setProductId(item.getProduct().getId());
            itemDto.setProductName(item.getProduct().getProductName());
            return itemDto;
        }).collect(Collectors.toList()));
        return dto;
    }
}
