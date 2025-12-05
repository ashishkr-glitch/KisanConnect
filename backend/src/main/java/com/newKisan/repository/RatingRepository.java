package com.newKisan.repository;

import com.newKisan.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByFarmerId(String farmerId);
    
    List<Rating> findByBuyerUid(String buyerUid);
    
    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.farmerId = :farmerId")
    Double getAverageRatingByFarmerId(String farmerId);
    
    @Query("SELECT COUNT(r) FROM Rating r WHERE r.farmerId = :farmerId")
    Long getCountByFarmerId(String farmerId);
}
