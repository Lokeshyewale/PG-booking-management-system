package com.pgbooking.web.dto;

import java.util.List;

public class OwnerDashboardResponse {
    private int totalPGs;
    private int totalBookings;
    private double totalEarnings;
    private List<RecentBooking> recentBookings;

    public OwnerDashboardResponse(int totalPGs, int totalBookings, double totalEarnings, List<RecentBooking> recentBookings) {
        this.totalPGs = totalPGs;
        this.totalBookings = totalBookings;
        this.totalEarnings = totalEarnings;
        this.recentBookings = recentBookings;
    }

    public int getTotalPGs() {
        return totalPGs;
    }

    public void setTotalPGs(int totalPGs) {
        this.totalPGs = totalPGs;
    }

    public int getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(int totalBookings) {
        this.totalBookings = totalBookings;
    }

    public double getTotalEarnings() {
        return totalEarnings;
    }

    public void setTotalEarnings(double totalEarnings) {
        this.totalEarnings = totalEarnings;
    }

    public List<RecentBooking> getRecentBookings() {
        return recentBookings;
    }

    public void setRecentBookings(List<RecentBooking> recentBookings) {
        this.recentBookings = recentBookings;
    }

    public static class RecentBooking {
        private Long id;
        private Long pgId;
        private String status;
        private String checkInDate;
        private String checkOutDate;
        private String bookingDate;

        public RecentBooking(Long id, Long pgId, String status, String checkInDate, String checkOutDate, String bookingDate) {
            this.id = id;
            this.pgId = pgId;
            this.status = status;
            this.checkInDate = checkInDate;
            this.checkOutDate = checkOutDate;
            this.bookingDate = bookingDate;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getPgId() {
            return pgId;
        }

        public void setPgId(Long pgId) {
            this.pgId = pgId;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getCheckInDate() {
            return checkInDate;
        }

        public void setCheckInDate(String checkInDate) {
            this.checkInDate = checkInDate;
        }

        public String getCheckOutDate() {
            return checkOutDate;
        }

        public void setCheckOutDate(String checkOutDate) {
            this.checkOutDate = checkOutDate;
        }

        public String getBookingDate() {
            return bookingDate;
        }

        public void setBookingDate(String bookingDate) {
            this.bookingDate = bookingDate;
        }
    }
}
