package com.pgbooking.web;

import com.pgbooking.model.*;
import com.pgbooking.service.BookingService;
import com.pgbooking.service.PGService;
import com.pgbooking.util.SecurityUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/owner")
@PreAuthorize("hasAnyAuthority('ROLE_OWNER','ROLE_ADMIN')")
public class OwnerController {

    private final PGService pgService;
    private final BookingService bookingService;

    public OwnerController(PGService pgService, BookingService bookingService) {
        this.pgService = pgService;
        this.bookingService = bookingService;
    }

    // Add a new PG listing
    @PostMapping("/pg/add")
    public ResponseEntity<?> addPG(@RequestBody PG pg) {
        User owner = SecurityUtil.getCurrentUser();
        if (owner == null) return ResponseEntity.status(401).body(Map.of("message","Unauthorized"));
        try {
            PG created = pgService.createPG(pg, owner);
            return ResponseEntity.ok(Map.of(
                "message", "PG submitted for verification. Admin will review it shortly.",
                "data", created
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Get owner's own PG listings
    @GetMapping("/pg/my")
    public ResponseEntity<List<PG>> getMyPGs() {
        User owner = SecurityUtil.getCurrentUser();
        return ResponseEntity.ok(pgService.getPGsByOwner(owner));
    }

    // Update a PG
    @PutMapping("/pg/{id}")
    public ResponseEntity<?> updatePG(@PathVariable Long id, @RequestBody PG updates) {
        User owner = SecurityUtil.getCurrentUser();
        if (owner == null) return ResponseEntity.status(401).body(Map.of("message","Unauthorized"));
        try {
            PG updated = pgService.updatePG(id, updates, owner);
            return ResponseEntity.ok(Map.of(
                "message", "PG updated. Re-submitted for verification.",
                "data", updated
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Delete a PG
    @DeleteMapping("/pg/{id}")
    public ResponseEntity<?> deletePG(@PathVariable Long id) {
        User owner = SecurityUtil.getCurrentUser();
        if (owner == null) return ResponseEntity.status(401).body(Map.of("message","Unauthorized"));
        try {
            pgService.deletePG(id, owner);
            return ResponseEntity.ok(Map.of("message","PG deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Owner dashboard summary
    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard() {
        User owner = SecurityUtil.getCurrentUser();
        if (owner == null) return ResponseEntity.status(401).body(Map.of("message","Unauthorized"));

        List<PG>      myPGs     = pgService.getPGsByOwner(owner);
        List<Booking> bookings  = bookingService.getBookingsForOwner(owner);
        long          total     = bookingService.countByOwner(owner);
        double        earnings  = bookingService.totalEarnings(owner);

        // Recent 5 bookings
        List<Booking> recent = bookings.stream()
            .sorted((a,b) -> b.getBookingDate().compareTo(a.getBookingDate()))
            .limit(5)
            .toList();

        return ResponseEntity.ok(Map.of(
            "totalPGs",       myPGs.size(),
            "totalBookings",  total,
            "totalEarnings",  earnings,
            "recentBookings", recent
        ));
    }

    // Owner: confirm or reject a booking
    @PutMapping("/booking/{id}/status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        User owner = SecurityUtil.getCurrentUser();
        if (owner == null) return ResponseEntity.status(401).body(Map.of("message","Unauthorized"));
        try {
            BookingStatus status = BookingStatus.valueOf(body.get("status").toUpperCase());
            Booking updated = bookingService.updateStatus(id, status, owner);
            return ResponseEntity.ok(Map.of("message","Booking status updated","data", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}