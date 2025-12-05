package com.newKisan.controller;

import com.newKisan.entity.OrderStatus;
import com.newKisan.repository.OrderStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order-status")
@CrossOrigin(origins = "*")
public class OrderStatusController {

    @Autowired
    private OrderStatusRepository orderStatusRepository;

    @PostMapping
    public OrderStatus createOrderStatus(@RequestBody Map<String, Object> payload) {
        Long orderId = Long.parseLong(payload.get("orderId").toString());
        String status = (String) payload.get("status");
        String remarks = (String) payload.get("remarks");

        if (orderId == null || status == null) {
            throw new RuntimeException("orderId and status are required");
        }

        OrderStatus orderStatus = new OrderStatus(orderId, status, remarks);
        return orderStatusRepository.save(orderStatus);
    }

    @GetMapping("/order/{orderId}")
    public List<OrderStatus> getOrderHistory(@PathVariable Long orderId) {
        return orderStatusRepository.findByOrderIdOrderByChangedAtDesc(orderId);
    }

    @GetMapping("/{id}")
    public OrderStatus getOrderStatus(@PathVariable Long id) {
        return orderStatusRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order status not found"));
    }

    @DeleteMapping("/{id}")
    public void deleteOrderStatus(@PathVariable Long id) {
        orderStatusRepository.deleteById(id);
    }
}
