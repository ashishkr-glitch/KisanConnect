package com.newKisan.service;

import com.newKisan.entity.Crop;
import com.newKisan.repository.CropRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CropService {
    private final CropRepository cropRepository;

    public CropService(CropRepository cropRepository){
        this.cropRepository = cropRepository;
    }

    public Crop saveCrop(Crop crop) {
        return cropRepository.save(crop);
    }

    public List<Crop> getAllCrops() {
        return cropRepository.findAll();
    }

    public void deleteCrop(Long id) {
        cropRepository.deleteById(id);
    }

}
