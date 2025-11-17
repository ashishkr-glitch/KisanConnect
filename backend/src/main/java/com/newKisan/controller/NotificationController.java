package com.newKisan.controller;

import com.newKisan.entity.Notification;
import com.newKisan.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/{buyerUid}")
    public List<Notification> getNotifications(@PathVariable String buyerUid) {
        return notificationRepository.findByBuyerUidOrderByCreatedAtDesc(buyerUid);
    }

    @PutMapping("/{id}/read")
    public Notification markRead(@PathVariable Long id) {
        Notification n = notificationRepository.findById(id).orElseThrow(() -> new RuntimeException("Notification not found"));
        n.setReadFlag(true);
        return notificationRepository.save(n);
    }
}
