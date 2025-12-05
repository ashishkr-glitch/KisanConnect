package com.newKisan.controller;

import com.newKisan.entity.Rating;
import com.newKisan.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "*")
public class RatingController {

    @Autowired
    private RatingRepository ratingRepository;

    @PostMapping
    public Rating createRating(@RequestBody Map<String, Object> payload) {
        String farmerId = (String) payload.get("farmerId");
        String buyerUid = (String) payload.get("buyerUid");
        String buyerName = (String) payload.get("buyerName");
        Integer rating = (Integer) payload.get("rating");
        String review = (String) payload.get("review");

        if (farmerId == null || buyerUid == null || rating == null) {
            throw new RuntimeException("farmerId, buyerUid, and rating are required");
        }

        if (rating < 1 || rating > 5) {
            throw new RuntimeException("rating must be between 1 and 5");
        }

        Rating newRating = new Rating(farmerId, buyerUid, buyerName, rating, review);
        return ratingRepository.save(newRating);
    }

    @GetMapping("/farmer/{farmerId}")
    public List<Rating> getRatingsByFarmer(@PathVariable String farmerId) {
        return ratingRepository.findByFarmerId(farmerId);
    }

    @GetMapping("/buyer/{buyerUid}")
    public List<Rating> getRatingsByBuyer(@PathVariable String buyerUid) {
        return ratingRepository.findByBuyerUid(buyerUid);
    }

    @GetMapping("/farmer/{farmerId}/average")
    public Map<String, Object> getAverageRating(@PathVariable String farmerId) {
        Double averageRating = ratingRepository.getAverageRatingByFarmerId(farmerId);
        Long count = ratingRepository.getCountByFarmerId(farmerId);

        return Map.of(
            "farmerId", farmerId,
            "averageRating", averageRating != null ? averageRating : 0.0,
            "count", count != null ? count : 0L
        );
    }

    @DeleteMapping("/{id}")
    public void deleteRating(@PathVariable Long id) {
        ratingRepository.deleteById(id);
    }
}
