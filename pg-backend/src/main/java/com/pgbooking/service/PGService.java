package com.pgbooking.service;

import com.pgbooking.model.PG;
import com.pgbooking.model.User;
import com.pgbooking.repository.PGRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Stream;

@Service
public class PGService {

    private final PGRepository pgRepository;

    public PGService(PGRepository pgRepository) {
        this.pgRepository = pgRepository;
    }

    // Students only see verified PGs
    public List<PG> searchPGs(String q, String category, String roomType,
                               Double minRent, Double maxRent, String amenity) {
        return pgRepository.findByVerifiedTrue().stream()
                .filter(pg -> matchesQuery(pg, q))
                .filter(pg -> matchesCategory(pg, category))
                .filter(pg -> matchesType(pg, roomType))
                .filter(pg -> minRent == null || pg.getRent() >= minRent)
                .filter(pg -> maxRent == null || pg.getRent() <= maxRent)
                .filter(pg -> matchesAmenity(pg, amenity))
                .toList();
    }

    public PG getPGById(Long id) {
        return pgRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("PG not found"));
    }

    public PG createPG(PG pg, User owner) {
        pg.setOwner(owner);
        pg.setVerified(false);
        pg.setVerificationStatus("PENDING");
        return pgRepository.save(pg);
    }

    public List<PG> getPGsByOwner(User owner) {
        return pgRepository.findByOwner(owner);
    }

    // Admin: get all unverified PGs
    public List<PG> getPendingPGs() {
        return pgRepository.findByVerificationStatus("PENDING");
    }

    // Admin: verify a PG
    public PG verifyPG(Long pgId, boolean approve) {
        PG pg = pgRepository.findById(pgId)
                .orElseThrow(() -> new IllegalArgumentException("PG not found"));
        pg.setVerified(approve);
        pg.setVerificationStatus(approve ? "APPROVED" : "REJECTED");
        return pgRepository.save(pg);
    }

    public PG updatePG(Long pgId, PG updates, User owner) {
        PG pg = pgRepository.findById(pgId)
                .orElseThrow(() -> new IllegalArgumentException("PG not found"));
        if (!pg.getOwner().getId().equals(owner.getId())) {
            throw new IllegalArgumentException("Not authorized");
        }
        pg.setName(updates.getName());
        pg.setAddress(updates.getAddress());
        pg.setCity(updates.getCity());
        pg.setDescription(updates.getDescription());
        pg.setRent(updates.getRent());
        pg.setAvailableRooms(updates.getAvailableRooms());
        pg.setType(updates.getType());
        pg.setCategory(updates.getCategory());
        pg.setSize(updates.getSize());
        pg.setPrimaryImage(updates.getPrimaryImage());
        pg.setAmenities(updates.getAmenities());
        pg.setImages(updates.getImages());
        // Changing details resets verification
        pg.setVerified(false);
        pg.setVerificationStatus("PENDING");
        return pgRepository.save(pg);
    }

    public void deletePG(Long pgId, User owner) {
        PG pg = pgRepository.findById(pgId)
                .orElseThrow(() -> new IllegalArgumentException("PG not found"));
        if (!pg.getOwner().getId().equals(owner.getId())) {
            throw new IllegalArgumentException("Not authorized");
        }
        pgRepository.delete(pg);
    }

    // --- private filters ---
    private boolean matchesQuery(PG pg, String q) {
        if (q == null || q.isBlank()) return true;
        String n = q.toLowerCase();
        return Stream.of(pg.getName(), pg.getCity(), pg.getDescription(),
                         pg.getAddress(), pg.getType(), pg.getCategory())
                .filter(s -> s != null)
                .anyMatch(s -> s.toLowerCase().contains(n))
            || pg.getAmenities().stream().anyMatch(a -> a.toLowerCase().contains(n));
    }

    private boolean matchesCategory(PG pg, String category) {
        if (category == null || category.isBlank() || category.equalsIgnoreCase("all")) return true;
        return category.equalsIgnoreCase(pg.getCategory());
    }

    private boolean matchesType(PG pg, String type) {
        if (type == null || type.isBlank()) return true;
        return type.equalsIgnoreCase(pg.getType());
    }

    private boolean matchesAmenity(PG pg, String amenity) {
        if (amenity == null || amenity.isBlank()) return true;
        for (String needed : amenity.split(",")) {
            String t = needed.trim();
            if (t.isEmpty()) continue;
            if (pg.getAmenities().stream().noneMatch(a -> a.equalsIgnoreCase(t))) return false;
        }
        return true;
    }
}