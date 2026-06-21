package com.pgbooking.repository;

import com.pgbooking.model.Booking;
import com.pgbooking.model.PG;
import com.pgbooking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    List<Booking> findByPg(PG pg);
    List<Booking> findByPg_Owner(User owner);

    @Query("SELECT COALESCE(SUM(b.ownerEarnings), 0) FROM Booking b WHERE b.pg.owner = :owner AND b.status = 'CONFIRMED'")
    double sumOwnerEarnings(User owner);

    long countByPg_Owner(User owner);
}