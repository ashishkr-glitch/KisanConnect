package com.newKisan.controller;

import com.newKisan.entity.Buyer;
import com.newKisan.service.BuyerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buyers")
@CrossOrigin(origins = "*")
public class BuyerController {

    @Autowired
    private BuyerService buyerService;

    @GetMapping
    public List<Buyer> getAllBuyers() {
        return buyerService.getAllBuyers();
    }

    @PostMapping
    public Buyer addBuyer(@RequestBody Buyer buyer) {
        return buyerService.addBuyer(buyer);
    }

    @DeleteMapping("/{uid}")
    public void deleteBuyer(@PathVariable String uid) {
        buyerService.deleteBuyer(uid);
    }
}