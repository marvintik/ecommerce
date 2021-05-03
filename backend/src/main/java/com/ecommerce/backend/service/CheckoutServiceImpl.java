package com.ecommerce.backend.service;

import com.ecommerce.backend.dao.CustomerRepository;
import com.ecommerce.backend.dto.Purchase;
import com.ecommerce.backend.dto.PurchaseResponse;
import com.ecommerce.backend.entity.Customer;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        Order order = purchase.getOrder();
        String trackingNumber = generateOrderTackingNumber();
        order.setOrderTrackingNumber(trackingNumber);

        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(order::add);
        order.setShippingAddress(purchase.getShippingAddress());
        order.setBillingAddress(purchase.getBillingAddress());
        Customer customer = purchase.getCustomer();
        String theEmail = customer.getEmail();
        Customer customerFromDB = customerRepository.findByEmail(theEmail);
        if (customerFromDB != null) {
            customer = customerFromDB;
        }
        customer.add(order);
        customerRepository.save(customer);
        return new PurchaseResponse(trackingNumber);
    }

    private String generateOrderTackingNumber() {
        return UUID.randomUUID().toString();
    }
}
