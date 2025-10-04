package com.newKisan.service;

import com.newKisan.entity.Farmer;
import com.newKisan.repository.FarmerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FarmerService {

    @Autowired
    private FarmerRepository farmerRepo;

    public List<Farmer> getAllFarmers() {
        return farmerRepo.findAll();
    }

    public Farmer addFarmer(Farmer farmer) {
        return farmerRepo.save(farmer);
    }

    public void deleteFarmer(String uid) {
        if (farmerRepo.existsById(uid)) {
            farmerRepo.deleteById(uid);
        } else {
            throw new RuntimeException("Farmer UID not found: " + uid);
        }
    }
}