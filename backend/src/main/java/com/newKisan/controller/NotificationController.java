package com.newKisan.controller;

import com.newKisan.entity.Notification;
import com.newKisan.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/{buyerUid}")
    public List<Notification> getNotifications(@PathVariable String buyerUid) {
        return notificationRepository.findByBuyerUidOrderByCreatedAtDesc(buyerUid);
    }

    @PostMapping
    public Notification createNotification(@RequestBody Map<String, String> payload) {
        String buyerUid = payload.get("buyerUid");
        String message = payload.get("message");
        
        if (buyerUid == null || message == null) {
            throw new RuntimeException("buyerUid and message are required");
        }
        
        Notification notification = new Notification(buyerUid, message);
        return notificationRepository.save(notification);
    }

    @PutMapping("/{id}/read")
    public Notification markRead(@PathVariable Long id) {
        Notification n = notificationRepository.findById(id).orElseThrow(() -> new RuntimeException("Notification not found"));
        n.setReadFlag(true);
        return notificationRepository.save(n);
    }
    
    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable Long id) {
        notificationRepository.deleteById(id);
    }
}

