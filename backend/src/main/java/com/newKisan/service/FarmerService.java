package com.newKisan.service;

import com.newKisan.entity.Farmer;
import com.newKisan.repository.FarmerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FarmerService {
    private final FarmerRepository farmerRepository;

    public FarmerService(FarmerRepository farmerRepository){
        this.farmerRepository = farmerRepository;
    }

    public List<Farmer> getAllFarmers(){
        return farmerRepository.findAll();
    }

    public Farmer saveFarmer(Farmer farmer){
        return farmerRepository.save(farmer);
    }

    public Farmer getFarmerById(Long id) {
        return farmerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Farmer not found with id: " + id));
    }

    public Farmer updateFarmer(Long id, Farmer updatedFarmer) {
        Farmer existingFarmer = getFarmerById(id);
        existingFarmer.setName(updatedFarmer.getName());
        existingFarmer.setLocation(updatedFarmer.getLocation());
        existingFarmer.setCropType(updatedFarmer.getCropType());
        existingFarmer.setHarvestDate(updatedFarmer.getHarvestDate());
        return farmerRepository.save(existingFarmer);
    }

    public void deleteFarmer(Long id) {
        farmerRepository.deleteById(id);
    }

}
