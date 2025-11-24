package com.newKisan.controller;

import com.newKisan.entity.Farmer;
import com.newKisan.service.FarmerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmers")
@CrossOrigin(origins = "*")
public class FarmerController {

    @Autowired
    private FarmerService farmerService;

    @GetMapping
    public List<Farmer> getAllFarmers() {
        return farmerService.getAllFarmers();
    }

    @PostMapping
    public Farmer addFarmer(@RequestBody Farmer farmer) {
        return farmerService.addFarmer(farmer);
    }

    @DeleteMapping("/{uid}")
    public void deleteFarmer(@PathVariable String uid) {
        farmerService.deleteFarmer(uid);
    }
}