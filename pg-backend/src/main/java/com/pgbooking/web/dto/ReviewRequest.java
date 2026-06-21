package com.pgbooking.web.dto;

public class ReviewRequest {
    private Long pgId;
    private int rating;
    private String comment;

    public Long getPgId() { return pgId; }
    public void setPgId(Long pgId) { this.pgId = pgId; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
