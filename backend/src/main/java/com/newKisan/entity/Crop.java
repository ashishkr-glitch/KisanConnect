package com.newKisan.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "crops")
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    private String cropName;
//    private String season;
//    private Double expectedYield;
//
//    @ManyToOne
//    @JoinColumn(name = "farmer_id")
//    private Farmer farmer;

    private String farmerId;
    private String cropType;
    private int quantity;
    private String harvestDate;

    // Getters and Setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(String farmerId) {
        this.farmerId = farmerId;
    }

    public String getCropType() {
        return cropType;
    }

    public void setCropType(String cropType) {
        this.cropType = cropType;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getHarvestDate() {
        return harvestDate;
    }

    public void setHarvestDate(String harvestDate) {
        this.harvestDate = harvestDate;
    }

    @Override
    public String toString() {
        return "Crop{" +
                "id=" + id +
                ", farmerId='" + farmerId + '\'' +
                ", cropType='" + cropType + '\'' +
                ", quantity=" + quantity +
                ", harvestDate='" + harvestDate + '\'' +
                '}';
    }
}
