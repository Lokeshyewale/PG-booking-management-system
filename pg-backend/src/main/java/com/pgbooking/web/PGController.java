package com.pgbooking.web;

import com.pgbooking.model.PG;
import com.pgbooking.service.PGService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pgs")
public class PGController {

    private final PGService pgService;

    public PGController(PGService pgService) {
        this.pgService = pgService;
    }

    // Public: search verified PGs
    @GetMapping("/all")
    public ResponseEntity<List<PG>> getAllPGs(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String roomType,
            @RequestParam(required = false) Double minRent,
            @RequestParam(required = false) Double maxRent,
            @RequestParam(required = false) String amenity) {
        return ResponseEntity.ok(
            pgService.searchPGs(q, category, roomType, minRent, maxRent, amenity)
        );
    }

    // Public: get single PG
    @GetMapping("/{id}")
    public ResponseEntity<?> getPGById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(pgService.getPGById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}