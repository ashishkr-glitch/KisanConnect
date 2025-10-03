package com.newKisan.controller;

import com.newKisan.entity.Farmer;
import com.newKisan.service.FarmerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/farmers")
@CrossOrigin
public class FarmerController {
    private  final FarmerService farmerService;

    public FarmerController(FarmerService farmerService){
        this.farmerService = farmerService;
    }

    @PostMapping
    public Farmer addFarmer(@RequestBody Farmer farmer){
        return farmerService.saveFarmer(farmer);
    }

    @GetMapping
    public List<Farmer> getFarmer(){
        return farmerService.getAllFarmers();
    }

    @GetMapping("/{id}")
    public Farmer getFarmerById(@PathVariable Long id) {
        return farmerService.getFarmerById(id);
    }

    @PutMapping("/{id}")
    public Farmer updateFarmer(@PathVariable Long id, @RequestBody Farmer updatedFarmer) {
        return farmerService.updateFarmer(id, updatedFarmer);
    }

    @DeleteMapping("/{id}")
    public void deleteFarmer(@PathVariable Long id) {
        farmerService.deleteFarmer(id);
    }

}
