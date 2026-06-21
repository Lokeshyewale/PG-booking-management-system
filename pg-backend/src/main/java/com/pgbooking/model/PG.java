// package com.pgbooking.model;

// import com.fasterxml.jackson.annotation.JsonIgnore;
// import jakarta.persistence.*;
// import java.util.ArrayList;
// import java.util.List;

// @Entity
// @Table(name = "pgs")
// public class PG {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     private String name;
//     private String address;
//     private String city;
//     private String description;
//     private double rent;
//     private int availableRooms;
//     private String type;
//     private String category;
//     private String size;
//     private String primaryImage;
//     private double rating = 4.5;
//     private int reviewCount = 0;

//     // Verification: admin must approve before PG is visible to students
//     private boolean verified = false;
//     private String verificationStatus = "PENDING"; // PENDING, APPROVED, REJECTED

//     @ElementCollection
//     @CollectionTable(name = "pg_amenities", joinColumns = @JoinColumn(name = "pg_id"))
//     @Column(name = "amenity")
//     private List<String> amenities = new ArrayList<>();

//     @ElementCollection
//     @CollectionTable(name = "pg_images", joinColumns = @JoinColumn(name = "pg_id"))
//     @Column(name = "image_url")
//     private List<String> images = new ArrayList<>();

//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "owner_id")
//     @JsonIgnore
//     private User owner;

//     @OneToMany(mappedBy = "pg", cascade = CascadeType.ALL, orphanRemoval = true)
//     @JsonIgnore
//     private List<Review> reviews = new ArrayList<>();

//     @OneToMany(mappedBy = "pg", cascade = CascadeType.ALL, orphanRemoval = true)
//     @JsonIgnore
//     private List<Booking> bookings = new ArrayList<>();

//     public PG() {}

//     // --- Convenience getters to match frontend field names ---
//     public double getPrice() { return rent; }
//     public String getImage() {
//         if (primaryImage != null && !primaryImage.isEmpty()) return primaryImage;
//         if (images != null && !images.isEmpty()) return images.get(0);
//         return "";
//     }

//     // --- All getters/setters ---
//     public Long getId() { return id; }
//     public void setId(Long id) { this.id = id; }
//     public String getName() { return name; }
//     public void setName(String name) { this.name = name; }
//     public String getAddress() { return address; }
//     public void setAddress(String address) { this.address = address; }
//     public String getCity() { return city; }
//     public void setCity(String city) { this.city = city; }
//     public String getDescription() { return description; }
//     public void setDescription(String description) { this.description = description; }
//     public double getRent() { return rent; }
//     public void setRent(double rent) { this.rent = rent; }
//     public int getAvailableRooms() { return availableRooms; }
//     public void setAvailableRooms(int availableRooms) { this.availableRooms = availableRooms; }
//     public List<String> getAmenities() { return amenities; }
//     public void setAmenities(List<String> amenities) { this.amenities = amenities; }
//     public List<String> getImages() { return images; }
//     public void setImages(List<String> images) { this.images = images; }
//     public String getType() { return type; }
//     public void setType(String type) { this.type = type; }
//     public String getCategory() { return category; }
//     public void setCategory(String category) { this.category = category; }
//     public String getSize() { return size; }
//     public void setSize(String size) { this.size = size; }
//     public String getPrimaryImage() { return primaryImage; }
//     public void setPrimaryImage(String primaryImage) { this.primaryImage = primaryImage; }
//     public double getRating() { return rating; }
//     public void setRating(double rating) { this.rating = rating; }
//     public int getReviewCount() { return reviewCount; }
//     public void setReviewCount(int reviewCount) { this.reviewCount = reviewCount; }
//     public boolean isVerified() { return verified; }
//     public void setVerified(boolean verified) { this.verified = verified; }
//     public String getVerificationStatus() { return verificationStatus; }
//     public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }
//     public User getOwner() { return owner; }
//     public void setOwner(User owner) { this.owner = owner; }
//     public List<Review> getReviews() { return reviews; }
//     public void setReviews(List<Review> reviews) { this.reviews = reviews; }
//     public List<Booking> getBookings() { return bookings; }
//     public void setBookings(List<Booking> bookings) { this.bookings = bookings; }
// }












package com.pgbooking.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pgs")
public class PG {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 500)
    private String name;

    @Column(length = 500)
    private String address;

    @Column(length = 255)
    private String city;

    @Column(columnDefinition = "TEXT")
    private String description;

    private double rent;
    private int availableRooms;
    private String type;
    private String category;
    private String size;

    @Column(columnDefinition = "TEXT")
    private String primaryImage;

    private double rating = 4.5;
    private int reviewCount = 0;

    private boolean verified = false;

    @Column(length = 50)
    private String verificationStatus = "PENDING";

    @ElementCollection
    @CollectionTable(name = "pg_amenities", joinColumns = @JoinColumn(name = "pg_id"))
    @Column(name = "amenity", length = 255)
    private List<String> amenities = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "pg_images", joinColumns = @JoinColumn(name = "pg_id"))
    @Column(name = "image_url", columnDefinition = "TEXT")
    private List<String> images = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    @JsonIgnore
    private User owner;

    @OneToMany(mappedBy = "pg", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "pg", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Booking> bookings = new ArrayList<>();

    public PG() {}

    public double getPrice() { return rent; }
    public String getImage() {
        if (primaryImage != null && !primaryImage.isEmpty()) return primaryImage;
        if (images != null && !images.isEmpty()) return images.get(0);
        return "";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public double getRent() { return rent; }
    public void setRent(double rent) { this.rent = rent; }
    public int getAvailableRooms() { return availableRooms; }
    public void setAvailableRooms(int availableRooms) { this.availableRooms = availableRooms; }
    public List<String> getAmenities() { return amenities; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
    public String getPrimaryImage() { return primaryImage; }
    public void setPrimaryImage(String primaryImage) { this.primaryImage = primaryImage; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public int getReviewCount() { return reviewCount; }
    public void setReviewCount(int reviewCount) { this.reviewCount = reviewCount; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }
    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
    public List<Review> getReviews() { return reviews; }
    public void setReviews(List<Review> reviews) { this.reviews = reviews; }
    public List<Booking> getBookings() { return bookings; }
    public void setBookings(List<Booking> bookings) { this.bookings = bookings; }
}