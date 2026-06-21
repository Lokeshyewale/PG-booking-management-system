package com.pgbooking.web;

import com.pgbooking.model.Notification;
import com.pgbooking.model.User;
import com.pgbooking.service.NotificationService;
import com.pgbooking.util.SecurityUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyNotifications() {
        User user = SecurityUtil.getCurrentUser();
        if (user == null) return ResponseEntity.status(401).body(Map.of("message","Unauthorized"));
        List<Notification> list = notificationService.getNotifications(user);
        return ResponseEntity.ok(list);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markRead(@PathVariable Long id) {
        User user = SecurityUtil.getCurrentUser();
        if (user == null) return ResponseEntity.status(401).body(Map.of("message","Unauthorized"));
        try {
            Notification n = notificationService.markAsRead(id, user);
            return ResponseEntity.ok(Map.of("message","Marked as read","data", n));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}