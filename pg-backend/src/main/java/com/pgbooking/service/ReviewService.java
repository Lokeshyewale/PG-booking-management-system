package com.pgbooking.service;

import com.pgbooking.model.PG;
import com.pgbooking.model.Review;
import com.pgbooking.model.User;
import com.pgbooking.repository.PGRepository;
import com.pgbooking.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final PGRepository pgRepository;

    public ReviewService(ReviewRepository reviewRepository, PGRepository pgRepository) {
        this.reviewRepository = reviewRepository;
        this.pgRepository = pgRepository;
    }

    public List<Review> getByPgId(Long pgId) {
        PG pg = pgRepository.findById(pgId)
                .orElseThrow(() -> new IllegalArgumentException("PG not found"));
        return reviewRepository.findByPg(pg);
    }

    @Transactional
    public Review addReview(int rating, String comment, Long pgId, User user) {
        PG pg = pgRepository.findById(pgId)
                .orElseThrow(() -> new IllegalArgumentException("PG not found"));

        if (reviewRepository.existsByUserIdAndPgId(user.getId(), pgId)) {
            throw new IllegalArgumentException("You have already reviewed this PG");
        }

        Review review = new Review(rating, comment, pg, user);
        Review saved = reviewRepository.save(review);

        // Recalculate PG rating
        List<Review> all = reviewRepository.findByPg(pg);
        double avg = all.stream().mapToInt(Review::getRating).average().orElse(rating);
        pg.setRating(Math.round(avg * 10.0) / 10.0);
        pg.setReviewCount(all.size());
        pgRepository.save(pg);

        return saved;
    }
}