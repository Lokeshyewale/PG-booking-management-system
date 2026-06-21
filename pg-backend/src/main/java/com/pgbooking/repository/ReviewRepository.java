package com.pgbooking.repository;

import com.pgbooking.model.PG;
import com.pgbooking.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByPg(PG pg);
    boolean existsByUserIdAndPgId(Long userId, Long pgId);
}