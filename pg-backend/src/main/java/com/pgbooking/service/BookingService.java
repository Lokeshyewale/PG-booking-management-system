package com.pgbooking.service;

import com.pgbooking.model.*;
import com.pgbooking.repository.BookingRepository;
import com.pgbooking.repository.PGRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository    bookingRepository;
    private final PGRepository         pgRepository;
    private final NotificationService  notificationService;

    public BookingService(BookingRepository bookingRepository,
                          PGRepository pgRepository,
                          NotificationService notificationService) {
        this.bookingRepository   = bookingRepository;
        this.pgRepository        = pgRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public Booking createBooking(User student, Long pgId,
                                  LocalDate checkIn, LocalDate checkOut) {
        PG pg = pgRepository.findById(pgId)
            .orElseThrow(() -> new IllegalArgumentException("PG not found"));

        if (!pg.isVerified())
            throw new IllegalArgumentException("This PG is not verified and cannot be booked");

        Booking booking = new Booking(student, pg, checkIn, checkOut);
        booking.setStatus(BookingStatus.PENDING);
        return bookingRepository.save(booking);
    }

    // Called after Razorpay payment success - auto-confirms booking
    @Transactional
    public Booking updateStatusAfterPayment(Long bookingId, User student) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (!booking.getUser().getId().equals(student.getId()))
            throw new IllegalArgumentException("Not authorized");

        booking.setStatus(BookingStatus.CONFIRMED);
        Booking saved = bookingRepository.save(booking);

        // Notify student
        notificationService.send(student,
            "Booking Confirmed!",
            "Your booking for " + booking.getPg().getName() +
            " has been confirmed after successful payment. " +
            "Check-in: " + booking.getCheckInDate());

        // Notify owner
        notificationService.send(booking.getPg().getOwner(),
            "New Confirmed Booking",
            "Student " + student.getName() +
            " has paid and confirmed booking for " + booking.getPg().getName() +
            ". Check-in: " + booking.getCheckInDate() +
            ". Your earnings: ₹" + (long)booking.getOwnerEarnings());

        return saved;
    }

    // Owner manually confirms or rejects (for bookings without payment)
    @Transactional
    public Booking updateStatus(Long bookingId, BookingStatus newStatus, User owner) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (!booking.getPg().getOwner().getId().equals(owner.getId()))
            throw new IllegalArgumentException("Not authorized to update this booking");

        booking.setStatus(newStatus);
        Booking updated = bookingRepository.save(booking);

        String msg = newStatus == BookingStatus.CONFIRMED
            ? "Your booking for " + booking.getPg().getName() + " has been CONFIRMED by the owner!"
            : "Your booking for " + booking.getPg().getName() + " was rejected by the owner.";

        notificationService.send(booking.getUser(), "Booking Update", msg);
        return updated;
    }

    public List<Booking> getBookingsForStudent(User student) {
        return bookingRepository.findByUser(student);
    }

    public List<Booking> getBookingsForOwner(User owner) {
        return bookingRepository.findByPg_Owner(owner);
    }

    public long countByOwner(User owner) {
        return bookingRepository.countByPg_Owner(owner);
    }

    public double totalEarnings(User owner) {
        return bookingRepository.sumOwnerEarnings(owner);
    }
}