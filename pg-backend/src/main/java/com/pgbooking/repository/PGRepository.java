package com.pgbooking.repository;

import com.pgbooking.model.PG;
import com.pgbooking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PGRepository extends JpaRepository<PG, Long> {
    List<PG> findByOwner(User owner);
    List<PG> findByVerifiedTrue();
    List<PG> findByVerificationStatus(String status);
}