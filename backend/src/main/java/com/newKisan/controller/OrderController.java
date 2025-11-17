package com.newKisan.controller;

import com.newKisan.entity.Order;
import com.newKisan.service.OrderService;
import com.newKisan.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private AuthService authService;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/buyer/{buyerUid}")
    public List<Order> getOrdersByBuyer(@PathVariable String buyerUid) {
        return orderService.getOrdersByBuyer(buyerUid);
    }

    @GetMapping("/farmer/{farmerId}")
    public List<Order> getOrdersByFarmer(@PathVariable String farmerId) {
        return orderService.getOrdersByFarmer(farmerId);
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderService.createOrder(order);
    }

    @PutMapping("/{id}/accept")
    public Order acceptOrder(@PathVariable("id") Long id,
                              @RequestHeader(value = "Authorization", required = false) String authorization,
                              @RequestBody(required = false) FarmerActionPayload payload) {
        // Prefer server-verified uid from Authorization header. If not present, fall back to payload.farmerId
        String verifiedUid = null;
        try {
            verifiedUid = authService.verifyAndGetUid(authorization);
        } catch (Exception e) {
            // ignore - will fall back to payload
        }
        String farmerId = verifiedUid != null ? verifiedUid : (payload == null ? null : payload.getFarmerId());
        return orderService.acceptOrder(id, farmerId);
    }

    @PutMapping("/{id}/reject")
    public Order rejectOrder(@PathVariable("id") Long id,
                              @RequestHeader(value = "Authorization", required = false) String authorization,
                              @RequestBody(required = false) FarmerActionPayload payload) {
        String verifiedUid = null;
        try {
            verifiedUid = authService.verifyAndGetUid(authorization);
        } catch (Exception e) {
            // ignore - will fall back to payload
        }
        String farmerId = verifiedUid != null ? verifiedUid : (payload == null ? null : payload.getFarmerId());
        return orderService.rejectOrder(id, farmerId);
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable("id") Long id) {
        orderService.deleteOrder(id);
    }
}

class FarmerActionPayload {
    private String farmerId;

    public String getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(String farmerId) {
        this.farmerId = farmerId;
    }
}
