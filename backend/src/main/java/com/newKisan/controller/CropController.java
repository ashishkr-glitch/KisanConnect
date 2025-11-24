package com.newKisan.controller;

import com.newKisan.entity.Crop;
import com.newKisan.service.CropService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crops")
@CrossOrigin(origins = "*")
public class CropController {

    @Autowired
    private CropService cropService;

    @GetMapping
    public List<Crop> getAllCrops() {
        return cropService.getAllCrops();
    }

    @GetMapping("/farmer/{farmerId}")
    public List<Crop> getCropsByFarmer(@PathVariable String farmerId) {
        return cropService.getCropsByFarmer(farmerId);
    }

    @PostMapping
    public Crop addCrop(@RequestBody Crop crop) {
        return cropService.addCrop(crop);
    }

    @PutMapping("/{id}")
    public Crop updateCrop(@PathVariable Long id, @RequestBody Crop updatedCrop) {
        return cropService.updateCrop(id, updatedCrop);
    }

    @DeleteMapping("/{id}")
    public void deleteCrop(@PathVariable Long id) {
        cropService.deleteCrop(id);
    }
}