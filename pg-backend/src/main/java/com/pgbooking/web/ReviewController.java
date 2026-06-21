package com.pgbooking.web;

import com.pgbooking.model.Review;
import com.pgbooking.model.User;
import com.pgbooking.service.ReviewService;
import com.pgbooking.util.SecurityUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // Public: get reviews for a PG
    @GetMapping("/pg/{pgId}")
    public ResponseEntity<List<Review>> getReviews(@PathVariable Long pgId) {
        return ResponseEntity.ok(reviewService.getByPgId(pgId));
    }

    // Authenticated: add a review
    @PostMapping("/add")
    public ResponseEntity<?> addReview(@RequestBody Map<String, Object> body) {
        User user = SecurityUtil.getCurrentUser();
        if (user == null) return ResponseEntity.status(401).body(Map.of("message","Please login first"));
        try {
            Long   pgId    = Long.valueOf(body.get("pgId").toString());
            int    rating  = Integer.parseInt(body.get("rating").toString());
            String comment = body.get("comment").toString();
            Review review  = reviewService.addReview(rating, comment, pgId, user);
            return ResponseEntity.ok(Map.of("message","Review added","data", review));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}