package com.pgbooking;

import com.pgbooking.model.*;
import com.pgbooking.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@SpringBootApplication
public class PgBookingApplication {

    public static void main(String[] args) {
        SpringApplication.run(PgBookingApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedData(UserRepository userRepository,
                                      PGRepository pgRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() > 0) return;

            // Seed users
            User admin   = new User("Admin User",   "admin@comfortpg.com",
                                    passwordEncoder.encode("admin123"),   Role.ADMIN);
            User owner   = new User("Owner User",   "owner@comfortpg.com",
                                    passwordEncoder.encode("owner123"),   Role.OWNER);
            User student = new User("Student User", "student@comfortpg.com",
                                    passwordEncoder.encode("student123"), Role.USER);
            userRepository.saveAll(List.of(admin, owner, student));

            // Seed PGs (pre-verified so students can see them immediately)
            PG pg1 = new PG();
            pg1.setName("Cityview Boys PG");
            pg1.setAddress("123 Central Street");
            pg1.setCity("Mumbai");
            pg1.setDescription("Well-maintained boys PG with AC rooms, meals, and Wi-Fi near office hubs.");
            pg1.setRent(9000);
            pg1.setAvailableRooms(6);
            pg1.setCategory("Boys PG");
            pg1.setType("Single");
            pg1.setSize("120 sq ft");
            pg1.setPrimaryImage("https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800");
            pg1.setAmenities(List.of("Wi-Fi","AC","Meals","Housekeeping","Laundry","Security"));
            pg1.setImages(List.of(
                "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800",
                "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"
            ));
            pg1.setOwner(owner);
            pg1.setVerified(true);
            pg1.setVerificationStatus("APPROVED");

            PG pg2 = new PG();
            pg2.setName("Comfort Girls PG");
            pg2.setAddress("58 Garden Avenue");
            pg2.setCity("Pune");
            pg2.setDescription("Secure girls PG with meals, Wi-Fi, and laundry facilities near university.");
            pg2.setRent(11000);
            pg2.setAvailableRooms(4);
            pg2.setCategory("Girls PG");
            pg2.setType("Double");
            pg2.setSize("150 sq ft");
            pg2.setPrimaryImage("https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800");
            pg2.setAmenities(List.of("Wi-Fi","Meals","Laundry","Security","Study Table"));
            pg2.setImages(List.of(
                "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800",
                "https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=800"
            ));
            pg2.setOwner(owner);
            pg2.setVerified(true);
            pg2.setVerificationStatus("APPROVED");

            PG pg3 = new PG();
            pg3.setName("Green Valley Mixed PG");
            pg3.setAddress("22 Tech Park Road");
            pg3.setCity("Bangalore");
            pg3.setDescription("Modern co-living space for IT professionals and students near Electronic City.");
            pg3.setRent(13500);
            pg3.setAvailableRooms(8);
            pg3.setCategory("Mixed PG");
            pg3.setType("Single");
            pg3.setSize("140 sq ft");
            pg3.setPrimaryImage("https://images.pexels.com/photos/775219/pexels-photo-775219.jpeg?auto=compress&cs=tinysrgb&w=800");
            pg3.setAmenities(List.of("Wi-Fi","AC","Gym","Meals","Parking","Laundry"));
            pg3.setImages(List.of(
                "https://images.pexels.com/photos/775219/pexels-photo-775219.jpeg?auto=compress&cs=tinysrgb&w=800",
                "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800"
            ));
            pg3.setOwner(owner);
            pg3.setVerified(true);
            pg3.setVerificationStatus("APPROVED");

            pgRepository.saveAll(List.of(pg1, pg2, pg3));
        };
    }
}