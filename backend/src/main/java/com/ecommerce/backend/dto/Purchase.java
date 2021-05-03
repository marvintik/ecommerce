package com.ecommerce.backend.dto;

import com.ecommerce.backend.entity.Address;
import com.ecommerce.backend.entity.Customer;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
