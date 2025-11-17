package com.newKisan.service;

import com.newKisan.entity.Crop;
import com.newKisan.entity.Order;
import com.newKisan.repository.CropRepository;
import com.newKisan.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private CropRepository cropRepo;
    
    @Autowired
    private com.newKisan.repository.NotificationRepository notificationRepo;

    @Transactional
    public Order createOrder(Order order) {
        // validate crop exists and has enough quantity
        if (order.getCropId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "cropId is required");
        }

        if (!cropRepo.existsById(order.getCropId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Crop not found");
        }

        if (order.getQuantity() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be greater than zero");
        }

        // Do not decrement crop quantity on order creation.
        // Orders are created in PENDING state and the farmer will accept/reject later.
        if (order.getStatus() == null || order.getStatus().isBlank()) {
            order.setStatus("PENDING");
        }

        // persist the order (no stock modification here)
        return orderRepo.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }

    public List<Order> getOrdersByBuyer(String buyerUid) {
        return orderRepo.findByBuyerUid(buyerUid);
    }

    public List<Order> getOrdersByFarmer(String farmerId) {
        return orderRepo.findByFarmerId(farmerId);
    }

    @Transactional
    public Order acceptOrder(Long orderId, String farmerId) {
        Order order = orderRepo.findById(orderId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (order.getFarmerId() != null && farmerId != null && !order.getFarmerId().equals(farmerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Farmer not authorized to accept this order");
        }

        if ("ACCEPTED".equals(order.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order already accepted");
        }
        if ("REJECTED".equals(order.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order already rejected");
        }

        // validate crop stock at acceptance time and decrement atomically
        Crop crop = cropRepo.findById(order.getCropId()).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.BAD_REQUEST, "Crop not found"));

        if (crop.getQuantity() < order.getQuantity()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient crop quantity available to accept order");
        }

        crop.setQuantity(crop.getQuantity() - order.getQuantity());
        cropRepo.save(crop);

        order.setStatus("ACCEPTED");
        Order saved = orderRepo.save(order);

        // create a notification for buyer
        try {
            if (saved.getBuyerUid() != null) {
                String msg = String.format("Your order #%d for %s (%d kg) has been accepted.", saved.getId(), saved.getCropType(), saved.getQuantity());
                com.newKisan.entity.Notification n = new com.newKisan.entity.Notification(saved.getBuyerUid(), msg);
                notificationRepo.save(n);
            }
        } catch (Exception ex) {
            // do not fail acceptance if notification can't be created; just log
            System.err.println("Failed to create notification: " + ex.getMessage());
        }

        return saved;
    }

    @Transactional
    public Order rejectOrder(Long orderId, String farmerId) {
        Order order = orderRepo.findById(orderId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (order.getFarmerId() != null && farmerId != null && !order.getFarmerId().equals(farmerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Farmer not authorized to reject this order");
        }

        order.setStatus("REJECTED");
        return orderRepo.save(order);
    }

    @Transactional
    public void deleteOrder(Long orderId) {
        Order order = orderRepo.findById(orderId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        orderRepo.deleteById(orderId);
    }
