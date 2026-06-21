package com.pgbooking.web;

import com.pgbooking.model.Booking;
import com.pgbooking.model.User;
import com.pgbooking.service.BookingService;
import com.pgbooking.service.PaymentService;
import com.pgbooking.util.SecurityUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final BookingService bookingService;

    public PaymentController(PaymentService paymentService,
                              BookingService bookingService) {
        this.paymentService = paymentService;
        this.bookingService = bookingService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, String> body) {
        User student = SecurityUtil.getCurrentUser();
        if (student == null)
            return ResponseEntity.status(401).body(Map.of("message", "Please login first"));
        try {
            Long      pgId     = Long.parseLong(body.get("pgId"));
            LocalDate checkIn  = LocalDate.parse(body.get("checkInDate"));
            LocalDate checkOut = LocalDate.parse(body.get("checkOutDate"));

            // Create booking with PENDING status
            Booking booking = bookingService.createBooking(student, pgId, checkIn, checkOut);

            // Create Razorpay order
            Map<String, Object> order = paymentService.createOrder(
                (long)(booking.getTotalAmount() * 100),
                "INR",
                "booking_" + booking.getId()
            );

            return ResponseEntity.ok(Map.of(
                "message",   "Order created successfully",
                "orderId",   order.get("id"),
                "amount",    booking.getTotalAmount(),
                "currency",  "INR",
                "bookingId", booking.getId(),
                "pgName",    booking.getPg().getName()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> body) {
        User student = SecurityUtil.getCurrentUser();
        if (student == null)
            return ResponseEntity.status(401).body(Map.of("message", "Please login first"));
        try {
            String razorpayOrderId   = body.get("razorpayOrderId");
            String razorpayPaymentId = body.get("razorpayPaymentId");
            String razorpaySignature = body.get("razorpaySignature");
            Long   bookingId         = Long.parseLong(body.get("bookingId"));

            boolean valid = paymentService.verifySignature(
                razorpayOrderId, razorpayPaymentId, razorpaySignature
            );

            if (!valid)
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Payment verification failed"));

            Booking confirmed = bookingService.updateStatusAfterPayment(bookingId, student);

            return ResponseEntity.ok(Map.of(
                "message",   "Payment verified! Booking confirmed.",
                "bookingId", confirmed.getId(),
                "status",    confirmed.getStatus().name()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }
}