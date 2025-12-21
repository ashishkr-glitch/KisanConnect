package com.newKisan.controller;

import com.newKisan.entity.Farmer;
import com.newKisan.entity.Order;
import com.newKisan.repository.CropRepository;
import com.newKisan.repository.FarmerRepository;
import com.newKisan.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {

    @Autowired
    private CropRepository cropRepo;

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private FarmerRepository farmerRepo;

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        Map<String, Object> resp = new HashMap<>();

        // Basic counts
        long totalCrops = cropRepo.count();
        long totalFarms = farmerRepo.count();

        // Total quantity available (sum of crop.quantity)
        long totalAvailable = cropRepo.findAll().stream().mapToLong(c -> c.getQuantity()).sum();

        // Total sold (sum of order.quantity)
        long totalSold = orderRepo.findAll().stream().mapToLong(o -> o.getQuantity()).sum();

        double avgQuantityPerCrop = totalCrops == 0 ? 0 : (double) totalAvailable / totalCrops;

        resp.put("totalCrops", totalCrops);
        resp.put("activeFarms", totalFarms);
        resp.put("totalAvailableQuantity", totalAvailable);
        resp.put("totalSoldQuantity", totalSold);
        resp.put("avgQuantityPerCrop", Math.round(avgQuantityPerCrop * 100.0) / 100.0);

        // Time series: aggregate orders by month (last 6 months)
        List<Order> orders = orderRepo.findAll();
        Map<YearMonth, Long> monthAgg = new TreeMap<>();
        YearMonth now = YearMonth.now();
        for (int i = 5; i >= 0; i--) {
            monthAgg.put(now.minusMonths(i), 0L);
        }

        for (Order o : orders) {
            LocalDateTime dt = o.getCreatedAt();
            if (dt == null) continue;
            YearMonth ym = YearMonth.of(dt.getYear(), dt.getMonth());
            if (monthAgg.containsKey(ym)) {
                monthAgg.put(ym, monthAgg.get(ym) + o.getQuantity());
            }
        }

        List<Map<String, Object>> timeSeries = monthAgg.entrySet().stream().map(e -> {
            Map<String, Object> m = new HashMap<>();
            String label = e.getKey().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + e.getKey().getYear();
            m.put("period", label);
            m.put("soldQuantity", e.getValue());
            return m;
        }).collect(Collectors.toList());

        resp.put("timeSeries", timeSeries);

        // Top farms by sold quantity (from orders)
        Map<String, Long> perFarmer = new HashMap<>();
        for (Order o : orders) {
            String fid = o.getFarmerId();
            if (fid == null) continue;
            perFarmer.put(fid, perFarmer.getOrDefault(fid, 0L) + o.getQuantity());
        }

        List<Map<String, Object>> farms = perFarmer.entrySet().stream()
                .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                .limit(10)
                .map(e -> {
                    Map<String, Object> f = new HashMap<>();
                    String fid = e.getKey();
                    Optional<Farmer> farmerOpt = farmerRepo.findById(fid);
                    String name = farmerOpt.map(fr -> fr.getFirstName() + " " + fr.getLastName()).orElse("Farmer " + fid);
                    String district = farmerOpt.map(Farmer::getDistrict).orElse("");
                    f.put("id", fid);
                    f.put("name", name);
                    f.put("district", district);
                    f.put("soldQuantity", e.getValue());
                    return f;
                }).collect(Collectors.toList());

        resp.put("farms", farms);

        return resp;
    }
}
