package com.pgbooking.web;

import com.pgbooking.model.Booking;
import com.pgbooking.model.User;
import com.pgbooking.service.BookingService;
import com.pgbooking.util.SecurityUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Student creates a booking
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Map<String, String> body) {
        User student = SecurityUtil.getCurrentUser();
        if (student == null) return ResponseEntity.status(401).body(Map.of("message","Please login first"));
        try {
            Long      pgId     = Long.parseLong(body.get("pgId"));
            LocalDate checkIn  = LocalDate.parse(body.get("checkInDate"));
            LocalDate checkOut = LocalDate.parse(body.get("checkOutDate"));
            Booking   booking  = bookingService.createBooking(student, pgId, checkIn, checkOut);
            return ResponseEntity.ok(Map.of("message","Booking submitted successfully","data", booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Student: my bookings
    @GetMapping("/my")
    public ResponseEntity<List<Booking>> myBookings() {
        User student = SecurityUtil.getCurrentUser();
        return ResponseEntity.ok(bookingService.getBookingsForStudent(student));
    }
}