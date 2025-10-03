package com.newKisan.entity;

import jakarta.persistence.*;


@Entity
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cropName;
    private String season;
    private Double expectedYield;

    @ManyToOne
    @JoinColumn(name = "farmer_id")
    private Farmer farmer;

    // Getters and Setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public String getSeason() {
        return season;
    }

    public void setSeason(String season) {
        this.season = season;
    }

    public Double getExpectedYield() {
        return expectedYield;
    }

    public void setExpectedYield(Double expectedYield) {
        this.expectedYield = expectedYield;
    }

    public Farmer getFarmer() {
        return farmer;
    }

    public void setFarmer(Farmer farmer) {
        this.farmer = farmer;
    }

    @Override
    public String toString() {
        return "Crop{" +
                "id=" + id +
                ", cropName='" + cropName + '\'' +
                ", season='" + season + '\'' +
                ", expectedYield=" + expectedYield +
                ", farmer=" + farmer +
                '}';
    }
}
