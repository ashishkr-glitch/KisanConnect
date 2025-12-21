package com.newKisan.service;

import com.newKisan.entity.Crop;
import com.newKisan.entity.Order;
import com.newKisan.repository.CropRepository;
import com.newKisan.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AnalysisService {

    @Autowired
    private CropRepository cropRepository;

    @Autowired
    private OrderRepository orderRepository;

    public Map<String, Object> getAnalysisSummary() {
        Map<String, Object> summary = new HashMap<>();

        try {
            // Get all crops
            List<Crop> allCrops = cropRepository.findAll();

            // Calculate totals
            int totalQuantity = 0;
            int cropCount = 0;

            // Group by crop type
            Map<String, Integer> cropTypeQuantity = new HashMap<>();
            Set<String> farmerIds = new HashSet<>();

            for (Crop crop : allCrops) {
                totalQuantity += crop.getQuantity();
                cropCount++;
                farmerIds.add(crop.getFarmerId());

                // Group by crop type
                String cropType = crop.getCropType() != null ? crop.getCropType() : "Unknown";
                cropTypeQuantity.put(cropType, cropTypeQuantity.getOrDefault(cropType, 0) + crop.getQuantity());
            }

            summary.put("totalSoldQuantity", totalQuantity);
            summary.put("totalAvailableQuantity", totalQuantity);
            summary.put("cropCount", cropCount);
            summary.put("farmerCount", farmerIds.size());

            // Build farms list (using farmer IDs as proxy)
            List<Map<String, Object>> farms = new ArrayList<>();
            for (String farmerId : farmerIds) {
                Map<String, Object> farm = new HashMap<>();
                farm.put("farmerId", farmerId);
                farm.put("district", "District_" + farmerId.substring(0, Math.min(3, farmerId.length())));
                int farmerQuantity = allCrops.stream()
                        .filter(c -> farmerId.equals(c.getFarmerId()))
                        .mapToInt(Crop::getQuantity)
                        .sum();
                farm.put("soldQuantity", farmerQuantity);
                farms.add(farm);
            }

            summary.put("farms", farms);

            // Time series (monthly aggregation - simplified)
            List<Map<String, Object>> timeSeries = new ArrayList<>();
            Map<String, Object> ts = new HashMap<>();
            ts.put("period", "Overall");
            ts.put("soldQuantity", totalQuantity);
            timeSeries.add(ts);

            summary.put("timeSeries", timeSeries);

            return summary;
        } catch (Exception e) {
            // Return empty summary on error
            Map<String, Object> empty = new HashMap<>();
            empty.put("totalSoldQuantity", 0);
            empty.put("totalAvailableQuantity", 0);
            empty.put("farms", new ArrayList<>());
            empty.put("timeSeries", new ArrayList<>());
            return empty;
        }
    }
}
