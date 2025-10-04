package com.newKisan.service;

import com.newKisan.entity.Buyer;
import com.newKisan.repository.BuyerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BuyerService {

    @Autowired
    private BuyerRepository buyerRepo;

    public List<Buyer> getAllBuyers() {
        return buyerRepo.findAll();
    }

    public Buyer addBuyer(Buyer buyer) {
        return buyerRepo.save(buyer);
    }

    public void deleteBuyer(String uid) {
        buyerRepo.deleteById(uid);
    }
}