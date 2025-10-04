package com.newKisan.service;

import com.newKisan.entity.Crop;
import com.newKisan.repository.CropRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CropService {

    @Autowired
    private CropRepository cropRepo;

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
}