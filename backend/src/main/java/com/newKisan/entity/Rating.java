package com.newKisan.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ratings")
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String farmerId;
    private String buyerUid;
    private String buyerName;
    private int rating;
    private String review;
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    // Constructors
    public Rating() {}

    public Rating(String farmerId, String buyerUid, String buyerName, int rating, String review) {
        this.farmerId = farmerId;
        this.buyerUid = buyerUid;
        this.buyerName = buyerName;
        this.rating = rating;
        this.review = review;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFarmerId() { return farmerId; }
    public void setFarmerId(String farmerId) { this.farmerId = farmerId; }

    public String getBuyerUid() { return buyerUid; }
    public void setBuyerUid(String buyerUid) { this.buyerUid = buyerUid; }

    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getReview() { return review; }
    public void setReview(String review) { this.review = review; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
