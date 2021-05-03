package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.Purchase;
import com.ecommerce.backend.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
