package com.pgbooking.web;

import com.pgbooking.model.Booking;
import com.pgbooking.model.PG;
import com.pgbooking.model.User;
import com.pgbooking.repository.BookingRepository;
import com.pgbooking.repository.PGRepository;
import com.pgbooking.repository.UserRepository;
import com.pgbooking.service.PGService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final PGService         pgService;
    private final PGRepository      pgRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository    userRepository;

    public AdminController(PGService pgService,
                           PGRepository pgRepository,
                           BookingRepository bookingRepository,
                           UserRepository userRepository) {
        this.pgService         = pgService;
        this.pgRepository      = pgRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository    = userRepository;
    }

    // Safe string helper - replaces null with empty string
    private String safe(String val) {
        return val != null ? val : "";
    }

    // Build booking map safely (avoids Map.of() null crash)
    private Map<String, Object> toBookingMap(Booking b) {
        Map<String, Object> map = new HashMap<>();
        map.put("id",            b.getId());
        map.put("studentName",   safe(b.getUser() != null ? b.getUser().getName() : null));
        map.put("studentEmail",  safe(b.getUser() != null ? b.getUser().getEmail() : null));
        map.put("pgName",        safe(b.getPg() != null ? b.getPg().getName() : null));
        map.put("pgCity",        safe(b.getPg() != null ? b.getPg().getCity() : null));
        map.put("pgCategory",    safe(b.getPg() != null ? b.getPg().getCategory() : null));
        map.put("ownerName",     safe(b.getPg() != null && b.getPg().getOwner() != null
                                     ? b.getPg().getOwner().getName() : null));
        map.put("ownerEmail",    safe(b.getPg() != null && b.getPg().getOwner() != null
                                     ? b.getPg().getOwner().getEmail() : null));
        map.put("checkInDate",   b.getCheckInDate() != null ? b.getCheckInDate().toString() : "");
        map.put("checkOutDate",  b.getCheckOutDate() != null ? b.getCheckOutDate().toString() : "");
        map.put("totalAmount",   b.getTotalAmount());
        map.put("platformFee",   b.getPlatformFee());
        map.put("ownerEarnings", b.getOwnerEarnings());
        map.put("status",        b.getStatus() != null ? b.getStatus().name() : "PENDING");
        map.put("bookingDate",   b.getBookingDate() != null ? b.getBookingDate().toString() : "");
        return map;
    }

    // ── Dashboard stats ──
    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard() {
        try {
            List<PG>      allPGs      = pgRepository.findAll();
            List<Booking> allBookings = bookingRepository.findAll();
            List<User>    allUsers    = userRepository.findAll();

            long totalPGs          = allPGs.size();
            long verifiedPGs       = allPGs.stream().filter(PG::isVerified).count();
            long pendingPGs        = allPGs.stream()
                .filter(p -> "PENDING".equals(p.getVerificationStatus())).count();
            long totalBookings     = allBookings.size();
            long confirmedBookings = allBookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus().name())).count();
            long totalUsers        = allUsers.stream()
                .filter(u -> "USER".equals(u.getRole().name())).count();
            long totalOwners       = allUsers.stream()
                .filter(u -> "OWNER".equals(u.getRole().name())).count();

            double totalRevenue     = allBookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus().name()))
                .mapToDouble(Booking::getTotalAmount).sum();
            double platformEarnings = allBookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus().name()))
                .mapToDouble(Booking::getPlatformFee).sum();
            double ownerPayouts     = allBookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus().name()))
                .mapToDouble(Booking::getOwnerEarnings).sum();

            List<Map<String, Object>> recentBookings = allBookings.stream()
                .sorted((a, b) -> b.getBookingDate().compareTo(a.getBookingDate()))
                .limit(10)
                .map(this::toBookingMap)
                .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("totalPGs",          totalPGs);
            response.put("verifiedPGs",        verifiedPGs);
            response.put("pendingPGs",         pendingPGs);
            response.put("totalBookings",      totalBookings);
            response.put("confirmedBookings",  confirmedBookings);
            response.put("totalUsers",         totalUsers);
            response.put("totalOwners",        totalOwners);
            response.put("totalRevenue",       totalRevenue);
            response.put("platformEarnings",   platformEarnings);
            response.put("ownerPayouts",       ownerPayouts);
            response.put("recentBookings",     recentBookings);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("message", "Dashboard error: " + e.getMessage()));
        }
    }

    // ── All bookings ──
    @GetMapping("/bookings")
    public ResponseEntity<?> getAllBookings() {
        try {
            List<Map<String, Object>> bookings = bookingRepository.findAll().stream()
                .sorted((a, b) -> b.getBookingDate().compareTo(a.getBookingDate()))
                .map(this::toBookingMap)
                .collect(Collectors.toList());
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("message", "Error fetching bookings: " + e.getMessage()));
        }
    }

    // ── All users ──
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<Map<String, Object>> users = userRepository.findAll().stream()
                .map(u -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id",    u.getId());
                    m.put("name",  safe(u.getName()));
                    m.put("email", safe(u.getEmail()));
                    m.put("role",  u.getRole() != null ? u.getRole().name() : "USER");
                    return m;
                })
                .collect(Collectors.toList());
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("message", "Error fetching users: " + e.getMessage()));
        }
    }

    // ── Owner earnings breakdown ──
    @GetMapping("/owner-earnings")
    public ResponseEntity<?> ownerEarnings() {
        try {
            List<Map<String, Object>> breakdown = userRepository.findAll().stream()
                .filter(u -> "OWNER".equals(u.getRole().name()))
                .map(owner -> {
                    List<Booking> ownerBookings = bookingRepository.findByPg_Owner(owner);
                    double total = ownerBookings.stream()
                        .filter(b -> "CONFIRMED".equals(b.getStatus().name()))
                        .mapToDouble(Booking::getOwnerEarnings).sum();
                    long confirmed = ownerBookings.stream()
                        .filter(b -> "CONFIRMED".equals(b.getStatus().name())).count();
                    long pgCount = pgRepository.findByOwner(owner).size();

                    Map<String, Object> m = new HashMap<>();
                    m.put("ownerName",         safe(owner.getName()));
                    m.put("ownerEmail",        safe(owner.getEmail()));
                    m.put("totalPGs",          pgCount);
                    m.put("totalBookings",     ownerBookings.size());
                    m.put("confirmedBookings", confirmed);
                    m.put("totalEarnings",     total);
                    return m;
                })
                .collect(Collectors.toList());
            return ResponseEntity.ok(breakdown);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("message", "Error fetching owner earnings: " + e.getMessage()));
        }
    }

    // ── Pending PGs ──
    @GetMapping("/pgs/pending")
    public ResponseEntity<?> getPendingPGs() {
        try {
            return ResponseEntity.ok(pgService.getPendingPGs());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("message", "Error fetching pending PGs: " + e.getMessage()));
        }
    }

    // ── Verify a PG ──
    @PutMapping("/pgs/{id}/verify")
    public ResponseEntity<?> verifyPG(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            boolean approve = "APPROVED".equalsIgnoreCase(body.get("action"));
            PG pg = pgService.verifyPG(id, approve);
            return ResponseEntity.ok(Map.of(
                "message", approve
                    ? "PG approved and is now visible to students"
                    : "PG rejected"
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }
}