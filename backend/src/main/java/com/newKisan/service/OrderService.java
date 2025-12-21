package com.newKisan.service;

import com.newKisan.entity.Crop;
import com.newKisan.entity.Order;
import com.newKisan.entity.OrderStatus;
import com.newKisan.repository.CropRepository;
import com.newKisan.repository.OrderRepository;
import com.newKisan.repository.OrderStatusRepository;
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
    private OrderStatusRepository orderStatusRepo;
    
    @Autowired
    private com.newKisan.repository.NotificationRepository notificationRepo;
    
    @Autowired
    private com.newKisan.repository.UserRepository userRepo;
    
    @Autowired
    private com.newKisan.repository.FarmerRepository farmerRepo;
    
    @Autowired
    private com.newKisan.repository.BuyerRepository buyerRepo;

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
        Order saved = orderRepo.save(order);
        
        // Create initial order status history entry
        OrderStatus initialStatus = new OrderStatus(saved.getId(), "PENDING", "Order created by buyer");
        orderStatusRepo.save(initialStatus);
        
        return saved;
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
        
        // Track order status in history
        OrderStatus acceptedStatus = new OrderStatus(orderId, "ACCEPTED", "Order accepted by farmer");
        orderStatusRepo.save(acceptedStatus);

        // Fetch farmer and buyer details for contact information
        com.newKisan.entity.Farmer farmerDetails = null;
        com.newKisan.entity.Buyer buyerDetails = null;
        com.newKisan.entity.User farmerUser = null;
        com.newKisan.entity.User buyerUser = null;
        
        try {
            if (saved.getFarmerId() != null) {
                farmerDetails = farmerRepo.findById(saved.getFarmerId()).orElse(null);
                farmerUser = userRepo.findByUid(saved.getFarmerId());
            }
            if (saved.getBuyerUid() != null) {
                buyerDetails = buyerRepo.findById(saved.getBuyerUid()).orElse(null);
                buyerUser = userRepo.findByUid(saved.getBuyerUid());
            }
        } catch (Exception ex) {
            System.err.println("Error fetching farmer/buyer details: " + ex.getMessage());
        }

        // Create notification for buyer with farmer's contact details
        try {
            if (saved.getBuyerUid() != null) {
                String farmerPhone = farmerDetails != null ? farmerDetails.getMobile() : "N/A";
                String farmerName = saved.getFarmerName() != null ? saved.getFarmerName() : "Farmer";
                String msg = String.format("Order #%d ACCEPTED! 🎉\nCrop: %s (%d kg)\nFarmer: %s\nPhone: %s\n\nContact farmer to arrange delivery.", 
                    saved.getId(), saved.getCropType(), saved.getQuantity(), farmerName, farmerPhone);
                com.newKisan.entity.Notification n = new com.newKisan.entity.Notification(saved.getBuyerUid(), msg);
                notificationRepo.save(n);
            }
        } catch (Exception ex) {
            System.err.println("Failed to create buyer notification: " + ex.getMessage());
        }

        // Create notification for farmer with buyer's contact details
        try {
            if (saved.getFarmerId() != null) {
                String buyerPhone = buyerDetails != null ? buyerDetails.getMobile() : "N/A";
                String buyerName = saved.getBuyerName() != null ? saved.getBuyerName() : "Buyer";
                String msg = String.format("You accepted order #%d! ✅\nCrop: %s (%d kg)\nBuyer: %s\nPhone: %s\n\nContact buyer to confirm delivery details.", 
                    saved.getId(), saved.getCropType(), saved.getQuantity(), buyerName, buyerPhone);
                com.newKisan.entity.Notification n = new com.newKisan.entity.Notification(saved.getFarmerId(), msg);
                notificationRepo.save(n);
            }
        } catch (Exception ex) {
            System.err.println("Failed to create farmer notification: " + ex.getMessage());
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
        Order saved = orderRepo.save(order);
        
        // Track order status in history
        OrderStatus rejectedStatus = new OrderStatus(orderId, "REJECTED", "Order rejected by farmer");
        orderStatusRepo.save(rejectedStatus);
        
        // create a notification for buyer
        try {
            if (saved.getBuyerUid() != null) {
                String msg = String.format("Your order #%d for %s has been rejected by the farmer.", saved.getId(), saved.getCropType());
                com.newKisan.entity.Notification n = new com.newKisan.entity.Notification(saved.getBuyerUid(), msg);
                notificationRepo.save(n);
            }
        } catch (Exception ex) {
            System.err.println("Failed to create notification: " + ex.getMessage());
        }
        
        return saved;
    }

    @Transactional
    public void deleteOrder(Long orderId) {
        boolean exists = orderRepo.existsById(orderId);
        if (!exists) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found");
        }
        orderRepo.deleteById(orderId);
    }
}