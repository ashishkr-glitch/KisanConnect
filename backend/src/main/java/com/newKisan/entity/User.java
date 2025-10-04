// src/main/java/com/newKisan/entity/User.java
package com.newKisan.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class User {
    @Id
    private String uid;

    private String fullName;
    private String email;
    private String mobile;
    private String role;
    private String state;
    private String district;

    private String landSize;
    private String cropTypes;
    private String buyerType;
    private String interest;

    // Getters and setters

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getLandSize() {
        return landSize;
    }

    public void setLandSize(String landSize) {
        this.landSize = landSize;
    }

    public String getCropTypes() {
        return cropTypes;
    }

    public void setCropTypes(String cropTypes) {
        this.cropTypes = cropTypes;
    }

    public String getBuyerType() {
        return buyerType;
    }

    public void setBuyerType(String buyerType) {
        this.buyerType = buyerType;
    }

    public String getInterest() {
        return interest;
    }

    public void setInterest(String interest) {
        this.interest = interest;
    }

    @Override
    public String toString() {
        return "User{" +
                "uid='" + uid + '\'' +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", mobile='" + mobile + '\'' +
                ", role='" + role + '\'' +
                ", state='" + state + '\'' +
                ", district='" + district + '\'' +
                ", landSize='" + landSize + '\'' +
                ", cropTypes='" + cropTypes + '\'' +
                ", buyerType='" + buyerType + '\'' +
                ", interest='" + interest + '\'' +
                '}';
    }
}