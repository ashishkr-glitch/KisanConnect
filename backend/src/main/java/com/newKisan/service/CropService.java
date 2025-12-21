package com.newKisan.service;

import com.newKisan.entity.Crop;
import com.newKisan.repository.CropRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class CropService {

    @Autowired
    private CropRepository cropRepo;

    @Autowired
    private com.newKisan.repository.FarmerRepository farmerRepo;

    public List<Crop> getAllCrops() {
        return cropRepo.findAll();
    }

    public List<Crop> getCropsByFarmer(String farmerId) {
        return cropRepo.findByFarmerId(farmerId);
    }

    public Crop addCrop(Crop crop) {
        return cropRepo.save(crop);
    }

    public Crop updateCrop(Long id, Crop updatedCrop) {
        Crop crop = cropRepo.findById(id).orElseThrow();
        crop.setQuantity(updatedCrop.getQuantity());
        crop.setHarvestDate(updatedCrop.getHarvestDate());

        if (updatedCrop.getQuantity() <= 0) {
            cropRepo.deleteById(id);
            return null;
        }

        return cropRepo.save(crop);
    }

    public void deleteCrop(Long id) {
        cropRepo.deleteById(id);
    }

    public Map<String, Object> getStats() {
        List<Crop> all = cropRepo.findAll();
        Map<String, Object> out = new HashMap<>();
        long totalQuantity = all.stream().mapToLong(c -> (long) c.getQuantity()).sum();
        out.put("totalQuantity", totalQuantity);

        Map<String, Long> cropTypes = all.stream().collect(Collectors.groupingBy(c -> c.getCropType() == null ? "UNKNOWN" : c.getCropType(), Collectors.counting()));
        out.put("cropTypes", cropTypes);

        Map<String, Long> districtCounts = new HashMap<>();
        for (Crop c : all) {
            try {
                String fid = c.getFarmerId();
                if (fid == null) continue;
                var f = farmerRepo.findById(fid);
                if (f.isPresent()) {
                    String d = f.get().getDistrict();
                    districtCounts.put(d, districtCounts.getOrDefault(d, 0L) + 1L);
                }
            } catch (Exception ignore) {}
        }
        out.put("topDistricts", districtCounts);
        return out;
    }
}